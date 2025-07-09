export function useTableCellNavigation() {
    return function onKeyDown(e,
        { editable, editingCell, rowIndex, col, columns, onCellEdit }) {
        if (!editable) return;

        const isEditing =
            editingCell?.rowIndex === rowIndex &&
            editingCell?.columnName === col?.name;
        if (isEditing === true) return;

        const currentRow = Number(rowIndex);
        const currentColName = col?.name;
        let nextSelector = null;

        switch (e.key) {
            case 'Enter':
                const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];
                const activeEl = document.activeElement;
                if (activeEl && interactiveTags.includes(activeEl.tagName)) {
                    return;
                }
                e.preventDefault();
                onCellEdit(currentColName, currentRow);
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
            if (nextCell && typeof nextCell.focus === 'function') nextCell.focus();
        }
    };
}