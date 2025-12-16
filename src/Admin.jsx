
import React, { useState, useEffect } from 'react';

function Admin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {

      setStats({
        total_lockers: 12,
        available_lockers: 8,
        active_sessions: 4,
        revenue_today: 48,
        popular_size: 'medium'
      });
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>📊 Admin Dashboard</h2>
      
      {loading ? (
        <p>Loading statistics...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : stats && (
        <div className="row mt-4">
          <div className="col-md-3 mb-3">
            <div className="card text-white bg-primary">
              <div className="card-body">
                <h5 className="card-title">Total Lockers</h5>
                <h2>{stats.total_lockers}</h2>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <div className="card text-white bg-success">
              <div className="card-body">
                <h5 className="card-title">Available</h5>
                <h2>{stats.available_lockers}</h2>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <div className="card text-white bg-warning">
              <div className="card-body">
                <h5 className="card-title">Active Sessions</h5>
                <h2>{stats.active_sessions}</h2>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <div className="card text-white bg-info">
              <div className="card-body">
                <h5 className="card-title">Revenue Today</h5>
                <h2>${stats.revenue_today}</h2>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="card mt-4">
        <div className="card-body">
          <h5>System Information</h5>
          <ul>
            <li><strong>Popular Size:</strong> {stats?.popular_size || 'N/A'}</li>
            <li><strong>Utilization:</strong> {stats ? Math.round((stats.total_lockers - stats.available_lockers) / stats.total_lockers * 100) : 0}%</li>
            <li><strong>Avg Revenue/Session:</strong> ${stats ? (stats.revenue_today / (stats.active_sessions || 1)).toFixed(2) : '0.00'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Admin;