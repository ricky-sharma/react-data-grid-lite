import React from 'react';
import { Link } from 'react-router-dom';
import './../src/navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
              <li><Link to="/">Grid1</Link></li>
              <li><Link to="/Grid2">Grid2</Link></li>
              <li><Link to="/Grid3">Grid3</Link></li>
              <li><Link to="/Grid4">Grid4</Link></li>
              <li><Link to="/Grid5">Grid5</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
