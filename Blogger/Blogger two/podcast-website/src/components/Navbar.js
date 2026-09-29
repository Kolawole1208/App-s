// ...existing code...
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            🎙️ PodcastHub
          </Link>
        </div>

        <div className="navbar-search">
          <input 
            type="text" 
            placeholder="Search podcasts..."
            className="search-input"
          />
        </div>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/upload" className="nav-link upload-btn">Upload</Link>
              <div className="user-menu">
                <span className="username">{user?.username}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
// ...existing code...