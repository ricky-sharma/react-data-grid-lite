import { useEffect } from 'react';

export function useResizableTableColumns(tableRef, state, setState, compColWidthsRef) {
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
            resizer.style.zIndex = '500';
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
                    const newWidth = Math.max(startWidth + (e.pageX - startX), 50);
                    updateColumnWidth(columnName, newWidth);
                };
                const onMouseUp = (e) => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    const finalWidth = Math.max(startWidth + (e.pageX - startX), 50);
                    updateState(finalWidth, setState, columnName);
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };

            const onTouchStart = (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                startX = touch.pageX;
                startWidth = th.offsetWidth;
                let newWidth = 0;

                const onTouchMove = (e) => {
                    const moveTouch = e.touches[0];
                    newWidth = Math.max(startWidth + (moveTouch.pageX - startX), 50);
                    th.style.width = `${newWidth}px`;
                    updateColumnWidth(columnName, newWidth);
                };

                const onTouchEnd = (e) => {
                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                    const finalTouch = e.changedTouches?.[0] ?? null;
                    const finalWidth = finalTouch !== null ?
                        Math.max(startWidth + (finalTouch.pageX - startX), 50) : newWidth;
                    updateState(finalWidth, setState, columnName);
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

        const updateState = (finalWidth, setState, columnName) => {
            compColWidthsRef.current = [...updColWidthAndReposition(compColWidthsRef.current,
                columnName, finalWidth)]
            setState((prev) => {
                if (!prev || !Array.isArray(prev.columns)) return prev;
                const updatedColumns = prev.columns.map((col) => col.name === columnName ? { ...col, width: finalWidth } : col
                );
                return { ...prev, columns: updatedColumns };
            });
        };

        const updColWidthAndReposition = (columns, targetName, newWidthPx) => {
            const updated = [...columns];
            let left = 0;
            for (let i = 0; i < updated.length; i++) {
                const col = { ...updated[i] };
                if (col.name === 'ButtonColumnKey') {
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