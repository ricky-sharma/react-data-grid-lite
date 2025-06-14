import { dynamicSort } from '../../helpers/sort';

/**
 * Handles sorting logic when a table header is clicked.
 */
export const eventGridHeaderClicked = (colObject, state, setState, colKey) => {
    if (!Array.isArray(colObject)) return;

    const currentSortEntry = state.columnSortOrders.find(col => col?.name === colKey);
    const prevSortOrder = currentSortEntry?.sortOrder || '';
    const sortOrder = prevSortOrder === 'desc' ? 'asc' : 'desc';
    const sortColumns = colObject.map(field => (sortOrder === 'asc' ? field : `-${field}`));
    const sortedData = state.rowsData?.slice().sort(dynamicSort(...sortColumns));

    setState(prev => ({
        ...prev,
        rowsData: sortedData,
        columnSortOrders: prev.columnSortOrders.map(col => ({
            ...col,
            sortOrder: col.name === colKey ? sortOrder : '',
        })),
        toggleState: !prev.toggleState,
    }));
};
