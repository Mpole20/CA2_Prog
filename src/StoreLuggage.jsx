import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StoreLuggage() {
  const navigate = useNavigate();
  
  const [size, setSize] = useState('small');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setResult(data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📦 Store Your Luggage</h2>
      {result ? (
        <div className="alert alert-success">
          <h4>✅ Storage Confirmed!</h4>
          <p><strong>Locker Number:</strong> #{result.locker_id}</p>
          <p><strong>Your Access Code:</strong> 
            <span className="fs-4 text-dark ms-2">{result.code}</span>
          </p>
          <p><strong>Started At:</strong> {new Date(result.start_time).toLocaleTimeString()}</p>
          <p className="text-danger mt-3">
            <strong>⚠️ Important:</strong> Save this code! You'll need it to retrieve your luggage.
          </p>
          <div className="mt-3">
            <button 
              className="btn btn-primary me-2"
              onClick={() => navigate('/retrieve')}
            >
              Retrieve Another Bag
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">
                    <h5>Select Bag Size:</h5>
                  </label>
                  <div className="d-flex gap-3">
                    {[
                      { id: 'small', label: 'Small', price: '$2/hr', desc: 'Backpack, handbag' },
                      { id: 'medium', label: 'Medium', price: '$4/hr', desc: 'Suitcase, duffel' },
                      { id: 'large', label: 'Large', price: '$6/hr', desc: 'Multiple bags, golf clubs' }
                    ].map(option => (
                      <div 
                        key={option.id}
                        className={`card text-center ${size === option.id ? 'border-primary border-2' : ''}`}
                        style={{ width: '10rem', cursor: 'pointer' }}
                        onClick={() => setSize(option.id)}
                      >
                        <div className="card-body">
                          <h5 className="card-title">{option.label}</h5>
                          <p className="card-text text-success">{option.price}</p>
                          <small className="text-muted">{option.desc}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <input type="hidden" name="size" value={size} />

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Allocating Locker...
                    </>
                  ) : (
                    'Store My Luggage'
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Help text */}
          <div className="mt-4 text-muted">
            <p>
              <strong>How it works:</strong><br/>
              1. Select your bag size above<br/>
              2. We'll allocate the first available locker<br/>
              3. You'll receive a unique 6-digit code<br/>
              4. Use that code later to retrieve your luggage
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default StoreLuggage;