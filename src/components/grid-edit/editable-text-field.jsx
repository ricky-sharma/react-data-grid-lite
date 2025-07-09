/* eslint-disable react/prop-types */
import React from 'react';
import { useFieldNavigation } from '../../hooks/use-field-navigation';
import Input from '../custom-fields/input';

const EditableTextField = ({
    colName,
    value,
    onChange,
    autoFocus,
    inputRef,
    rowIndex,
    editableColumns,
    baseRow,
    focusInput,
    commitChanges,
    revertChanges,
    preventBlurRef,
    isNavigatingRef,
    fieldIndex,
    editContainerRef,
    type,
    onClick
}) => {
    const {
        handleBlur,
        handleKeyDown,
        handleClick
    } = useFieldNavigation({
        fieldIndex,
        editableColumns,
        rowIndex,
        baseRow,
        commitChanges,
        revertChanges,
        focusInput,
        isNavigatingRef,
        preventBlurRef,
        editContainerRef
    });

    const handleInputChange = (e) => {
        onChange(e, e?.target?.value, colName);
    };

    const handleInputClick = (e) => {
        handleClick(e);
        onClick?.(e);
    };

    return (
        <Input
            placeholder={colName}
            type={type}
            value={value}
            onChange={handleInputChange}
            autoFocus={autoFocus}
            ref={inputRef}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={handleInputClick}
            onMouseDown={(e) => e.stopPropagation()}
            preventBlurRef={preventBlurRef}
        />
    );
};

export default EditableTextField;
