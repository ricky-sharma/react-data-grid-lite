/* eslint-disable no-prototype-builtins */
import { useRef } from 'react';

export function useCellRevert({ cellChangedFocusRef }) {
    const contextRef = useRef({
        editingCell: null,
        editingCellData: null,
        rowsData: [],
        setState: () => { },
        dataReceivedRef: null
    });

    const configure = (ctx) => {
        contextRef.current = { ...contextRef.current, ...ctx };
    };

    const revertChanges = (editableColumns) => {
        const {
            editingCell,
            editingCellData,
            rowsData,
            setState,
            dataReceivedRef
        } = contextRef.current;

        const updatedData = [...rowsData];
        const baseRowIndex = editingCell?.baseRowIndex;
        const rowIndexInPartial = updatedData.findIndex(row => row.__$index__ === baseRowIndex);
        if (cellChangedFocusRef) {
            cellChangedFocusRef.current = editingCell;
        }

        if (rowIndexInPartial === -1) return;

        const updatedRow = { ...updatedData[rowIndexInPartial] };
        editableColumns.forEach(({ colName }) => {
            if (editingCellData?.hasOwnProperty(colName)) {
                const originalValue = editingCellData[colName];
                updatedRow[colName] = originalValue;

                if (Array.isArray(dataReceivedRef?.current)) {
                    const fullDataRow = dataReceivedRef.current[baseRowIndex];
                    if (fullDataRow) {
                        fullDataRow[colName] = originalValue;
                    }
                }
            }
        });

        updatedData[rowIndexInPartial] = updatedRow;

        setState(prev => ({
            ...prev,
            editingCell: null,
            editingCellData: null,
            rowsData: updatedData
        }));
    };

    return { revertChanges, configure };
}
