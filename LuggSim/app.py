from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta
import secrets

app = Flask(__name__)
CORS(app)

DATA_FILE = 'storage.json'

# ===== FRONTEND SERVING =====
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    if os.path.exists(path) and '.' in path:
        return send_from_directory('.', path)
    return "Not found", 404

# ===== BACKEND API =====
def load_data():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/api/status')
def get_status():
    data = load_data()
    lockers = data["lockers"]
    available = sum(1 for l in lockers if l["status"] == "available")
    occupied = sum(1 for l in lockers if l["status"] == "occupied")
    reserved = sum(1 for l in lockers if l["status"] == "reserved")
    
    return jsonify({
        "success": True,
        "lockers": lockers,
        "statistics": {
            "total": len(lockers),
            "available": available,
            "occupied": occupied,
            "reserved": reserved,
            "small_available": sum(1 for l in lockers if l["size"] == "Small" and l["status"] == "available"),
            "medium_available": sum(1 for l in lockers if l["size"] == "Medium" and l["status"] == "available"),
            "large_available": sum(1 for l in lockers if l["size"] == "Large" and l["status"] == "available"),
            "prices": data["settings"]["prices"]
        }
    })

@app.route('/api/reserve', methods=['POST'])
def reserve_locker():
    data = request.json
    size = data.get("size")
    code = data.get("code")
    
    if not size or not code or len(code) != 6 or not code.isdigit():
        return jsonify({"success": False, "error": "Invalid size or code"}), 400
    
    db = load_data()
    
    if any(l["code"] == code for l in db["lockers"]):
        return jsonify({"success": False, "error": "Code already in use"}), 400
    
    available = [l for l in db["lockers"] if l["size"] == size and l["status"] == "available"]
    if not available:
        return jsonify({"success": False, "error": f"No {size} lockers available"}), 400
    
    locker = available[0]
    locker.update({
        "status": "reserved",
        "code": code,
        "reserved_at": datetime.now().isoformat(),
        "expires_at": (datetime.now() + timedelta(hours=24)).isoformat()
    })
    
    db["transactions"].append({
        "id": secrets.token_hex(8),
        "locker_number": locker["number"],
        "action": "store",
        "code": code,
        "timestamp": datetime.now().isoformat(),
        "size": size
    })
    
    save_data(db)
    return jsonify({
        "success": True,
        "locker_number": locker["number"],
        "message": f"Locker {locker['number']} reserved"
    })

@app.route('/api/verify', methods=['POST'])
def verify_code():
    data = request.json
    code = data.get("code")
    
    if not code:
        return jsonify({"success": False, "error": "Missing code"}), 400
    
    db = load_data()
    locker = next((l for l in db["lockers"] if l["code"] == code), None)
    
    if not locker or locker["status"] not in ["occupied", "reserved"]:
        return jsonify({"success": False, "error": "Invalid code or locker not in use"}), 400
    
    return jsonify({
        "success": True,
        "locker_number": locker["number"],
        "size": locker["size"],
        "status": locker["status"],
        "payment_status": locker["payment_status"]
    })

@app.route('/api/pay', methods=['POST'])
def process_payment():
    data = request.json
    code = data.get("code")
    payment_method = data.get("payment_method")
    
    if not code or not payment_method:
        return jsonify({"success": False, "error": "Missing code or payment method"}), 400
    
    db = load_data()
    locker = next((l for l in db["lockers"] if l["code"] == code), None)
    
    if not locker:
        return jsonify({"success": False, "error": "Invalid code"}), 400
    
    if locker["payment_status"] == "paid":
        return jsonify({"success": False, "error": "Payment already processed"}), 400
    
    price = db["settings"]["prices"].get(locker["size"], 5)
    locker.update({
        "payment_method": payment_method,
        "payment_status": "paid",
        "status": "occupied"
    })
    
    db["transactions"].append({
        "id": secrets.token_hex(8),
        "locker_number": locker["number"],
        "action": "payment",
        "code": code,
        "timestamp": datetime.now().isoformat(),
        "payment_method": payment_method,
        "payment_amount": price
    })
    
    save_data(db)
    return jsonify({
        "success": True,
        "locker_number": locker["number"],
        "message": f"Payment of ${price} processed"
    })

@app.route('/api/open', methods=['POST'])
def open_locker():
    data = request.json
    locker_number = data.get("locker_number")
    
    if not locker_number:
        return jsonify({"success": False, "error": "Missing locker number"}), 400
    
    db = load_data()
    locker = next((l for l in db["lockers"] if l["number"] == locker_number), None)
    
    if not locker or locker["payment_status"] != "paid":
        return jsonify({"success": False, "error": "Payment required"}), 400
    
    # Reset locker
    for key in ["code", "reserved_at", "expires_at", "payment_method"]:
        locker[key] = None
    locker.update({
        "status": "available",
        "payment_status": "unpaid"
    })
    
    db["transactions"].append({
        "id": secrets.token_hex(8),
        "locker_number": locker["number"],
        "action": "retrieve",
        "timestamp": datetime.now().isoformat()
    })
    
    save_data(db)
    return jsonify({
        "success": True,
        "message": f"Locker {locker_number} opened"
    })

if __name__ == '__main__':
    print("🚀 Server: http://localhost:5000")
    print("📊 API:    http://localhost:5000/api/status")
    app.run(debug=True, port=5000)