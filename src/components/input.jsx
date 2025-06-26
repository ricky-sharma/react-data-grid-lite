/* eslint-disable react/prop-types */
import React from 'react';

function Input({ type, dataType, placeholder, className, value, onChange }) {
    return (
        <>
            <input
                className={className ?? ""}
                data-type={dataType ?? ""}
                type={type}
                placeholder={placeholder ?? ""}
                value={value ?? ""}
                onChange={onChange ?? (() => { })}
            />
            {value && (
                <span className="clear-input" onClick={() => onChange({ target: { value: "" } })}>
                    ×
                </span>
            )}
        </>
    );
}

export default Input;
