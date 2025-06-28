import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './../src/navbar.css';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <button className="navbar-toggle" onClick={toggleNavbar}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
            </div>
            <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
                <li><Link to="/" onClick={() => setIsOpen(false)}>Grid1</Link></li>
                <li><Link to="/Grid2" onClick={() => setIsOpen(false)}>Grid2</Link></li>
                <li><Link to="/Grid3" onClick={() => setIsOpen(false)}>Grid3</Link></li>
                <li><Link to="/Grid4" onClick={() => setIsOpen(false)}>Grid4</Link></li>
                <li><Link to="/Grid5" onClick={() => setIsOpen(false)}>Grid5</Link></li>
                <li><Link to="/Grid6" onClick={() => setIsOpen(false)}>Grid6</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
