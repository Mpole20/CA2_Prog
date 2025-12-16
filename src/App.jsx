
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home';
import StoreLuggage from './StoreLuggage';
import RetrieveLuggage from './RetrieveLuggage';
import Admin from './Admin';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            🧳 Luggage Storage
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/store">Store</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/retrieve">Retrieve</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<StoreLuggage />} />
          <Route path="/retrieve" element={<RetrieveLuggage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      <footer className="mt-5 py-3 bg-light border-top">
        <div className="container text-center">
          <p className="mb-0">Luggage Storage System - Assignment Project</p>
          <small className="text-muted">Layered Architecture | React + Node + SQL Server</small>
        </div>
      </footer>
    </Router>
  );
}

export default App;