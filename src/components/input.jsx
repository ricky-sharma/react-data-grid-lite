/* eslint-disable react/prop-types */
import React from 'react';

function Input({
    type,
    dataType,
    placeholder,
    className,
    value,
    onChange,
    onBlur,
    width,
    height,
    ref,
    onKeyDown,
    onClick,
    autoFocus }) {
    return (
        <div className="alignCenter"
            style={{
                position: 'relative',
                width: width ?? '100%',
                height: height ?? '100%'
            }}>
            <input
                onClick={onClick}
                ref={ref}
                className={className ?? ""}
                data-type={dataType ?? ""}
                type={type}
                placeholder={placeholder ?? ""}
                value={value ?? ""}
                onChange={onChange ?? (() => { })}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                autoFocus={autoFocus ?? false}
            />
            {value && (
                <span
                    className="clear-input"
                    onClick={() =>
                        onChange(
                            {
                                target: { value: "" }
                            })}>
                    ×
                </span>
            )}
        </div>
    );
}

export default Input;
