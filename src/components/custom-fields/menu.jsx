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
    padding = '0',
    columnIndex
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
    const [subMenuFocusedIndex, setSubMenuFocusedIndex] = useState(0);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const menuRef = useRef();
    const itemRefs = useRef([]);
    const subItemRefs = useRef([]);
    const buttonRef = useRef(null);
    const menuContainerRef = useRef(null);
    const focusBeforeOpenRef = useRef(null);
    const openTimeoutRef = useRef(null);
    const closeTimeoutRef = useRef(null);

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

        const getNextEnabledIndex = (list, startIndex, direction = 1) => {
            const total = list.length;
            let index = startIndex;

            for (let i = 0; i < total; i++) {
                index = (index + direction + total) % total;
                if (!list[index]?.disabled && list[index]?.type !== 'divider') {
                    return index;
                }
            }
            return startIndex;
        };

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (openSubMenuIndex === focusedIndex && subItems) {
                setSubMenuFocusedIndex((prev) =>
                    getNextEnabledIndex(subItems, prev, 1)
                );
            } else {
                setFocusedIndex((prev) =>
                    getNextEnabledIndex(items, prev, 1)
                );
                setOpenSubMenuIndex(null);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (openSubMenuIndex === focusedIndex && subItems) {
                setSubMenuFocusedIndex((prev) =>
                    getNextEnabledIndex(subItems, prev, -1)
                );
            } else {
                setFocusedIndex((prev) =>
                    getNextEnabledIndex(items, prev, -1)
                );
                setOpenSubMenuIndex(null);
            }
        } else if (e.key === 'ArrowRight' && subItems) {
            e.preventDefault();
            const firstEnabledIndex = getNextEnabledIndex(subItems, -1, 1);
            setOpenSubMenuIndex(focusedIndex);
            setSubMenuFocusedIndex(firstEnabledIndex);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setOpenSubMenuIndex(null);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (openSubMenuIndex === focusedIndex && subItems) {
                const subItem = subItems[subMenuFocusedIndex];
                if (!subItem?.disabled) {
                    const args = Array.isArray(subItem.args) ? subItem.args : [];
                    subItem?.action?.(...args, e);
                    setMenuOpen(false);
                    setOpenSubMenuIndex(null);
                }
            } else if (focusedItem && !focusedItem.subItems && !focusedItem.disabled) {
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
        if (!menuOpen) return;

        const currentItem = itemRefs.current[focusedIndex];
        if (currentItem && document.activeElement !== currentItem) {
            currentItem.focus();
        }
    }, [focusedIndex, menuOpen]);

    useEffect(() => {
        if (openSubMenuIndex === null) return;

        const subItem = subItemRefs.current[subMenuFocusedIndex];
        if (subItem && document.activeElement !== subItem) {
            subItem.focus();
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

    const renderSubMenu = (subItems, header, minWidth) => (
        <div
            role="menu"
            style={{
                position: 'absolute',
                top: isSmallWidth || state?.enableRtl ? '25px' : 0,
                right: !state.enableRtl ? (isSmallWidth ? 0 :
                    (columnIndex === 0 ? '-60%' : '100%')) : '-50%',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                padding: header ? '0 0 5px' : '5px 0',
                minWidth: minWidth ?? '180px',
                zIndex: 20,
                maxHeight: '250px',
                overflow: 'auto',
                cursor: 'default'
            }}
        >
            {subItems.map((subItem, i) =>
                !subItem?.hidden &&
                (subItem?.type === 'divider' ? (
                    <div
                        key={i}
                        style={{
                            height: '1px',
                            margin: '4px 0',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            pointerEvents: 'none',
                            userSelect: 'none'
                        }}>
                    </div>
                ) : (
                    <div
                        title={subItem?.tooltip}
                        key={i}
                    >
                        <div
                            ref={(el) => (subItemRefs.current[i] = !subItem?.disabled ? el : null)}
                            tabIndex={!subItem?.disabled ? -1 : undefined}
                            role="menuitem"
                            className="menu--item"
                            style={{
                                padding: subItem?.header ? '12px' : '8px 12px',
                                cursor: subItem?.disabled ? 'default' : 'pointer',
                                backgroundColor: subItem?.backgroundColor ??
                                    (subMenuFocusedIndex === i && !subItem?.disabled ? '#eee' : 'transparent'),
                                gap: '12px',
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: state.enableRtl ? 'right' : 'left',
                                minHeight: '35px',
                                pointerEvents: (subItem?.disabled ? 'none' : ''),
                                opacity: subItem?.opacity ?? (subItem?.disabled ? '0.5' : ''),
                                position: subItem?.header ? 'sticky' : undefined,
                                top: subItem?.header ? 0 : undefined,
                                zIndex: subItem?.header ? 1 : undefined,
                                borderBottom: subItem?.header ?
                                    '1px solid rgba(0, 0, 0, 0.1)' : undefined,
                                width: subItem?.width
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
                            {!subItem?.hideIcon &&
                                <div
                                    className="alignCenter"
                                    style={{
                                        maxWidth: '24px',
                                        minWidth: '24px'
                                    }}>
                                    {subItem?.icon}
                                </div>
                            }
                            <div
                                style={{
                                    textTransform: 'capitalize',
                                    fontWeight: subItem?.header ? '900' : undefined
                                }}
                            >
                                {subItem?.name}
                            </div>
                        </div>
                    </div>
                )))}
        </div>
    );
    const renderMenu = () => (
        <div
            role="menu"
            style={{
                position: 'absolute',
                top: usePortal ? menuPosition.top : (vertical ? '40px' : '5px'),
                left: usePortal ? (state?.enableRtl ? menuPosition.left - 50 : menuPosition.left - 115)
                    : (state?.enableRtl ? '0' : undefined),
                right: !usePortal && !state?.enableRtl ? '0' : undefined,
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                padding: !usePortal ? '5px 0' : undefined,
                minWidth: !usePortal ? '225px' : undefined,
                zIndex: 1000,
                cursor: 'default'
            }}
        >
            {items.map((item, index) =>
                !item?.hidden && (
                    item?.type === 'divider' ? (
                        <div
                            key={index}
                            style={{
                                height: '1px',
                                margin: '4px 0',
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                pointerEvents: 'none',
                                userSelect: 'none'
                            }}>
                        </div>
                    ) : (
                        <div
                            key={index}
                            title={item?.tooltip}
                            className="menu--item"
                            role="menuitem"
                            ref={(el) => {
                                itemRefs.current[index] = !item?.disabled ? el : null;
                            }}
                            tabIndex={!item?.disabled ? -1 : undefined}
                            style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                outline: 'none',
                                backgroundColor:
                                    focusedIndex === index ? '#eee' : 'transparent',
                                position: 'relative',
                                minHeight: '40px',
                                pointerEvents: (item?.disabled ? 'none' : ''),
                                opacity: (item?.disabled ? '0.5' : ''),
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
                                clearTimeout(closeTimeoutRef.current);
                                openTimeoutRef.current = setTimeout(() => {
                                    setFocusedIndex(index);
                                    if (item.subItems) {
                                        setOpenSubMenuIndex(index);
                                        setSubMenuFocusedIndex(0);
                                    } else {
                                        setOpenSubMenuIndex(null);
                                    }
                                }, 250);
                            }}
                            onMouseLeave={() => {
                                clearTimeout(openTimeoutRef.current);
                                closeTimeoutRef.current = setTimeout(() => {
                                    setOpenSubMenuIndex(null);
                                }, 250);
                            }}
                        >
                            <div
                                className="icon-content"
                                style={{
                                    gap: '12px',
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    pointerEvents: 'none',
                                    userSelect: 'none'
                                }}
                            >
                                <div
                                    className="opacity--level"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        pointerEvents: 'none',
                                        userSelect: 'none'
                                    }}
                                >
                                    <div
                                        className="alignCenter"
                                        style={{
                                            maxWidth: '24px',
                                            minWidth: '24px',
                                            pointerEvents: 'none',
                                            userSelect: 'none'
                                        }}
                                    >
                                        {item?.icon}
                                    </div>
                                    <div>{item?.name}</div>
                                </div>
                                {item.subItems && (
                                    <span style={{ fontSize: '10px' }}>▶</span>
                                )}
                            </div>
                            {item.subItems &&
                                openSubMenuIndex === index &&
                                renderSubMenu(item.subItems, item?.header ?? false, item?.minWidth)}
                        </div>
                    ))
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