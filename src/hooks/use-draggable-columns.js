import { useRef } from 'react';

export function useDraggableColumns(columns, setState) {
    const dragOrder = useRef(null);
    const dragFixed = useRef(null);

    if (!Array.isArray(columns) || !setState) {
        return { getColumnProps: () => ({}) };
    }

    const onDragStart = (displayIndex) => {
        dragOrder.current = displayIndex;
        const dragCol = columns.find(c => c.displayIndex === displayIndex);
        dragFixed.current = !!dragCol?.fixed;
    };

    const onDrop = (targetDisplayIndex) => {
        const dragIndex = columns.findIndex(c => c.displayIndex === dragOrder.current);
        const dropIndex = columns.findIndex(c => c.displayIndex === targetDisplayIndex);

        if (dragIndex === -1 || dropIndex === -1 || dragIndex === dropIndex) return;

        const sourceCol = columns[dragIndex];
        const targetCol = columns[dropIndex];
        if (!!sourceCol.fixed !== !!targetCol.fixed) return;

        const reordered = [...columns];
        const [moved] = reordered.splice(dragIndex, 1);
        reordered.splice(dropIndex, 0, moved);

        const updatedColumns = reordered.map((col, index) => ({
            ...col,
            displayIndex: index + 1
        }));

        setState(prev => ({
            ...prev,
            columns: updatedColumns
        }));

        dragOrder.current = null;
        dragFixed.current = null;
    };

    const getColumnProps = (displayIndex) => ({
        draggable: true,
        onDragStart: () => onDragStart(displayIndex),
        onDragOver: (e) => e.preventDefault(),
        onDrop: () => onDrop(displayIndex),
        style: { cursor: 'move' }
    });

    return { getColumnProps };
}