
export function handleHeaderSelectAllChange(e, state, setState, onSelectAll) {
    const isSelected = e.target.checked;
    const firstRow = state?.firstRow ?? 0;
    const lastRow = firstRow + (state?.currentPageRows ?? 0);
    const currentPageRows = state?.rowsData.slice(firstRow, lastRow) ?? [];

    setState(prev => {
        const selectedRows = new Set(prev?.selectedRows);
        currentPageRows?.forEach(row => {
            const index = row?.__$index__;
            if (isSelected) {
                selectedRows?.add(index);
            } else {
                selectedRows?.delete(index);
            }
        });
        return {
            ...prev,
            selectedRows
        };
    });

    if (typeof onSelectAll === 'function') {
        onSelectAll(e, currentPageRows, isSelected);
    }
}
