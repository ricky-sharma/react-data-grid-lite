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
                    <Link to="/column-drag-drop" className={isActive('/column-drag-drop') || isActive('/') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Column Drag-Drop
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/interactive-grid" className={isActive('/interactive-grid') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Interactive Grid
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/row-actions" className={isActive('/row-actions') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Row Actions
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/pinned-and-resizable-columns" className={isActive('/pinned-and-resizable-columns') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Pinned &amp; Resizable Columns
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/inline-cell-editing" className={isActive('/inline-cell-editing') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Inline Cell Editing
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/dynamic-images-grid" className={isActive('/dynamic-images-grid') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Dynamic Images Grid
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/default-presentation" className={isActive('/default-presentation') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Default Presentation
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/right-to-left" className={isActive('/right-to-left') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Right To Left
                    </Link>
                    <span></span>
                </li>
                <li>
                    <Link to="/million-cells" className={isActive('/million-cells') ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        Million Cells
                    </Link>
                    <span></span>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
