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
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
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
                className="menu--btn alignCenter"
                onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((prev) => !prev);
                    setFocusedIndex(0);
                }}
                style={{
                    background: 'none',
                    fontSize: '30px',
                    cursor: 'pointer',
                    top: '1px',
                    position: 'relative',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    border: menuOpen ? '1px solid rgba(0, 0, 0, 0.4)' : undefined
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
                        top: 40,
                        right: 0,
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        padding: '5px 0',
                        minWidth: '200px',
                        zIndex: 15
                    }}
                >
                    {items.map((item, index) =>
                        !item?.hidden && (
                            <div
                                key={index}
                                className="opacity--level menu--item"
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
                                <div
                                    style={{
                                        gap: '25px',
                                        alignItems: 'center',
                                        display: 'inline-flex'
                                    }}
                                    className="pd--0 mg--0 icon-content">
                                    <div>{item?.icon} </div>
                                    <div
                                        title={item?.tooltip}
                                        style={{
                                            position: 'relative',
                                            justifyContent: 'left',
                                            display: 'inline-flex'
                                        }}>
                                        {item?.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default Menu;