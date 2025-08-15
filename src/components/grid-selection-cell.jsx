import React from 'react';
import Checkbox from './custom-fields/checkbox';
import { useGridConfig } from '../hooks/use-grid-config';

const GridSelectionCell = ({
    selectionColWidth,
    isSelectionColumnLeft,
    isSelectionColumnRight,
    isActionColumnLeft,
    isActionColumnRight,
    isMobile,
    buttonColWidth,
    baseRow
}) => {
    const { state = {}, setState } = useGridConfig();
    const { onRowSelect, selectedRows } = state;
    const left = isSelectionColumnLeft && !isMobile
        ? isActionColumnLeft ? buttonColWidth : 0
        : '';
    const right = isSelectionColumnRight && !isMobile
        ? isActionColumnRight ? buttonColWidth : '-0.1px'
        : '';
    const position = (isSelectionColumnLeft || isSelectionColumnRight) && !isMobile ? 'sticky' : '';
    const zIndex = (isActionColumnRight || isSelectionColumnLeft) && !isMobile ? 6 : '';
    const boxShadow = isSelectionColumnLeft && !isMobile
        ? '#e0e0e0 -0.5px 0 0 0 inset'
        : isSelectionColumnRight && !isMobile
            ? '#e0e0e0 0.5px 0 0 0 inset'
            : '';

    return (
        <td
            key="gridSelectionColumn"
            className="alignCenter"
            onClick={e => e.stopPropagation()}
            title="Select row"
            aria-label="Select row"
            style={{
                width: selectionColWidth,
                maxWidth: selectionColWidth,
                minWidth: selectionColWidth,
                left,
                right,
                position,
                zIndex,
                backgroundColor: 'inherit',
                boxShadow,
                contain: 'layout paint'
            }}
        >
            <div
                className="mg--0 pd--0 selection-column alignCenter"
                style={{ width: selectionColWidth }}
            >
                <Checkbox
                    isSelected={selectedRows.has(baseRow?.__$index__)}
                    onChange={(e) => {
                        const isSelected = e.target.checked;
                        setState(prev => {
                            const selectedRows = new Set(prev?.selectedRows);
                            if (isSelected === true) {
                                selectedRows.add(baseRow?.__$index__);
                            } else {
                                selectedRows.delete(baseRow?.__$index__);
                            }
                            return {
                                ...prev,
                                selectedRows
                            };
                        });
                        if (typeof onRowSelect === 'function') {
                            onRowSelect?.(e, baseRow, isSelected);
                        }
                    }}
                />
            </div>
        </td>
    );
};

export default GridSelectionCell;