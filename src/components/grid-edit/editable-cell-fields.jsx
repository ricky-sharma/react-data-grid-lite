/* eslint-disable react/prop-types */
import React, { memo, useRef, useState } from 'react';
import EditableDropdownField from './editable-dropdown-field';
import EditableTextField from './editable-text-field';

const EditableCellFields = memo(function EditableCellFields({
    baseRow,
    columnValue,
    commitChanges,
    editableColumns,
    onCellChange,
    revertChanges
}) {
    const inputRefs = useRef([]);
    const isNavigatingRef = useRef(false);
    const preventBlurRef = useRef(false);
    const editContainerRef = useRef(null);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

    if (!editableColumns || editableColumns.length === 0) return null;

    const focusInput = (index) => {
        inputRefs?.current?.[index]?.focus();
    };

    const renderField = ({ colName, type, values }, i) => {
        const isFirstField = i === 0;

        const sharedProps = {
            key: colName,
            colName,
            value: baseRow[colName],
            onChange: onCellChange,
            autoFocus: isFirstField,
            inputRef: (el) => (inputRefs.current[i] = el),
            editableColumns,
            baseRow,
            focusInput,
            commitChanges,
            revertChanges,
            preventBlurRef,
            isNavigatingRef,
            fieldIndex: i,
            editContainerRef,
            values,
            type
        };
        switch (type) {
            case 'text':
            case 'number':
                return <EditableTextField
                    onClick={() => {
                        setOpenDropdownIndex(null);
                    }}
                    {...sharedProps} />;
            case 'select':
                return <EditableDropdownField
                    openDropdownIndex={openDropdownIndex}
                    setOpenDropdownIndex={setOpenDropdownIndex}
                    {...sharedProps} />;
            default:
                return null;
        }
    };

    return (
        <div
            ref={editContainerRef}
            style={{
                height: '100%',
                textAlign: 'left',
                padding: '5px 18px',
                display: 'flex',
                width: '100%',
                gap: '4px'
            }}
            className="mg--0 pd--0 editField alignCenter"
            title={columnValue?.toString()}
        >
            {editableColumns.map(renderField)}
        </div>
    );
});

export default EditableCellFields;