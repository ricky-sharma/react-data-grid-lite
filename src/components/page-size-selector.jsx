import React, { useState, useRef, useEffect } from 'react';

const PageSizeSelector = ({
    options = [5, 10, 25, 50, 100, 250, 500],
    defaultValue,
    onChange
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const dropdownRef = useRef(null);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const optionRefs = useRef([]);

    const toggleDropdown = () => setIsOpen(prev => !prev);

    const handleOptionClick = (e, value) => {
        e.stopPropagation();
        setIsOpen(false);
        setSelectedValue(value);
        if (onChange) onChange(value);
    };

    useEffect(() => {
        if (isOpen && focusedIndex >= 0 && optionRefs?.current?.[focusedIndex]) {
            optionRefs.current[focusedIndex].focus();
        }
    }, [focusedIndex, isOpen]);

    const handleKeyDown = (e) => {
        const { key } = e;
        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
                setFocusedIndex(0);
            } else if (focusedIndex >= 0) {
                handleOptionClick(e, options[focusedIndex]);
            }
        } else if (key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
            setFocusedIndex((prev) => (prev + 1) % options.length);
        } else if (key === 'ArrowUp') {
            e.preventDefault();
            setIsOpen(true);
            setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
        } else if (key === 'Escape' || key === 'Tab') {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="rows-per-page-selector" >
            <div>Rows per page:</div>
            <div
                ref={dropdownRef}
                className="ps-dropdown"
                onClick={toggleDropdown}
            >
                <div
                    style={{
                        paddingTop: '5px'
                    }}
                    onKeyDown={(e) => {
                        handleKeyDown(e);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-label="Number of rows per page"
                    className="dropdown-selected">
                    <div style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        {selectedValue}
                    </div>
                    <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
                </div>

                {isOpen && (
                    <div
                        aria-activedescendant={
                            focusedIndex >= 0 ? `dropdown-option-${focusedIndex}` : undefined
                        }
                        className="ps-dropdown-options"
                        role="presentation"
                    >
                        {options.map((option, index) => (
                            <div
                                key={option}
                                ref={(el) => (optionRefs.current[index] = el)}
                                role="option"
                                className={`ps-dropdown-option ${option === selectedValue ? 'ps-selected' : ''}`}
                                aria-selected={option === selectedValue}
                                tabIndex={index === focusedIndex ? 0 : -1}
                                onClick={(e) => handleOptionClick(e, option)}
                                onKeyDown={handleKeyDown}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageSizeSelector;
