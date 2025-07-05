import React from 'react';
import { useFieldNavigation } from '../../hooks/use-field-navigation';
import Input from '../input';

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
    editContainerRef
}) => {
    const { handleBlur, handleKeyDown, handleClick } = useFieldNavigation({
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
    return (
        <Input
            placeholder={colName}
            type="text"
            value={value}
            onChange={(e) => onChange(colName, e)}
            autoFocus={autoFocus}
            ref={inputRef}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onMouseDown={(e) => e.stopPropagation()}
            preventBlurRef={preventBlurRef}
        />
    );
};

export default EditableTextField;
