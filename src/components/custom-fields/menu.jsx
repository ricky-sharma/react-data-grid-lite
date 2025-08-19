import React, { useEffect, useRef, useState } from 'react';

const Menu = ({items}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            style={{
                display: 'inline-block'
            }}>
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer'
                }}
            >
                ⋮
            </button>

            {menuOpen && (
                <div
                    ref={menuRef}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        padding: '5px 0',
                        minWidth: '120px',
                        zIndex: 15
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="opacity--7"
                            style={{ padding: '8px 12px', cursor: 'pointer' }}
                            onClick={(e) => {
                                e.preventDefault();
                                setMenuOpen(false);
                                const args = Array.isArray(item.args) ? item.args : [];
                                item?.action?.(...args, e);
                            }}
                        >
                            {item?.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Menu;