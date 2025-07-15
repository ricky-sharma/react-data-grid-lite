/* eslint-disable react/prop-types */
import React from 'react';
import { useFieldNavigation } from '../../hooks/use-field-navigation';
import Dropdown from '../custom-fields/dropdown';

const EditableDropdownField = ({
    colName,
    value,
    onChange,
    autoFocus,
    inputRef,
    editableColumns,
    baseRow,
    focusInput,
    commitChanges,
    revertChanges,
    preventBlurRef,
    isNavigatingRef,
    fieldIndex,
    editContainerRef,
    values,
    openDropdownIndex,
    setOpenDropdownIndex
}) => {
    const { handleBlur, handleKeyDown: fieldKeyDown, handleClick } = useFieldNavigation({
        fieldIndex,
        editableColumns,
        baseRow,
        commitChanges,
        revertChanges,
        focusInput,
        isNavigatingRef,
        preventBlurRef,
        editContainerRef
    });
    const handleKeyDown = (e) => {
        const { key, shiftKey } = e;
        const dropdownKeys = ['Enter', ' ', 'ArrowDown', 'ArrowUp'];

        if (!dropdownKeys.includes(key)) {
            fieldKeyDown(e);
        }

        if (key === 'Tab') {
            e.preventDefault();
            if (isNavigatingRef)
                isNavigatingRef.current = true;

            const nextIndex = fieldIndex + (shiftKey ? -1 : 1);
            const isValid = nextIndex >= 0 && nextIndex < editableColumns.length;

            if (isValid) {
                focusInput(nextIndex);
            }
            const isExiting =
                (!shiftKey && fieldIndex === editableColumns.length - 1) ||
                (shiftKey && fieldIndex === 0);
            commitChanges(editableColumns, baseRow, isExiting);
        }
    };

    return (
        <Dropdown
            options={values}
            value={value}
            onChange={onChange}
            autoFocus={autoFocus}
            dropDownRef={inputRef}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onMouseDown={(e) => e.stopPropagation()}
            preventBlurRef={preventBlurRef}
            usePortal={true}
            width={"100%"}
            height={"100%"}
            colName={colName}
            fieldIndex={fieldIndex}
            focusInput={focusInput}
            isOpen={openDropdownIndex === fieldIndex}
            setOpenExternally={setOpenDropdownIndex}
        />
    );
};

export default EditableDropdownField;
