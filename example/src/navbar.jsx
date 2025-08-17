import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './../src/navbar.css';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const isActive = (path) => location.pathname === path;

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
                <li>
                    <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Column Drag-Drop
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/Grid1" className={isActive('/Grid1') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Interactive Grid
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/Grid2" className={isActive('/Grid2') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Row Actions
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/Grid5" className={isActive('/Grid5') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Pinned &amp; Resizable Columns
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/Grid7" className={isActive('/Grid7') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Inline Cell Editing
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/Grid3" className={isActive('/Grid3') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Dynamic Images Grid
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/Grid4" className={isActive('/Grid4') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Default Presentation
                    </Link>
                    <span></span>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
