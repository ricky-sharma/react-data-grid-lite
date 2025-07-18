import { useCallback, useRef } from 'react';

export function useCellCommit({ cellChangedRef, cellChangedFocusRef }) {
    const contextRef = useRef({
        editingCell: null,
        onCellUpdate: null,
        setState: () => { }
    });

    const configure = useCallback((ctx) => {
        contextRef.current = { ...contextRef.current, ...ctx };
    });

    const commitChanges = useCallback((editedColumns, updatedRow, isExiting) => {
        const {
            editingCell,
            onCellUpdate,
            setState
        } = contextRef.current;

        const rowIndex = updatedRow?.__$index__;
        const exiting = isExiting === true;

        cellChangedFocusRef.current = exiting ? editingCell : null;

        setState(prev => ({
            ...prev,
            editingCell: exiting ? null : prev.editingCell,
            editingCellData: exiting ? null : prev.editingCellData,
        }));

        const shouldFireCellUpdate = exiting && cellChangedRef.current;

        if (shouldFireCellUpdate && typeof onCellUpdate === 'function') {
            onCellUpdate({
                rowIndex,
                editedColumns: editedColumns.map(({ colName }) => ({
                    colName,
                    value: updatedRow[colName]
                })),
                updatedRow
            });
            cellChangedRef.current = false;
        }
    });

    return {
        commitChanges,
        configure
    };
}
