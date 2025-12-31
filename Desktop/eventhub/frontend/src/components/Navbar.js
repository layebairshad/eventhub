import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🎫</span>
            <span className="logo-text">EventHub</span>
          </Link>

          <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/events" onClick={() => setMenuOpen(false)}>
              Events
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <div className="user-menu">
                  <span className="user-name">{user?.name}</span>
                  <button onClick={handleLogout} className="btn btn-outline">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

