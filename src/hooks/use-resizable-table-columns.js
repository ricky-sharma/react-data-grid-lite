import { useEffect } from 'react';
import { isNull } from '../helpers/common';
import { Button_Column_Key, Maximum_Column_Width, Minimum_Column_Width } from '../constants';

export function useResizableTableColumns(tableRef, state, setState, compColWidthsRef, enableColumnResize) {
    useEffect(() => {
        const table = tableRef?.current;
        if (!table) return;

        const thead = table.querySelector('thead');
        if (!thead) return;

        const headerRows = thead.querySelectorAll('tr');
        if (!headerRows.length) return;

        const mainHeader = headerRows[0];
        const ths = mainHeader.querySelectorAll('th');
        if (!ths.length) return;
        const processed = new WeakSet();

        ths.forEach((th) => {
            if (!th || processed.has(th)) return;
            processed.add(th);

            const columnName = th.dataset.columnName || th.textContent.trim();
            const columnConfig = state?.columns?.find(i => i?.name === columnName);
            const colResizable = columnConfig?.resizable ?? enableColumnResize;

            if (!colResizable) return;

            const resizer = document.createElement('div');
            resizer.style.position = 'absolute';
            resizer.style.top = '0';
            resizer.style.right = '0';
            resizer.style.width = '8px';
            if (window.matchMedia('(pointer: coarse)').matches) {
                resizer.style.width = '20px';
            }
            resizer.style.height = '100%';
            resizer.style.cursor = 'col-resize';
            resizer.style.userSelect = 'none';
            resizer.style.zIndex = '50';
            const currentPos = window.getComputedStyle(th).position;
            if (currentPos === 'static') {
                th.style.position = 'sticky';
            }

            th.appendChild(resizer);
            let startX = 0;
            let startWidth = 0;

            const onMouseDown = (e) => {
                e.preventDefault();
                startX = e.pageX;
                startWidth = th.offsetWidth;
                const onMouseMove = (e) => {
                    const newWidth = Math.min(
                        Math.max(startWidth + (e.pageX - startX), Minimum_Column_Width),
                        Maximum_Column_Width
                    );
                    updateColumnWidth(columnName, newWidth);
                };
                const onMouseUp = (e) => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    const newWidth = Math.min(
                        Math.max(startWidth + (e.pageX - startX), Minimum_Column_Width),
                        Maximum_Column_Width
                    );
                    updateState(e, newWidth, setState, columnName, state);
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };

            const onTouchStart = (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                startX = touch.pageX;
                startWidth = th.offsetWidth;
                let finalWidth = 0;

                const onTouchMove = (e) => {
                    const moveTouch = e.touches[0];
                    finalWidth = Math.min(
                        Math.max(startWidth + (moveTouch.pageX - startX), Minimum_Column_Width),
                        Maximum_Column_Width
                    );
                    updateColumnWidth(columnName, finalWidth);
                };

                const onTouchEnd = (e) => {
                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                    const finalTouch = e.changedTouches?.[0] ?? null;
                    const newWidth = finalTouch !== null ?
                        Math.min(
                            Math.max(startWidth + (finalTouch.pageX - startX), Minimum_Column_Width),
                            Maximum_Column_Width
                        )
                        : finalWidth;
                    updateState(e, newWidth, setState, columnName, state);
                };

                document.addEventListener('touchmove', onTouchMove, { passive: false });
                document.addEventListener('touchend', onTouchEnd);
            };

            resizer.addEventListener('mousedown', onMouseDown);
            resizer.addEventListener('touchstart', onTouchStart, { passive: false });
        });
        const updateColumnWidth = (columnName, newWidth) => {
            if (!columnName || newWidth <= 0) return;

            headerRows.forEach((row) => {
                const headers = Array.from(row.children);
                const index = headers.findIndex(
                    (cell) =>
                        (cell.dataset.columnName || cell.textContent.trim()) === columnName
                );
                if (index >= 0 && row.children[index]) {
                    row.children[index].style.width = `${newWidth}px`;
                }
            });

            const bodyRows = table.querySelectorAll('tbody tr');
            bodyRows.forEach((row) => {
                const cells = Array.from(row.children);
                const index = Array.from(ths).findIndex(
                    (cell) =>
                        (cell.dataset.columnName || cell.textContent.trim()) === columnName
                );
                if (index >= 0 && cells[index]) {
                    cells[index].style.width = `${newWidth}px`;
                }
            });
        };

        const updateState = (e, newWidth, setState, columnName, state) => {
            compColWidthsRef.current = [...updColWidthAndReposition(compColWidthsRef.current,
                columnName, newWidth)]
            setState((prev) => {
                if (!prev || !Array.isArray(prev.columns)) return prev;
                const updatedColumns = prev.columns.map((col) => col.name === columnName ? { ...col, width: newWidth } : col
                );
                return { ...prev, columns: updatedColumns };
            });

            if (typeof state?.onColumnResized === 'function') {
                state.onColumnResized(
                    e ?? null,
                    !isNull(newWidth) ? `${newWidth}px` : 0,
                    columnName ?? ''
                );
            }
        };

        const updColWidthAndReposition = (columns, targetName, newWidthPx) => {
            const updated = [...columns];
            let left = 0;
            for (let i = 0; i < updated.length; i++) {
                const col = { ...updated[i] };
                if (col.name === Button_Column_Key) {
                    updated[i] = col;
                    continue;
                }
                if (col.name === targetName) {
                    col.width = `${newWidthPx}px`;
                }
                col.leftPosition = `${left}px`;
                const width = parseInt(col.width || '0', 10);
                left += width - 1;
                updated[i] = col;
            }
            return updated;
        }


    }, [tableRef, state, setState]);
}