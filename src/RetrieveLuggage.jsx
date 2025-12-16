import React, { useState } from 'react';

function RetrieveLuggage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');

  const handleRetrieve = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid code');
      
      setSession(data);
    } catch (err) {
      setError(err.message);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await fetch('http://localhost:5000/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, amount: session.total_cost })
      });
      
      alert(`Payment of $${session.total_cost} successful! Locker unlocked.`);
      setSession(null);
      setCode('');
    } catch (err) {
      setError('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>🔓 Retrieve Luggage</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {!session ? (
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleRetrieve}>
              <div className="mb-3">
                <label>Enter 6-Digit Code:</label>
                <input
                  type="text"
                  className="form-control"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  placeholder="123456"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Loading...' : 'Retrieve'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <h4>Locker #{session.locker_id}</h4>
            <p>Duration: {session.duration_hours} hours</p>
            <p>Rate: ${session.hourly_rate}/hour</p>
            <h5 className="text-success">Total: ${session.total_cost}</h5>
            <button 
              className="btn btn-success w-100 mt-3" 
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay $${session.total_cost}`}
            </button>
            <button 
              className="btn btn-outline-secondary w-100 mt-2"
              onClick={() => setSession(null)}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RetrieveLuggage;