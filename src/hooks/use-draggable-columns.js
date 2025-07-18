import { useEffect, useRef, useState } from 'react';
import { Container_Identifier, Movement_Threshold } from '../constants';
import { useGridConfig } from './use-grid-config';

export function useDraggableColumns(columns, setState, onColumnDragEnd) {
    const dragIndexRef = useRef(null);
    const dragFixedRef = useRef(null);
    const touchStartRef = useRef(null);
    const lastTouchedIndexRef = useRef(null);
    const dragActiveRef = useRef(false);
    const [, forceUpdate] = useState(0);
    const config = useGridConfig();

    useEffect(() => {
        const container = document.querySelector(`#${config?.state?.gridID} ${Container_Identifier}`);
        if (!container) return;

        const nativeHandler = (e) => {
            if (!touchStartRef.current) return;
            const touch = e.touches[0];
            const dx = touch.clientX - touchStartRef.current.x;
            const dy = touch.clientY - touchStartRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > Movement_Threshold && Math.abs(dx) > Math.abs(dy)) {
                if (e.cancelable) e.preventDefault();
                dragActiveRef.current = true;
                forceUpdate(n => n + 1); // Force re-render to update styles
                onTouchMoveInternal?.(touch.clientX, touch.clientY);
            }
        };

        container.addEventListener('touchmove', nativeHandler, { passive: false });

        return () => {
            container.removeEventListener('touchmove', nativeHandler);
        };
    }, []);

    if (!Array.isArray(columns) || !setState) {
        return { getColumnProps: () => ({}) };
    }

    const findColumnIndex = (displayIndex) =>
        columns.findIndex(col => col.displayIndex === displayIndex);

    const handleDrop = (fromIndex, toIndex) => {
        if (
            fromIndex === -1 ||
            toIndex === -1 ||
            fromIndex === toIndex ||
            !columns[fromIndex] ||
            !columns[toIndex]
        ) return;

        const sourceCol = columns[fromIndex];
        const targetCol = columns[toIndex];

        // Prevent reordering between fixed and non-fixed columns
        if (!!sourceCol.fixed !== !!targetCol.fixed) return;

        const reordered = [...columns];
        const [movedCol] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, movedCol);

        const updatedColumns = reordered.map((col, index) => ({
            ...col,
            displayIndex: index + 1,
        }));

        setState(prev => ({
            ...prev,
            columns: updatedColumns,
        }));

        const newColumnOrder = reordered.reduce((acc, col) => {
            if (col?.hidden) return acc;
            acc.push({
                name: col.name,
                order: acc.length + 1,
                ...(col.alias && { alias: col.alias })
            });
            return acc;
        }, []);

        if (typeof onColumnDragEnd === 'function') {
            onColumnDragEnd(sourceCol.name, newColumnOrder);
        }
    };

    const onDragStart = (displayIndex) => {
        const dragIndex = findColumnIndex(displayIndex);
        dragIndexRef.current = dragIndex;

        const dragCol = columns[dragIndex];
        dragFixedRef.current = !!dragCol?.fixed;
    };

    const onDrop = (displayIndex) => {
        const dropIndex = findColumnIndex(displayIndex);
        handleDrop(dragIndexRef.current, dropIndex);
        dragIndexRef.current = null;
        dragFixedRef.current = null;
    };

    const onTouchStart = (displayIndex, e) => {
        const index = findColumnIndex(displayIndex);
        touchStartRef.current = {
            index,
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        lastTouchedIndexRef.current = index;

        const dragCol = columns[index];
        dragFixedRef.current = !!dragCol?.fixed;
        dragActiveRef.current = false;
        forceUpdate(n => n + 1);
    };

    const onTouchMoveInternal = (touchX, touchY) => {
        const el = document.elementFromPoint(touchX, touchY);
        if (!el) return;

        const targetName = el.getAttribute('data-column-name');
        const target = columns.find(col => col.name === targetName);
        if (!target) return;
        // Prevent reordering between fixed and non-fixed columns
        if (!!target.fixed !== dragFixedRef.current) return;

        const toIndex = columns.findIndex(col => col.name === target.name);
        lastTouchedIndexRef.current = toIndex;
    };

    const handleReactTouchMove = (e) => {
        if (!touchStartRef.current) return;
        const touch = e.touches[0];
        const dx = touch.clientX - touchStartRef.current.x;
        const dy = touch.clientY - touchStartRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > Movement_Threshold && Math.abs(dx) > Math.abs(dy)) {
            dragActiveRef.current = true;
            forceUpdate(n => n + 1);
            onTouchMoveInternal?.(touch.clientX, touch.clientY);
        }
    };

    const onTouchEnd = () => {
        if (dragActiveRef.current && touchStartRef.current) {
            handleDrop(touchStartRef.current.index, lastTouchedIndexRef.current);
        }

        touchStartRef.current = null;
        lastTouchedIndexRef.current = null;
        dragFixedRef.current = null;
        dragActiveRef.current = false;
        forceUpdate(n => n + 1);
    };

    const getColumnProps = (displayIndex) => ({
        draggable: true,
        onDragStart: () => onDragStart(displayIndex),
        onDragOver: (e) => e.preventDefault(),
        onDrop: () => onDrop(displayIndex),
        onTouchStart: (e) => onTouchStart(displayIndex, e),
        onTouchMove: handleReactTouchMove,
        onTouchEnd,
        style: {
            cursor: 'move',
            touchAction: 'pan-y',
            transition: 'transform 0.15s ease',
            opacity: dragActiveRef.current ? 0.6 : 1,
            transform: dragActiveRef.current ? 'scale(1.03)' : 'none',
        },
    });

    return { getColumnProps };
}