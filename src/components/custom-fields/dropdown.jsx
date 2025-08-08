import React, { memo, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Container_Identifier } from '../../constants';
import { isNull } from '../../helpers/common';
import { useGridConfig } from '../../hooks/use-grid-config';

const Dropdown = memo(({
    options = [],
    value,
    onChange,
    autoFocus,
    dropDownRef,
    onBlur,
    preventBlurRef,
    onMouseDown,
    onClick,
    usePortal = false,
    width,
    height,
    colName,
    onKeyDown,
    fieldIndex,
    focusInput,
    isOpen,
    setOpenExternally,
    cssClass
}) => {
    const config = useGridConfig();
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const triggerRef = useRef(null);
    const optionRefs = useRef([]);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const wrapperRef = useRef(null);
    const listboxRef = useRef(null);
    const focusBeforeOpenRef = useRef(null);
    const isControlled = typeof isOpen === 'boolean' && typeof setOpenExternally === 'function';
    const [internalOpen, setInternalOpen] = useState(false);
    const [readyToPosition, setReadyToPosition] = useState(false);
    const open = isControlled ? isOpen : internalOpen;

    if (isNull(options)) options.push('Select');

    const setOpen = (next) => {
        if (isControlled) {
            setOpenExternally(next ? fieldIndex : null);
        } else {
            setInternalOpen(next);
        }
    };

    useEffect(() => {
        if (!open) {
            focusBeforeOpenRef.current?.focus();
        }
    }, [open]);

    useEffect(() => {
        if (!open) {
            setReadyToPosition(false);
            return;
        }
        const raf = requestAnimationFrame(() => {
            setReadyToPosition(true);
        });
        return () => cancelAnimationFrame(raf);
    }, [open]);

    const handleFocusCapture = (e) => {
        focusBeforeOpenRef.current = e.target;
    };

    useEffect(() => {
        if (!dropDownRef) return;
        if (typeof dropDownRef === 'function') {
            dropDownRef(triggerRef.current);
        } else if ('current' in dropDownRef) {
            dropDownRef.current = triggerRef.current;
        }
        if (typeof focusInput === 'function' && autoFocus) focusInput(fieldIndex);
    }, [dropDownRef]);

    const getDropdownContainer = () => {
        return document.querySelector(`#${config?.state?.gridID} ${Container_Identifier}`) || document.body;
    };

    const toggleDropdown = () => {
        setOpen(!open);
    };

    const getOptionValue = (opt) => (typeof opt === 'object' ? opt.value : opt);
    const getOptionLabel = (opt) => (typeof opt === 'object' ? opt.label : opt);

    const handleOptionClick = (e, option) => {
        const optionValue = getOptionValue(option);
        if (optionValue !== value) {
            onChange?.(e, optionValue, colName ?? '');
        }
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isClickInsideDropdown =
                wrapperRef.current?.contains(event.target);

            if (!isClickInsideDropdown) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        const container = triggerRef.current?.closest('table');
        const handleScroll = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        container?.addEventListener('scroll', handleScroll, true);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', () => setOpen(false));

        return () => {
            container?.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', () => setOpen(false));
        };
    }, [open]);

    useEffect(() => {
        if (open) {
            const index = options.findIndex((option) => getOptionValue(option) === value);
            if (index >= 0) {
                setFocusedIndex(index);
                if (optionRefs?.current?.[value]?.scrollIntoView) {
                    optionRefs.current[index].scrollIntoView({
                        block: 'nearest',
                        behavior: 'smooth'
                    });
                }
            } else {
                setFocusedIndex(-1);
            }

            if (usePortal && triggerRef.current) {
                const triggerRect = triggerRef.current.getBoundingClientRect();
                const container = getDropdownContainer();
                const containerRect = container.getBoundingClientRect();

                setPosition({
                    top: triggerRect.bottom - containerRect.top,
                    left: triggerRect.left - containerRect.left,
                    width: triggerRect.width
                });
            }

            setTimeout(() => {
                listboxRef.current?.focus();
            }, 0);
        }
    }, [open, value, options, usePortal]);

    useEffect(() => {
        if (open && focusedIndex >= 0 && optionRefs?.current?.[focusedIndex]) {
            optionRefs.current[focusedIndex].focus();
        }
    }, [focusedIndex, open]);

    const handleKeyDown = (e) => {
        const { key } = e;

        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            if (!open) {
                setOpen(true);
                setFocusedIndex(0);
            } else if (focusedIndex >= 0) {
                handleOptionClick(e, options[focusedIndex]);
            }
        } else if (key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            setFocusedIndex((prev) => (prev + 1) % options.length);
        } else if (key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
            setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
        } else if (key === 'Escape' || key === 'Tab') {
            if (isControlled)
                e.preventDefault();
            setOpen(false);
        }
    };

    const renderOptions = () => (
        <div
            className="dropdown-options"
            style={
                usePortal
                    ? readyToPosition ? {
                        position: 'absolute',
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        width: `${position.width}px`,
                        zIndex: 9999,
                        overflowY: 'visible',
                        backgroundColor: '#fff'
                    }
                        : { visibility: 'hidden' } : {}
            }
            role="listbox"
            tabIndex={0}
            ref={listboxRef}
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (preventBlurRef) {
                    preventBlurRef.current = true;
                    setTimeout(() => {
                        preventBlurRef.current = false;
                    }, 0);
                }
            }}
            aria-activedescendant={
                focusedIndex >= 0 ? `dropdown-option-${focusedIndex}` : undefined
            }
        >
            {options.map((option, index) => {
                const optionLabel = getOptionLabel(option);
                const optionValue = getOptionValue(option);

                return (
                    <div
                        key={optionValue}
                        id={`dropdown-option-${index}`}
                        ref={(el) => (optionRefs.current[index] = el)}
                        className={`dropdown-option ${optionValue === value ? 'selected' : ''
                            } ${index === focusedIndex ? 'focused' : ''}`}
                        onClick={(e) => handleOptionClick(e, option)}
                        tabIndex={index === focusedIndex ? 0 : -1}
                        role="option"
                        aria-selected={optionValue === value}
                    >
                        {optionLabel}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div
            style={{ width: width ?? undefined, height: height ?? undefined }}
            className={cssClass ?? 'drop--down'}
            ref={wrapperRef}
            onBlur={onBlur ?? (() => { })}
            onClick={onClick ?? (() => { })}
        >
            <div
                ref={triggerRef}
                className="dropdown-selected"
                onKeyDown={(e) => {
                    onKeyDown?.(e);
                    handleKeyDown(e);
                }}
                onClick={(e) => {
                    toggleDropdown();
                    onClick?.(e);
                }}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onBlur={onBlur ?? (() => { })}
                onMouseDown={onMouseDown ?? (() => { })}
                onFocusCapture={handleFocusCapture}
            >
                <div
                    style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'center'
                    }}
                >
                    {(() => {
                        const selectedOption = options.find(
                            (option) => (typeof option === 'object' ? option.value : option) === value
                        );
                        return selectedOption
                            ? selectedOption.label || selectedOption
                            : 'Select';
                    })()}
                </div>
                <span className="dropdown-arrow">{open ? '▲' : '▼'}</span>
            </div>

            {open &&
                (usePortal
                    ? ReactDOM.createPortal(renderOptions(), getDropdownContainer())
                    : renderOptions())}
        </div>
    );
});

export default Dropdown;