import React, { useEffect, useRef, useState } from 'react';
import { useGridConfig } from '../../hooks/use-grid-config';
import { useWindowWidth } from '../../hooks/use-window-width';
import { gridWidthType } from '../../utils/grid-width-type-utils';

const Menu = ({ items }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
    const menuRef = useRef();
    const itemRefs = useRef([]);
    const windowWidth = useWindowWidth();
    const { state = {} } = useGridConfig() ?? {};
    const { isSmallWidth } = gridWidthType(windowWidth, state?.gridID);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
                setOpenSubMenuIndex(null);
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
                setOpenSubMenuIndex(null);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
                setOpenSubMenuIndex(null);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const item = items[focusedIndex];
                const args = Array.isArray(item.args) ? item.args : [];
                if (item?.subItems) {
                    setOpenSubMenuIndex(focusedIndex);
                } else {
                    item?.action?.(...args, e);
                    setMenuOpen(false);
                }
            } else if (e.key === 'Escape' || e.key === 'Tab') {
                setMenuOpen(false);
                setOpenSubMenuIndex(null);
            } else if (e.key === 'ArrowLeft') {
                setOpenSubMenuIndex(null);
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

    const renderSubMenu = (subItems) => (
        <div
            role="menu"
            style={{
                position: 'absolute',
                top: 0,
                right: isSmallWidth ? 0 : '100%',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                padding: '5px 0',
                minWidth: '150px',
                zIndex: 20
            }}
        >
            {subItems.map((subItem, i) => (
                <div
                    key={i}
                    className="menu--item"
                    role="menuitem"
                    tabIndex={-1}
                    style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        gap: '12px',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'left'
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        const args = Array.isArray(subItem.args) ? subItem.args : [];
                        subItem?.action?.(...args, e);
                        setMenuOpen(false);
                        setOpenSubMenuIndex(null);
                    }}
                >
                    <div style={{ maxWidth: '24px', minWidth: '24px', width: '24px' }}>{subItem?.icon}</div>
                    <div style={{ textTransform: 'capitalize' }} title={subItem?.tooltip}>{subItem?.name}</div>
                </div>
            ))}
        </div>
    );

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
                        minWidth: '225px',
                        zIndex: 15
                    }}
                >
                    {items.map((item, index) =>
                        !item?.hidden && (
                            <div
                                key={index}
                                className="menu--item"
                                role="menuitem"
                                ref={(el) => (itemRefs.current[index] = el)}
                                tabIndex={-1}
                                style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    backgroundColor: focusedIndex === index ? '#eee' : 'transparent',
                                    position: 'relative'
                                }}
                                onClick={(e) => {
                                    if (item.subItems) {
                                        e.stopPropagation();
                                        setOpenSubMenuIndex(index);
                                    } else {
                                        e.preventDefault();
                                        const args = Array.isArray(item.args) ? item.args : [];
                                        item?.action?.(...args, e);
                                        setMenuOpen(false);
                                    }
                                }}
                                onMouseEnter={() => {
                                    setFocusedIndex(index);
                                    if (item.subItems) setOpenSubMenuIndex(index);
                                    else setOpenSubMenuIndex(null);
                                }}
                            >
                                <div
                                    style={{
                                        gap: '12px',
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                    className="icon-content"
                                >
                                    <div className="opacity--level"
                                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ maxWidth: '24px', minWidth: '24px', width: '24px' }}>
                                            {item?.icon}
                                        </div>
                                        <div title={item?.tooltip}>{item?.name}</div>
                                    </div>
                                    {item.subItems && (
                                        <span style={{ fontSize: '12px' }}>▶</span>
                                    )}
                                </div>
                                {item.subItems && openSubMenuIndex === index && (
                                    <div style={{ position: 'static' }}>
                                        {renderSubMenu(item.subItems)}
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default Menu;
