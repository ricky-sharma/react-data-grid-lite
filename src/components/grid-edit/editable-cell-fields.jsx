import React, { memo, useRef } from 'react';
import Input from '../input';

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
    if (!editableColumns || editableColumns.length === 0) return null;
    const focusInput = (index) => {
        if (inputRefs.current[index]) {
            inputRefs.current[index].focus();
        }
    };
    return (
        <div
            style={{
                height: `100%`,
                textAlign: "left",
                padding: "5px 18px",
                display: 'flex',
                width: '100%'
            }}
            className="mg--0 pd--0 editField"
            title={columnValue?.toString()}
        >
            {editableColumns.map(({ colName, type }, i) => {
                const isFirstField = i === 0;
                return (
                    <Input
                        key={colName}
                        placeholder={colName}
                        type={type}
                        value={baseRow[colName]}
                        onChange={(e) => onCellChange(colName, e)}
                        autoFocus={isFirstField}
                        ref={(el) => (inputRefs.current[i] = el)}
                        onBlur={() => {
                            if (isNavigatingRef.current || preventBlurRef.current) {
                                isNavigatingRef.current = false;
                                preventBlurRef.current = false;
                                return;
                            }
                            const isExiting = i === editableColumns.length - 1 || i === 0;
                            commitChanges(rowIndex, editableColumns, baseRow, isExiting);
                        }}
                        onKeyDown={(e) => {
                            const { key, shiftKey } = e;
                            if (key === 'Enter' || key === 'Tab') {
                                e.preventDefault();
                                isNavigatingRef.current = true;

                                const nextIndex = shiftKey ? i - 1 : i + 1;
                                const isValid = nextIndex >= 0
                                    && nextIndex < editableColumns.length;

                                if (isValid) {
                                    focusInput(nextIndex);
                                }
                                const isExiting =
                                    (!shiftKey && i === editableColumns.length - 1) ||
                                    (shiftKey && i === 0);

                                commitChanges(rowIndex, editableColumns,
                                    baseRow, isExiting);
                            } else if (key === 'Escape') {
                                e.preventDefault();
                                revertChanges(editableColumns);
                            }
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            isNavigatingRef.current = true;
                            focusInput(i);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        preventBlurRef={preventBlurRef}
                    />
                );
            })}
        </div>
    );
});

export default EditableCellFields;
