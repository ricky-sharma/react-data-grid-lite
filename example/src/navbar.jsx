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
                <li><Link to="/" onClick={() => setIsOpen(false)}>Interactive Grid</Link><span></span></li>
                <li><Link to="/Grid2" onClick={() => setIsOpen(false)}>Row Actions</Link><span></span></li>
                <li><Link to="/Grid6" onClick={() => setIsOpen(false)}>Column Drag-and-Drop</Link><span></span></li>
                <li><Link to="/Grid5" onClick={() => setIsOpen(false)}>Pinned and Resizable Columns</Link><span></span></li>
                <li><Link to="/Grid7" onClick={() => setIsOpen(false)}>Inline Cell Editing</Link><span></span></li>
                <li><Link to="/Grid3" onClick={() => setIsOpen(false)}>Dynamic Images Grid</Link><span></span></li>
                <li><Link to="/Grid4" onClick={() => setIsOpen(false)}>Default Presentation</Link><span></span></li>
            </ul>
        </nav>
    );
}

export default Navbar;
