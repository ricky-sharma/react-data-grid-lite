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
    onMouseDown,
    preventBlurRef,
    autoFocus }) {
    return (
        <div className="alignCenter"
            style={{
                position: 'relative',
                width: width ?? '100%',
                height: height ?? '100%'
            }}>
            <input
                onClick={onClick ?? (() => { })}
                ref={ref ?? null}
                className={className ?? ""}
                data-type={dataType ?? ""}
                type={type ?? "text"}
                placeholder={placeholder ?? ""}
                value={value ?? ""}
                onChange={onChange ?? (() => { })}
                onBlur={onBlur ?? (() => { })}
                onKeyDown={onKeyDown ?? (() => { })}
                autoFocus={autoFocus ?? false}
                onMouseDown={onMouseDown ?? (() => { })}
            />
            {value && (
                <span
                    className="clear-input"
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
