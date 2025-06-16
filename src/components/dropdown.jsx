/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ options = [], value, onChange }) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const optionRefs = useRef({});
    const handleOptionClick = (e, option) => {
        onChange?.(e, option);
        setOpen(false);
    };

    const toggleDropdown = () => {
        setOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (open && optionRefs.current[value]) {
            optionRefs.current[value].scrollIntoView({
                behavior: 'auto',
                block: 'nearest',
            });
        }
    }, [open, value]);


    return (
        <div className="dropdown" ref={wrapperRef}>
            <div
                className="dropdown-selected"
                onClick={toggleDropdown}
                tabIndex={0}
                role="button"
            >
                {value}
                <span className="dropdown-arrow">{open ? '▲' : '▼'}</span>
            </div>

            {open && (
                <div className="dropdown-options">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            ref={el => optionRefs.current[option] = el}
                            className={`dropdown-option ${option === value ? 'selected' : ''}`}
                            onClick={(e) => handleOptionClick(e, option)}
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
