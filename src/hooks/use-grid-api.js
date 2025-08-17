import { useImperativeHandle, useMemo } from 'react';

export function useGridApi(ref, {
    state,
    dataReceivedRef,
    setState,
    handleResetGrid
}) {
    const selectedSet = useMemo(() => new Set(state?.selectedRows ?? []), [state?.selectedRows]);
    useImperativeHandle(ref, () => ({
            getFilteredRows: () => state?.rowsData ?? [],
            getFilteredSelectedRows: () => state?.rowsData?.filter(row => selectedSet?.has(row?.__$index__)) ?? [],
            getAllSelectedRows: () => dataReceivedRef?.current?.filter(row => selectedSet?.has(row?.__$index__)) ?? [],
            getCurrentPage: () => state?.activePage ?? 1,
            resetGrid: handleResetGrid,
            clearSelectedRows: () => {
                setState(prev => ({
                    ...prev,
                    selectedRows: new Set()
                }));
            }
    }), [selectedSet, state?.rowsData, state?.activePage, dataReceivedRef, handleResetGrid, setState]);
}