import { useCallback } from 'react';
import { isNull } from '../helpers/common';
import { logDebug } from '../helpers/logDebug';

export function useResetGrid({
    state,
    setState,
    pageSize,
    searchColsRef,
    globalSearchQueryRef,
    sortRef,
    dataReceivedRef
}) {
    return useCallback(() => {
        try {
            searchColsRef.current = [];
            globalSearchQueryRef.current = '';
            sortRef.current = null;

            setState(prev => {
                const dataLength = dataReceivedRef?.current?.length ?? 0;
                const pageRows = !isNull(parseInt(pageSize, 10)) ? parseInt(pageSize, 10) : dataLength;
                let noOfPages = Math.floor(dataLength / pageRows);
                let lastPageRows = dataLength % pageRows;
                if (lastPageRows > 0) noOfPages++;
                if (lastPageRows === 0) lastPageRows = pageRows;

                return {
                    ...prev,
                    searchValues: Object.fromEntries(
                        (Array.isArray(prev.columns) ? prev.columns : [])
                            .filter(col => col && col.name)
                            .map(col => [col.name, ''])
                    ),
                    globalSearchInput: '',
                    rowsData: dataReceivedRef?.current ?? [],
                    pageRows,
                    noOfPages,
                    lastPageRows,
                    currentPageRows: pageRows,
                    activePage: 1,
                    totalRows: dataLength,
                    firstRow: 0,
                    selectedRows: new Set(),
                    columns: (Array.isArray(prev.columns) ? prev.columns : []).map(col => ({
                        ...col,
                        sortOrder: '',
                    }))
                };
            });
        } catch (err) {
            logDebug(state?.debug, 'error', 'Reset Grid:', err);
        }
    }, [state, setState, pageSize, dataReceivedRef, logDebug]);
}
