/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ options = [], value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const wrapperRef = useRef(null);
    const optionRefs = useRef([]);

    const handleOptionClick = (e, option) => {
        onChange?.(e, option);
        setOpen(false);
    };

    const toggleDropdown = () => {
        setOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (open) {
            const index = options.indexOf(value);
            if (index >= 0) {
                setFocusedIndex(index);
                optionRefs.current[index]?.scrollIntoView({ block: 'nearest' });
            } else {
                setFocusedIndex(-1);
            }
        }
    }, [open, value, options]);

    useEffect(() => {
        if (open && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
            optionRefs.current[focusedIndex].focus();
        }
    }, [focusedIndex, open]);

    useEffect(() => {
        const handleFocusOut = (e) => {
            setTimeout(() => {
                if (wrapperRef.current
                    && !wrapperRef.current.contains(document.activeElement)) {
                    setOpen(false);
                }
            }, 0);
        };
        document.addEventListener('focusin', handleFocusOut);
        return () => {
            document.removeEventListener('focusin', handleFocusOut);
        };
    }, []);

    const handleKeyDown = (e) => {
        const { key } = e;
        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            if (!open) {
                setOpen(true);
                setFocusedIndex(0);
            } else if (focusedIndex >= 0) {
                onChange?.(e, options[focusedIndex]);
                setOpen(false);
            }
        } else if (key === 'ArrowDown') {
            e.preventDefault();
            if (!open) {
                setOpen(true);
                setFocusedIndex(0);
            } else {
                setFocusedIndex((prev) => (prev + 1) % options.length);
            }
        } else if (key === 'ArrowUp') {
            e.preventDefault();
            if (!open) {
                setOpen(true);
                setFocusedIndex(options.length - 1);
            } else {
                setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
            }
        } else if (key === 'Escape') {
            e.preventDefault();
            setOpen(false);
        } 
    };

    return (
        <div className="dropdown" ref={wrapperRef}>
            <div
                className="dropdown-selected"
                onKeyDown={handleKeyDown}
                onClick={toggleDropdown}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-labelledby="dropdown-label"
            >
                {value || 'Select an option'}
                <span className="dropdown-arrow">{open ? '▲' : '▼'}</span>
            </div>

            {open && (
                <div
                    className="dropdown-options"
                    role="listbox"
                    tabIndex={-1}
                    onKeyDown={handleKeyDown}
                    aria-activedescendant={
                        focusedIndex >= 0 ? `dropdown-option-${focusedIndex}` : undefined
                    }
                >
                    {options.map((option, index) => (
                        <div
                            key={option}
                            id={`dropdown-option-${index}`}
                            ref={(el) => (optionRefs.current[index] = el)}
                            className={`dropdown-option ${option === value ? 'selected' : ''}
                                ${index === focusedIndex ? 'focused' : ''}`}
                            onClick={(e) => handleOptionClick(e, option)}
                            tabIndex={index === focusedIndex ? 0 : -1}
                            role="option"
                            aria-selected={option === value}
                        >
                            {option}
                        </div>

                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;