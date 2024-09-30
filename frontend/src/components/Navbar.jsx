// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Keep the existing styles

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Wrap the title in a Link component to go to the home page */}
      <h2 className="navbar-title">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Social2Connect
        </Link>
      </h2>
      <ul className="navbar-links">
        <li><Link to="/signup">Sign Up</Link></li>
        <li><Link to="/signin">Sign In</Link></li>
        <li><Link to="/posts">Posts</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
