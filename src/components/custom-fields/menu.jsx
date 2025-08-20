import React, { useEffect, useRef, useState } from 'react';
import { useGridConfig } from '../../hooks/use-grid-config';
import { useWindowWidth } from '../../hooks/use-window-width';
import { gridWidthType } from '../../utils/grid-width-type-utils';

const Menu = ({ items }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
    const [subMenuFocusedIndex, setSubMenuFocusedIndex] = useState(0);

    const menuRef = useRef();
    const itemRefs = useRef([]);
    const subItemRefs = useRef([]);
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

            const focusedItem = items[focusedIndex];
            const subItems = focusedItem?.subItems;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (openSubMenuIndex === focusedIndex && subItems) {
                    setSubMenuFocusedIndex((prev) => (prev + 1) % subItems.length);
                } else {
                    setFocusedIndex((prev) => (prev + 1) % items.length);
                    setOpenSubMenuIndex(null);
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (openSubMenuIndex === focusedIndex && subItems) {
                    setSubMenuFocusedIndex((prev) => (prev - 1 + subItems.length) % subItems.length);
                } else {
                    setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
                    setOpenSubMenuIndex(null);
                }
            } else if (e.key === 'ArrowRight' && subItems) {
                e.preventDefault();
                setOpenSubMenuIndex(focusedIndex);
                setSubMenuFocusedIndex(0);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setOpenSubMenuIndex(null);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (openSubMenuIndex === focusedIndex && subItems) {
                    const subItem = subItems[subMenuFocusedIndex];
                    const args = Array.isArray(subItem.args) ? subItem.args : [];
                    subItem?.action?.(...args, e);
                    setMenuOpen(false);
                    setOpenSubMenuIndex(null);
                } else if (focusedItem && !focusedItem.subItems) {
                    const args = Array.isArray(focusedItem.args) ? focusedItem.args : [];
                    focusedItem?.action?.(...args, e);
                    setMenuOpen(false);
                }
            } else if (e.key === 'Escape' || e.key === 'Tab') {
                setMenuOpen(false);
                setOpenSubMenuIndex(null);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [menuOpen, focusedIndex, items, openSubMenuIndex, subMenuFocusedIndex]);

    useEffect(() => {
        if (menuOpen && itemRefs.current[focusedIndex]) {
            itemRefs.current[focusedIndex].focus();
        }
    }, [focusedIndex, menuOpen]);

    useEffect(() => {
        if (
            openSubMenuIndex !== null &&
            subItemRefs.current[subMenuFocusedIndex]
        ) {
            subItemRefs.current[subMenuFocusedIndex].focus();
        }
    }, [subMenuFocusedIndex, openSubMenuIndex]);

    const renderSubMenu = (subItems) => (
        <div
            role="menu"
            style={{
                position: 'absolute',
                top: isSmallWidth ? '25px' : 0,
                right: isSmallWidth ? 0 : '100%',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                padding: '5px 0',
                minWidth: '180px',
                zIndex: 20,
            }}
        >
            {subItems.map((subItem, i) => (
                <div
                    key={i}
                    ref={(el) => (subItemRefs.current[i] = el)}
                    tabIndex={-1}
                    className="menu--item"
                    role="menuitem"
                    style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        backgroundColor:
                            subMenuFocusedIndex === i ? '#eee' : 'transparent',
                        gap: '12px',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'left',
                        minHeight: '35px'
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        const args = Array.isArray(subItem.args)
                            ? subItem.args
                            : [];
                        subItem?.action?.(...args, e);
                        setMenuOpen(false);
                        setOpenSubMenuIndex(null);
                    }}
                    onMouseEnter={() => setSubMenuFocusedIndex(i)}
                >
                    <div style={{ maxWidth: '24px', minWidth: '24px' }}>
                        {subItem?.icon}
                    </div>
                    <div
                        style={{ textTransform: 'capitalize' }}
                        title={subItem?.tooltip}
                    >
                        {subItem?.name}
                    </div>
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
                    setOpenSubMenuIndex(null);
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
                    border: menuOpen ? '1px solid rgba(0, 0, 0, 0.4)' : undefined,
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
                        zIndex: 15,
                    }}
                >
                    {items.map((item, index) =>
                        !item?.hidden ? (
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
                                    backgroundColor:
                                        focusedIndex === index ? '#eee' : 'transparent',
                                    position: 'relative',
                                    minHeight: '40px'
                                }}
                                onClick={(e) => {
                                    if (item.subItems) {
                                        e.stopPropagation();
                                        setOpenSubMenuIndex(index);
                                        setSubMenuFocusedIndex(0);
                                    } else {
                                        e.preventDefault();
                                        const args = Array.isArray(item.args)
                                            ? item.args
                                            : [];
                                        item?.action?.(...args, e);
                                        setMenuOpen(false);
                                    }
                                }}
                                onMouseEnter={() => {
                                    setFocusedIndex(index);
                                    if (item.subItems) {
                                        setOpenSubMenuIndex(index);
                                        setSubMenuFocusedIndex(0);
                                    } else {
                                        setOpenSubMenuIndex(null);
                                    }
                                }}
                            >
                                <div
                                    className="icon-content"
                                    style={{
                                        gap: '12px',
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div
                                        className="opacity--level"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                maxWidth: '24px',
                                                minWidth: '24px',
                                                width: '24px',
                                            }}
                                        >
                                            {item?.icon}
                                        </div>
                                        <div title={item?.tooltip}>{item?.name}</div>
                                    </div>
                                    {item.subItems && (
                                        <span style={{ fontSize: '12px' }}>▶</span>
                                    )}
                                </div>
                                {item.subItems &&
                                    openSubMenuIndex === index &&
                                    renderSubMenu(item.subItems)}
                            </div>
                        ) : null
                    )}
                </div>
            )}
        </div>
    );
};

export default Menu;
