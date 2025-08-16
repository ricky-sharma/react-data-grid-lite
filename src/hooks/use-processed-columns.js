import { useEffect } from 'react';
import { isNull } from '../helpers/common';

export function useProcessedColumns(columns, setState, computedColumnWidthsRef) {
    useEffect(() => {
        computedColumnWidthsRef.current = [];

        if (!isNull(columns)) {
            setState((prevState) => {
                const prevCols = prevState.columns ?? [];

                const isValid = Array.isArray(columns) && columns.every(obj => typeof obj === 'object');
                if (!isValid) return { ...prevState, columnsReceived: columns, columns: [] };

                const validColumns = columns
                    .filter(obj => obj && typeof obj.name === 'string' && obj.name.trim() !== '')
                    .map(col => {
                        const prev = prevCols.find(c => c?.name === col?.name);
                        return {
                            ...col,
                            fixed: typeof col?.fixed === 'boolean' ? col?.fixed : false,
                            hidden: typeof col?.hidden === 'boolean' ? col?.hidden : false,
                            width: prev?.width ?? col?.width ?? '',
                            order: prev?.displayIndex ?? col?.order ?? ''
                        };
                    });

                const fixedCols = validColumns.filter(col => col.fixed);
                const nonFixedCols = validColumns.filter(col => !col.fixed);

                const applyGlobalOrder = (group, globalStartIndex = 0) => {
                    const result = [];
                    const withOrder = group.filter(c => typeof c.order === 'number');
                    const withoutOrder = group.filter(c => typeof c.order !== 'number');

                    const orderGroups = new Map();
                    for (const col of withOrder) {
                        if (!orderGroups.has(col.order)) orderGroups.set(col.order, []);
                        orderGroups.get(col.order).push(col);
                    }

                    const sortedOrders = Array.from(orderGroups.keys()).sort((a, b) => a - b);
                    for (const order of sortedOrders) {
                        const groupCols = orderGroups.get(order).sort((a, b) => a.name.localeCompare(b.name));
                        for (const col of groupCols) {
                            const maxIndex = group.length - 1;
                            const globalIdx = Math.min(Math.max(0, col.order - 1), maxIndex + globalStartIndex);
                            const localIdx = Math.max(0, globalIdx - globalStartIndex);
                            let i = localIdx;
                            while (result[i]) i++;
                            result[i] = col;
                        }
                    }

                    let i = 0;
                    for (const col of withoutOrder) {
                        while (result[i]) i++;
                        result[i] = col;
                    }

                    return result;
                };

                const orderedFixed = applyGlobalOrder(fixedCols, 0);
                const orderedNonFixed = applyGlobalOrder(nonFixedCols, orderedFixed.length);
                const finalList = [...orderedFixed, ...orderedNonFixed].filter(Boolean).map((col, index) => ({
                    ...col,
                    displayIndex: index + 1
                }));

                return {
                    ...prevState,
                    columnsReceived: columns,
                    columns: finalList
                };
            });
        }
    }, [columns]);
}
