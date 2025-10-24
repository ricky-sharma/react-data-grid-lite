import { useEffect, useRef } from 'react';
import { isNull } from '../helpers/common';
import { Button_Column_Key, Container_Identifier, Maximum_Column_Width, Minimum_Column_Width } from '../constants';

export function useResizableTableColumns(
    tableRef,
    state,
    setState,
    compColWidthsRef,
    isResizingRef
) {
    const resizingColumnNameRef = useRef(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);
    const finalWidthRef = useRef(0);

    useEffect(() => {
        const table = tableRef?.current;
        if (!table) return;

        const thead = table.querySelector(`#${state?.gridID} ${Container_Identifier} thead`);
        if (!thead) return;

        const headerRows = thead.querySelectorAll(`#${state?.gridID} ${Container_Identifier} tr`);
        if (!headerRows.length) return;

        const mainHeader = headerRows[0];
        const ths = mainHeader.querySelectorAll(`#${state?.gridID} ${Container_Identifier} th`);
        if (!ths.length) return;

        const processed = new WeakSet();

        const onMouseMove = (e) => {
            if (isResizingRef) isResizingRef.current = true;
            const element = document.querySelector(`#${state?.gridID} ${Container_Identifier} table`);
            const colFixed = state?.columns?.find(c => c?.name === resizingColumnNameRef.current)?.fixed;
            if (element && colFixed === true) element.scrollLeft = 0;

            const newPosition = e?.pageX ?? e?.clientX;
            const newWidth = Math.min(
                Math.max(startWidthRef.current + (newPosition - startXRef.current), Minimum_Column_Width),
                Maximum_Column_Width
            );
            updateColumnWidth(resizingColumnNameRef.current, newWidth);
        };

        const onMouseUp = (e) => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            setTimeout(() => {
                if (isResizingRef) isResizingRef.current = false;
            }, 100);
            const newPosition = e?.pageX ?? e?.clientX;
            const newWidth = Math.min(
                Math.max(startWidthRef.current + (newPosition - startXRef.current), Minimum_Column_Width),
                Maximum_Column_Width
            );
            updateState(e, newWidth, setState, resizingColumnNameRef.current, state);
        };

        const onTouchMove = (e) => {
            if (isResizingRef) isResizingRef.current = true;
            const element = document.querySelector(`#${state?.gridID} ${Container_Identifier} table`);
            const colFixed = state?.columns?.find(c => c?.name === resizingColumnNameRef.current)?.fixed;
            if (element && colFixed === true) element.scrollLeft = 0;

            const moveTouch = e?.touches?.[0];
            const newPosition = moveTouch?.pageX ?? moveTouch?.clientX ?? 0;
            finalWidthRef.current = Math.min(
                Math.max(startWidthRef.current + (newPosition - startXRef.current), Minimum_Column_Width),
                Maximum_Column_Width
            );
            updateColumnWidth(resizingColumnNameRef.current, finalWidthRef.current);
        };

        const onTouchEnd = (e) => {
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
            setTimeout(() => {
                if (isResizingRef) isResizingRef.current = false;
            }, 100);
            const finalTouch = e.changedTouches?.[0];
            const newPosition = finalTouch?.pageX ?? finalTouch?.clientX ?? 0;
            const newWidth = finalTouch
                ? Math.min(
                    Math.max(startWidthRef.current + (newPosition - startXRef.current), Minimum_Column_Width),
                    Maximum_Column_Width
                )
                : finalWidthRef.current;

            updateState(e, newWidth, setState, resizingColumnNameRef.current, state);
        };

        ths.forEach((th) => {
            if (!th || processed.has(th)) return;
            processed.add(th);

            const currentColumnName = th.dataset.columnName;
            if (!currentColumnName) return;

            const columnConfig = state?.columns?.find(i => i?.name === currentColumnName);
            const colResizable = typeof columnConfig?.resizable === "boolean"
                ? columnConfig.resizable
                : state?.enableColumnResize;

            if (!colResizable) return;
            const colFixed = columnConfig?.fixed;

            if (th.querySelector('.r-d-g-lt-column-resizer')) return;

            const resizer = document.createElement('div');
            resizer.classList.add('r-d-g-lt-column-resizer');
            resizer.style.position = 'absolute';
            resizer.style.top = '0';
            resizer.style.right = !state?.enableRtl ? '0' : undefined;
            resizer.style.left = state?.enableRtl ? '0' : undefined;
            resizer.style.width = window.matchMedia('(pointer: coarse)').matches ? '8px' : '6px';
            resizer.style.height = '100%';
            resizer.style.cursor = 'col-resize';
            resizer.style.userSelect = 'none';
            resizer.style.zIndex = '50';

            const currentPos = window.getComputedStyle(th).position;
            if (currentPos !== 'sticky') {
                th.style.position = 'sticky';
            }

            const onMouseDown = (e) => {
                e.preventDefault();
                resizingColumnNameRef.current =
                    e.target.closest(`#${state?.gridID} ${Container_Identifier} th[data-column-name]`)?.dataset?.columnName ?? null;
                if (isResizingRef) isResizingRef.current = false;
                startXRef.current = e?.pageX ?? e?.clientX;
                startWidthRef.current = th?.offsetWidth;

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };

            const onTouchStart = (e) => {
                if (e?.cancelable) {
                    e.preventDefault();
                }
                resizingColumnNameRef.current =
                    e.target.closest(`#${state?.gridID} ${Container_Identifier} th[data-column-name]`)?.dataset?.columnName ?? null;
                if (isResizingRef) isResizingRef.current = false;

                const touch = e?.touches?.[0];
                startXRef.current = touch?.pageX ?? touch?.clientX;
                startWidthRef.current = th?.offsetWidth;
                finalWidthRef.current = 0;

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

            const bodyRows = table.querySelectorAll(`#${state?.gridID} ${Container_Identifier} tbody tr`);
            bodyRows.forEach((row) => {
                const cell = row.querySelector(`td[data-col-name="${columnName}"]`);
                if (cell) {
                    cell.style.width = `${newWidth}px`;
                }
            });
        };

        const updateState = (e, newWidth, setState, columnName, state) => {
            const newWidthPx = !isNull(newWidth) ? `${newWidth}px` : 0;
            compColWidthsRef.current = [...updColWidthAndReposition(compColWidthsRef.current, columnName, newWidthPx)];
            setState((prev) => {
                if (!prev || !Array.isArray(prev.columns)) return prev;
                const updatedColumns = prev.columns.map((col) =>
                    col.name === columnName ? { ...col, width: newWidthPx } : col
                );
                return { ...prev, columns: updatedColumns };
            });

            if (typeof state?.onColumnResized === 'function') {
                state.onColumnResized(e, newWidthPx, columnName, state.gridID);
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
        };

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };
    }, [tableRef, state?.columns, state?.activePage, state?.scrollLeft]);
}
