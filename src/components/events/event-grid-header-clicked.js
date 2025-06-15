import { dynamicSort } from '../../helpers/sort';

/**
 * Handles sorting logic when a table header is clicked.
 */
export const eventGridHeaderClicked = (colObject, state, setState, colKey, isResizingRef) => {
    if (isResizingRef?.current === true) return;
    if (!Array.isArray(colObject)) return;

    const currentSortEntry = state.columns.find(col => col?.name === colKey);
    const prevSortOrder = currentSortEntry?.sortOrder || '';
    const sortOrder = prevSortOrder === 'desc' ? 'asc' : 'desc';
    const sortColumns = colObject.map(field => (sortOrder === 'asc' ? field : `-${field}`));
    const sortedData = state.rowsData?.slice().sort(dynamicSort(...sortColumns));

    setState(prev => ({
        ...prev,
        rowsData: sortedData,
        columns: prev.columns.map(col => ({
            ...col,
            sortOrder: col.name === colKey ? sortOrder : '',
        })),
        toggleState: !prev.toggleState,
    }));
};
