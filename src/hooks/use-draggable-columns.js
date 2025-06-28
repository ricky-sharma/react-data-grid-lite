import { useEffect, useRef } from 'react';
import { Container_Identifier } from '../constants';

const MOVEMENT_THRESHOLD = 10;

export function useDraggableColumns(columns, setState) {
    const dragIndexRef = useRef(null);
    const dragFixedRef = useRef(null);
    const touchStartRef = useRef(null);
    const lastTouchedIndexRef = useRef(null);
    const dragActiveRef = useRef(false);

    useEffect(() => {
        const container = document.querySelector(Container_Identifier);
        if (!container) return;

        const nativeHandler = (e) => {
            if (!touchStartRef.current) return;
            const touch = e.touches[0];
            const dx = touch.clientX - touchStartRef.current.x;
            const dy = touch.clientY - touchStartRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > MOVEMENT_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
                if (e.cancelable) e.preventDefault();
                dragActiveRef.current = true;
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
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

        const sourceCol = columns[fromIndex];
        const targetCol = columns[toIndex];
        if (!sourceCol || !targetCol) return;

        if (!!sourceCol.fixed !== !!targetCol.fixed) return;

        const reordered = [...columns];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);

        const updatedColumns = reordered.map((col, index) => ({
            ...col,
            displayIndex: index + 1,
        }));

        setState(prev => ({
            ...prev,
            columns: updatedColumns,
        }));
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
    };

    const onTouchMoveInternal = (touchX, touchY) => {
        const el = document.elementFromPoint(touchX, touchY);
        if (!el) return;

        const targetName = el.getAttribute('data-column-name');
        const target = columns.find(col => col.name === targetName);
        if (!target) return;

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

        if (distance > MOVEMENT_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
            dragActiveRef.current = true;
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