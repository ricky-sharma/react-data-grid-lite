import React, { memo, useRef } from 'react';
import EditableTextField from './editable-text-field';

const EditableCellFields = memo(function EditableCellFields({
    baseRow,
    columnValue,
    commitChanges,
    editableColumns,
    onCellChange,
    revertChanges,
    rowIndex
}) {
    const inputRefs = useRef([]);
    const isNavigatingRef = useRef(false);
    const preventBlurRef = useRef(false);
    const editContainerRef = useRef(null);

    if (!editableColumns || editableColumns.length === 0) return null;

    const focusInput = (index) => {
        if (inputRefs.current[index]) {
            inputRefs.current[index].focus();
        }
    };

    const renderField = ({ colName, type }, i) => {
        const isFirstField = i === 0;

        const sharedProps = {
            key: colName,
            colName,
            value: baseRow[colName],
            onChange: onCellChange,
            autoFocus: isFirstField,
            inputRef: (el) => (inputRefs.current[i] = el),
            rowIndex,
            editableColumns,
            baseRow,
            focusInput,
            commitChanges,
            revertChanges,
            preventBlurRef,
            isNavigatingRef,
            fieldIndex: i,
            editContainerRef
        };

        switch (type) {
            case 'text':
                return <EditableTextField {...sharedProps} />;
            // case 'select':
            //   return <EditableDropdownField {...sharedProps} />;
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
            }}
            className="mg--0 pd--0 editField"
            title={columnValue?.toString()}
        >
            {editableColumns.map(renderField)}
        </div>
    );
});

export default EditableCellFields;