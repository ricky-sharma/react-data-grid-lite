import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Container_Identifier } from '../../constants';
import { useGridConfig } from '../../hooks/use-grid-config';
import { useWindowWidth } from '../../hooks/use-window-width';
import Horizontal3Dot from '../../icons/horizontal-three-dot-icon';
import Vertical3Dot from '../../icons/vertical-three-dot-icon';
import { gridWidthType } from '../../utils/grid-width-type-utils';

const Menu = ({
    items,
    width = '36px',
    height = '36px',
    borderRadius = '50%',
    noBorder = false,
    usePortal = false,
    margin = '0',
    top = '0',
    menuId = "toolBarMenu",
    vertical = 'true',
    boxShadow = '',
    padding = '0'
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
    const [subMenuFocusedIndex, setSubMenuFocusedIndex] = useState(0);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0});

    const menuRef = useRef();
    const itemRefs = useRef([]);
    const subItemRefs = useRef([]);
    const buttonRef = useRef(null);
    const menuContainerRef = useRef(null);
    const focusBeforeOpenRef = useRef(null);

    const windowWidth = useWindowWidth();
    const { state = {} } = useGridConfig() ?? {};
    const { isSmallWidth } = gridWidthType(windowWidth, state?.gridID);
    useEffect(() => {
        const handleClickOutsideMenu = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
                setOpenSubMenuIndex(null);
            }
        };
        document.addEventListener('click', handleClickOutsideMenu);
        return () => document.removeEventListener('click', handleClickOutsideMenu);
    }, []);

    useEffect(() => {
        const handleCloseMenus = (e) => {
            if (e?.detail?.sourceId !== menuId) {
                setMenuOpen(false);
                setOpenSubMenuIndex(null);
            }
        };

        window.addEventListener('closeAllMenus', handleCloseMenus);
        return () => window.removeEventListener('closeAllMenus', handleCloseMenus);
    }, []);

    const handleKeyDown = (e) => {
        e.stopPropagation();
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

    useEffect(() => {
        if (!menuOpen) {
            focusBeforeOpenRef.current?.focus();
        }
    }, [menuOpen]);

    const handleFocusCapture = (e) => {
        focusBeforeOpenRef.current = e.target;
    };

    useEffect(() => {
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

    const handleButtonClick = (e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('closeAllMenus', {
            detail: { sourceId: menuId }
        }));
        setMenuOpen((prev) => !prev);
        setFocusedIndex(0);
        setOpenSubMenuIndex(null);

        const buttonRect = buttonRef.current.getBoundingClientRect();
        const container = buttonRef.current.closest(Container_Identifier);

        if (container) {
            const containerRect = container.getBoundingClientRect();
            menuContainerRef.current = container;

            setMenuPosition({
                top: buttonRect.bottom - containerRect.top,
                left: buttonRect.right - containerRect.left
            });
        }
    };

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
                    title={subItem?.tooltip}
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
                        e.stopPropagation();
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
                    <div className="alignCenter" style={{ maxWidth: '24px', minWidth: '24px' }}>
                        {subItem?.icon}
                    </div>
                    <div
                        style={{ textTransform: 'capitalize' }}
                    >
                        {subItem?.name}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderMenu = () => (
        <div
            role="menu"
            style={{
                position: 'absolute',
                top: usePortal ? menuPosition.top + 20 : '40px',
                left: usePortal ? menuPosition.left - 115 : undefined,
                right: !usePortal ? 0 : undefined,
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                padding: !usePortal ? '5px 0' : undefined,
                minWidth: !usePortal ? '225px' : undefined,
                zIndex: 1000,
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
                        onKeyDown={handleKeyDown}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (item.subItems) {
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
                            title={item?.tooltip}
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
                                    className="alignCenter"
                                    style={{
                                        maxWidth: '24px',
                                        minWidth: '24px'
                                    }}
                                >
                                    {item?.icon}
                                </div>
                                <div>{item?.name}</div>
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
    );

    return (
        <div ref={menuRef} style={{ display: 'inline-block', position: 'relative', width, margin, height }}>
            <button
                ref={buttonRef}
                className={`menu--btn alignCenter${!noBorder ? " menu--btn-border" : ""}`}
                onClick={handleButtonClick}
                onKeyDown={
                    (e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleButtonClick(e)
                        }
                    }}
                style={{
                    background: 'none',
                    cursor: 'pointer',
                    top,
                    position: 'relative',
                    borderRadius,
                    width,
                    height,
                    border: menuOpen && !noBorder ? '1px solid rgba(0, 0, 0, 0.4)' : 'none',
                    color: 'currentColor',
                    boxShadow,
                    padding
                }}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-label="Open menu"
                onFocusCapture={handleFocusCapture}
            >
                {vertical ? <Vertical3Dot /> : <Horizontal3Dot />}
            </button>
            {menuOpen && (
                !usePortal
                    ? renderMenu()
                    : menuContainerRef.current &&
                    ReactDOM.createPortal(renderMenu(), menuContainerRef.current)
            )}
        </div>
    );
};

export default Menu;