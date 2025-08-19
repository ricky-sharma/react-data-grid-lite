import React, { useEffect, useRef, useState } from 'react';

const Menu = ({ items }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const menuRef = useRef();
    const itemRefs = useRef([]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!menuOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex((prev) => (prev + 1) % items.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const item = items[focusedIndex];
                const args = Array.isArray(item.args) ? item.args : [];
                item?.action?.(...args, e);
                setMenuOpen(false);
            } else if (e.key === 'Escape' || e.key === 'Tab') {
                setMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [menuOpen, focusedIndex, items]);

    useEffect(() => {
        if (menuOpen && itemRefs.current[focusedIndex]) {
            itemRefs.current[focusedIndex].focus();
        }
    }, [focusedIndex, menuOpen]);

    return (
        <div style={{ display: 'inline-block', position: 'relative' }}>
            <button
                className="menu--btn"
                onClick={() => {
                    setMenuOpen((prev) => !prev);
                    setFocusedIndex(0);
                }}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer'
                }}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-label="Open menu"
            >
                ⋮
            </button>

            {menuOpen && (
                <div
                    ref={menuRef}
                    role="menu"
                    style={{
                        position: 'absolute',
                        top: 25,
                        right: 0,
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        padding: '5px 0',
                        minWidth: '160px',
                        zIndex: 15
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="opacity--7 menu--item"
                            role="menuitem"
                            ref={(el) => (itemRefs.current[index] = el)}
                            tabIndex={-1}
                            style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                outline: 'none',
                                backgroundColor: focusedIndex === index ? '#eee' : 'transparent'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                const args = Array.isArray(item.args) ? item.args : [];
                                item?.action?.(...args, e);
                                setMenuOpen(false);
                            }}
                            onMouseEnter={() => setFocusedIndex(index)}
                        >
                            {item?.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;