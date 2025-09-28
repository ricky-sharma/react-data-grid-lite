import { useEffect, useRef } from 'react';
import { isNull } from '../helpers/common';
import { Button_Column_Key, Maximum_Column_Width, Minimum_Column_Width } from '../constants';

export function useResizableTableColumns(
    tableRef,
    state,
    setState,
    compColWidthsRef,
    isResizingRef
) {
    const resizingColumnNameRef = useRef(null);
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
            const currentColumnName = th.dataset.columnName;
            if (!currentColumnName) return;
            const columnConfig = state?.columns?.find(i => i?.name === currentColumnName);
            const colResizable = typeof columnConfig?.resizable === "boolean"
                ? columnConfig?.resizable : state?.enableColumnResize;
            if (!colResizable) return;

            const colFixed = columnConfig?.fixed;
            if (th.querySelector('.r-d-g-lt-column-resizer')) return;

            const resizer = document.createElement('div');
            resizer.classList.add('r-d-g-lt-column-resizer');
            resizer.style.position = 'absolute';
            resizer.style.top = '0';
            resizer.style.right = !state?.enableRtl ? '0' : undefined;
            resizer.style.left = state?.enableRtl ? '0' : undefined;
            resizer.style.width = '6px';
            if (window.matchMedia('(pointer: coarse)').matches) {
                resizer.style.width = '8px';
            }
            resizer.style.height = '100%';
            resizer.style.cursor = 'col-resize';
            resizer.style.userSelect = 'none';
            resizer.style.zIndex = '50';
            const currentPos = window.getComputedStyle(th).position;
            if (currentPos !== 'sticky') {
                th.style.position = 'sticky';
            }
         
            let startX = 0;
            let startWidth = 0;

            const onMouseDown = (e) => {
                e.preventDefault();
                resizingColumnNameRef.current =
                    e.target.closest('th[data-column-name]')?.dataset?.columnName ?? null;
                if (isResizingRef) isResizingRef.current = false;
                startX = e?.pageX ?? e?.clientX;
                startWidth = th?.offsetWidth;
                const onMouseMove = (e) => {
                    if (isResizingRef) isResizingRef.current = true;
                    const element = document.querySelector(`#${state.gridID} table`);
                    if (element && colFixed === true) element.scrollLeft = 0;
                    const newPosition = e?.pageX ?? e?.clientX;
                    const newWidth = Math.min(
                        Math.max(startWidth + (newPosition - startX), Minimum_Column_Width),
                        Maximum_Column_Width
                    );
                    updateColumnWidth(resizingColumnNameRef?.current, newWidth);
                };
                const onMouseUp = (e) => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    setTimeout(() => {
                        if (isResizingRef) isResizingRef.current = false;
                    }, 100);
                    const newPosition = e?.pageX ?? e?.clientX;
                    const newWidth = Math.min(
                        Math.max(startWidth + (newPosition - startX), Minimum_Column_Width),
                        Maximum_Column_Width
                    );
                    updateState(e, newWidth, setState, resizingColumnNameRef?.current, state);
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };

            const onTouchStart = (e) => {
                if (e?.cancelable) {
                    e.preventDefault();
                }
                resizingColumnNameRef.current =
                    e.target.closest('th[data-column-name]')?.dataset?.columnName ?? null;

                if (isResizingRef) isResizingRef.current = false;
                const touch = e?.touches ? e?.touches[0] : null;
                startX = touch?.pageX ?? touch?.clientX;
                startWidth = th?.offsetWidth;
                let finalWidth = 0;
                const onTouchMove = (e) => {
                    if (isResizingRef) isResizingRef.current = true;
                    const element = document.querySelector(`#${state.gridID} table`);
                    if (element && colFixed === true) element.scrollLeft = 0;
                    const moveTouch = e?.touches ? e?.touches[0] : null;
                    const newPosition = moveTouch?.pageX ?? moveTouch?.clientX ?? 0;
                    finalWidth = Math.min(
                        Math.max(startWidth + (newPosition - startX), Minimum_Column_Width),
                        Maximum_Column_Width
                    );
                    updateColumnWidth(resizingColumnNameRef?.current, finalWidth);
                };

                const onTouchEnd = (e) => {
                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                    setTimeout(() => {
                        if (isResizingRef) isResizingRef.current = false;
                    }, 100);
                    const finalTouch = e.changedTouches?.[0];
                    const newPosition = finalTouch?.pageX ?? finalTouch?.clientX ?? 0;
                    const newWidth = finalTouch !== null ?
                        Math.min(
                            Math.max(startWidth + (newPosition - startX), Minimum_Column_Width),
                            Maximum_Column_Width
                        )
                        : finalWidth;
                    updateState(e, newWidth, setState, resizingColumnNameRef?.current, state);
                };

                document.addEventListener('touchmove', onTouchMove, { passive: false });
                document.addEventListener('touchend', onTouchEnd);
            };

            resizer.addEventListener('mousedown', onMouseDown);
            resizer.addEventListener('touchstart', onTouchStart, { passive: false });
            th.appendChild(resizer);
        });
        const updateColumnWidth = (columnName, newWidth) => {
            if (!columnName || newWidth <= 0) return;
            headerRows.forEach((row) => {
                const headerCell = row.querySelector(`th[data-column-name="${columnName}"]`);
                if (headerCell) {
                    headerCell.style.width = `${newWidth}px`;
                }
            });

            const bodyRows = table.querySelectorAll('tbody tr');
            bodyRows.forEach((row) => {
                const cell = row.querySelector(`td[data-column-name="${columnName}"]`);
                if (cell) {
                    cell.style.width = `${newWidth}px`;
                }
            });
        };

        const updateState = (e, newWidth, setState, columnName, state) => {
            const newWidthPx = !isNull(newWidth) ? `${newWidth}px` : 0;
            compColWidthsRef.current = [...updColWidthAndReposition(compColWidthsRef.current,
                columnName, newWidthPx)]
            setState((prev) => {
                if (!prev || !Array.isArray(prev.columns)) return prev;
                const updatedColumns = prev.columns.map((col) => col.name === columnName ?
                    { ...col, width: newWidthPx } : col
                );
                return { ...prev, columns: updatedColumns };
            });

            if (typeof state?.onColumnResized === 'function') {
                state.onColumnResized(
                    e,
                    newWidthPx,
                    columnName,
                    state.gridID
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
                    col.width = newWidthPx;
                }
                col.leftPosition = `${left}px`;
                const width = parseInt(col.width || '0', 10);
                left += width;
                updated[i] = col;
            }
            return updated;
        }


    }, [
        tableRef,
        state?.columns,
        state?.activePage,
        state?.scrollLeft
    ]);
}