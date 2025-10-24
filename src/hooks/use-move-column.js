import { useCallback } from 'react';

export function useMoveColumn(state, setState) {
    const moveColumn = useCallback((direction, columnName) => {
        const columns = state?.columns || [];
        const column = columns.find(col => col.name === columnName);

        if (!column) return null;

        const currentIndex = column.displayIndex;
        const isRight = direction === 'right';
        let targetIndex = isRight ? currentIndex + 1 : currentIndex - 1;
        const limit = isRight
            ? Math.max(...columns.map(col => col.displayIndex))
            : Math.min(...columns.map(col => col.displayIndex));

        let targetColumn = null;

        while (
            isRight ? targetIndex <= limit : targetIndex >= limit
        ) {
            const candidate = columns.find(c => c.displayIndex === targetIndex);
            if (!candidate) {
                targetIndex = isRight ? targetIndex + 1 : targetIndex - 1;
                continue;
            }

            const draggable = (typeof candidate?.draggable === 'boolean' ?
                candidate.draggable : state?.enableColumnDrag)

            if (!candidate.hidden && !candidate.hideable && draggable) {
                if (candidate.fixed === column.fixed) {
                    targetColumn = candidate;
                }
                break;
            }

            targetIndex = isRight ? targetIndex + 1 : targetIndex - 1;
        }

        if (!targetColumn) return null;
        const updatedColumns = columns.map(col => {
            if (col.name === column.name) {
                return {
                    ...col,
                    order: targetColumn.order,
                    displayIndex: targetColumn.displayIndex,
                };
            }
            if (col.name === targetColumn.name) {
                return {
                    ...col,
                    order: column.order,
                    displayIndex: column.displayIndex,
                };
            }
            return col;
        });

        const newColumnOrder = updatedColumns
            .sort((a, b) => a.displayIndex - b.displayIndex)
            .reduce((acc, col) => {
                if (col.hidden) return acc;
                acc.push({
                    name: col.name,
                    order: acc.length + 1,
                    ...(col.alias && { alias: col.alias }),
                });
                return acc;
            }, []);

        setState?.(prev => ({
            ...prev,
            columns: updatedColumns,
            toggleColumnMove: !prev.toggleColumnMove,
        }));

        return newColumnOrder;
    }, [state, setState]);

    return { moveColumn };
}
