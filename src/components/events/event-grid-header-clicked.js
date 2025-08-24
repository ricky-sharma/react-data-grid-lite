import { dynamicSort } from '../../helpers/sort';

/**
 * Handles sorting logic when a table header is clicked.
 */
export const eventGridHeaderClicked = (colObject, state, setState, colKey, isResizingRef) => {
    if (isResizingRef?.current === true) return;
    if (!Array.isArray(colObject)) return;
    const currentSortEntry = state?.columns?.find(col => col?.name === colKey);
    const prevSortOrder = currentSortEntry?.sortOrder || '';
    const sortOrder = state?.rowsData ? (prevSortOrder === 'desc' ? 'asc' : 'desc') : '';
    SortColumn(state, setState, colKey, colObject, sortOrder);
};

export const SortColumn = (state, setState, columnName, colObject, sortOrder) => {
    let timeout;
    const processSort = async () => {
        const data = state?.rowsData;
        const sortedRows = await sortData(colObject, sortOrder, data);
        timeout = setTimeout(() => {
            setState?.(prev => ({
                ...prev,
                rowsData: sortedRows,
                columns: prev?.columns?.map(col => ({
                    ...col,
                    sortOrder: col?.name === columnName ? sortOrder : ''
                })),
                toggleState: !prev?.toggleState
            }));
        }, 0);
    }
    processSort();
    return () => clearTimeout(timeout);
}

export function sortData(colObject, sortOrder, data) {
    const sortColumns = colObject?.map(field => (sortOrder === 'asc' ? field : `-${field}`));
    const sortedData = data?.slice().sort(dynamicSort(...sortColumns));
    return sortedData;
}
