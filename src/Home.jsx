
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container text-center mt-5">
      <div className="card border-0 shadow-lg">
        <div className="card-body p-5">
          <h1 className="display-4 mb-4">🧳 Luggage Storage System</h1>
          <p className="lead mb-5">
            Secure, automated luggage storage with real-time pricing
          </p>
          
          <div className="row justify-content-center">
            {/* Store Card */}
            <div className="col-md-5 mb-4">
              <div className="card h-100 border-primary">
                <div className="card-body">
                  <h3 className="card-title">📦 Store Luggage</h3>
                  <p className="card-text">
                    Store your bags securely. Choose from small, medium, or large lockers.
                    Get a unique code for retrieval.
                  </p>
                  <Link to="/store" className="btn btn-primary btn-lg w-100">
                    Store Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-5 mb-4">
              <div className="card h-100 border-success">
                <div className="card-body">
                  <h3 className="card-title">🔓 Retrieve Luggage</h3>
                  <p className="card-text">
                    Enter your 6-digit code to retrieve your luggage.
                    Pay based on storage duration.
                  </p>
                  <Link to="/retrieve" className="btn btn-success btn-lg w-100">
                    Retrieve Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <Link to="/admin" className="btn btn-outline-dark">
              Admin Dashboard
            </Link>
          </div>
          <div className="mt-5 pt-4 border-top">
            <h5>How It Works:</h5>
            <div className="row mt-3">
              <div className="col">
                <div className="p-3">
                  <h2>1</h2>
                  <p>Select Size & Store</p>
                </div>
              </div>
              <div className="col">
                <div className="p-3">
                  <h2>2</h2>
                  <p>Get Unique Code</p>
                </div>
              </div>
              <div className="col">
                <div className="p-3">
                  <h2>3</h2>
                  <p>Return & Enter Code</p>
                </div>
              </div>
              <div className="col">
                <div className="p-3">
                  <h2>4</h2>
                  <p>Pay & Retrieve</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;