import { useCallback, useRef } from 'react';

export function useCellChange({ cellChangedRef }) {
    const contextRef = useRef({
        editingCell: null,
        editingCellData: null,
        rowsData: [],
        dataReceivedRef: null,
        setState: () => { }
    });

    const configure = useCallback((ctx) => {
        contextRef.current = { ...contextRef.current, ...ctx };
    });

    const onCellChange = useCallback((e, value, colName) => {
        const {
            editingCell,
            editingCellData,
            rowsData,
            dataReceivedRef,
            setState
        } = contextRef.current;

        const updatedData = [...rowsData];
        const baseRowIndex = editingCell?.baseRowIndex;
        const newValue = e?.target?.value ?? value;
        const rowIndexInPartial = updatedData.findIndex(row => row.__$index__ === baseRowIndex);

        if (rowIndexInPartial === -1) return;

        const originalRow = updatedData[rowIndexInPartial];
        const originalValue = originalRow[colName];
        const prevEditingData = editingCellData || {};
        const alreadySaved = Object.prototype.hasOwnProperty.call(prevEditingData, colName);

        updatedData[rowIndexInPartial] = {
            ...originalRow,
            [colName]: newValue
        };

        if (Array.isArray(dataReceivedRef?.current)) {
            const fullDataRow = dataReceivedRef.current[baseRowIndex];
            if (fullDataRow) {
                fullDataRow[colName] = newValue;
            }
        }

        setState(prev => ({
            ...prev,
            rowsData: updatedData,
            editingCellData: alreadySaved
                ? prev.editingCellData
                : {
                    ...prev.editingCellData,
                    [colName]: originalValue
                }
        }));

        cellChangedRef.current = true;
    });

    return {
        onCellChange,
        configure
    };
}
