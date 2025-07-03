export function useTableCellNavigation() {
    return function onKeyDown(e,
        { editable, editingCell, rowIndex, col, columns, onCellDoubleClick }) {
        if (!editable) return;

        const isEditing =
            editingCell?.rowIndex === rowIndex &&
            editingCell?.columnName === col?.name;
        if (isEditing) return;

        const currentRow = Number(rowIndex);
        const currentColName = col?.name;
        let nextSelector = null;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                onCellDoubleClick(currentColName, currentRow);
                break;

            case 'ArrowDown':
                e.preventDefault();
                nextSelector =
                    `[data-row-index="${currentRow + 1}"][data-col-name="${currentColName}"]`;
                break;

            case 'ArrowUp':
                e.preventDefault();
                nextSelector =
                    `[data-row-index="${currentRow - 1}"][data-col-name="${currentColName}"]`;
                break;

            case 'ArrowRight':
                e.preventDefault();
                {
                    const currentColIndex =
                        columns?.find(i => i?.name === currentColName)?.displayIndex;
                    const nextCol = columns
                        ?.filter(i => i?.displayIndex > currentColIndex && !i?.hidden)
                        ?.sort((a, b) => a.displayIndex - b.displayIndex)[0];
                    if (nextCol?.name) {
                        nextSelector =
                            `[data-row-index="${currentRow}"][data-col-name="${nextCol.name}"]`;
                    }
                }
                break;

            case 'ArrowLeft':
                e.preventDefault();
                {
                    const currentColIndex =
                        columns?.find(i => i?.name === currentColName)?.displayIndex;
                    const prevCol = columns
                        ?.filter(i => i?.displayIndex < currentColIndex && !i?.hidden)
                        ?.sort((a, b) => b.displayIndex - a.displayIndex)[0];
                    if (prevCol?.name) {
                        nextSelector =
                            `[data-row-index="${currentRow}"][data-col-name="${prevCol.name}"]`;
                    }
                }
                break;
        }

        if (nextSelector) {
            const nextCell = document.querySelector(nextSelector);
            if (nextCell) nextCell.focus();
        }
    };
}