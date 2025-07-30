/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import { isNull } from '../helpers/common';
import { useGridConfig } from '../hooks/use-grid-config';
import { resolveColumnItems, resolveColumnType } from '../utils/component-utils';
import EditableCellFields from './grid-edit/editable-cell-fields';

const GridCell = memo(({
    keyProp,
    col,
    isMobile,
    computedColumnWidthsRef,
    lastFixedIndex,
    rowIndex,
    baseRowIndex,
    baseRow,
    formattedRow,
    onCellEdit,
    onKeyDown,
    onTouchStart,
    commitChanges,
    onCellChange,
    revertChanges,
    cellChangedFocusRef,
    clickTimerRef,
    didDoubleClickRef
}) => {
    const { state = {} } = useGridConfig() ?? {};
    const {
        columns,
        enableCellEdit,
        enableColumnResize,
        editingCell
    } = state;
    const colWidth = computedColumnWidthsRef?.current?.find(i =>
        i?.name === col?.name)?.width ?? 0;
    const classNames = col?.class || '';
    const colResizable = typeof col?.resizable === "boolean"
        ? col?.resizable : enableColumnResize;
    const editable = typeof col?.editable === "boolean"
        ? col?.editable : enableCellEdit;
    const columnValue = formattedRow[col?.name?.toLowerCase()];
    const editableColumns = (col.concatColumns?.columns ?? [col?.name])
        .map((colName, index) => {
            const columnDef = columns?.find(c => c.name === colName);
            const concatType = col.concatColumns?.editor?.[index];
            const baseType = columnDef?.editor;
            return {
                colName,
                type: resolveColumnType(concatType, baseType),
                values: resolveColumnItems(concatType, baseType)
            };
        });
    const fixedMeta = col?.fixed === true && !isMobile;
    const leftPosition = computedColumnWidthsRef?.current?.find(i => i?.name === col?.name)?.leftPosition ?? '';
    return (
        <td
            key={keyProp}
            className={classNames + (editable === true ? ' editable-cell' : '')}
            tabIndex={editable === true ? 0 : undefined}
            style={{
                width: colWidth,
                maxWidth: colResizable ? undefined : colWidth,
                minWidth: colResizable ? undefined : colWidth,
                left: fixedMeta ? leftPosition : '',
                position: fixedMeta ? 'sticky' : '',
                zIndex: fixedMeta ? 6 : '',
                backgroundColor: 'inherit',
                boxShadow: (lastFixedIndex === keyProp && fixedMeta
                    ? '#e0e0e0 -0.5px 0 0 0 inset'
                    : ''),
                contain: 'layout paint',
                cursor: editable === true ? 'pointer' : 'default',
                ...(typeof col?.cellStyle === 'object' && !Array.isArray(col?.cellStyle) ? col.cellStyle : {})
            }}
            onBlur={() => (cellChangedFocusRef.current = null)}
            onDoubleClick={() => {
                if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
                didDoubleClickRef.current = true;
                if (editable) onCellEdit(col.name, rowIndex, baseRowIndex);
            }}
            onMouseDown={(e) => {
                if (e.target instanceof HTMLElement && e.target.tagName === 'A') {
                    e.preventDefault();
                }
                if (!editable) e.preventDefault();
            }}
            onKeyDown={(e) =>
                onKeyDown(e, {
                    editable,
                    editingCell,
                    rowIndex,
                    col,
                    columns,
                    onCellEdit,
                    baseRowIndex
                })
            }
            onTouchStart={onTouchStart(() => {
                if (editable === true) onCellEdit(col.name, rowIndex, baseRowIndex);
            })}
            data-row-index={rowIndex}
            data-col-name={col?.name}
        >
            {editable === true &&
                editingCell?.rowIndex === rowIndex &&
                editingCell?.columnName === col?.name ? (
                <EditableCellFields
                    baseRow={baseRow}
                    columnValue={columnValue}
                    commitChanges={commitChanges}
                    editableColumns={editableColumns}
                    onCellChange={onCellChange}
                    revertChanges={revertChanges}
                />
            ) : !isNull(col?.render) && typeof col?.render === 'function' ? (
                col.render(formattedRow, baseRow)
            ) : (
                <div
                    style={{
                        height: '100%',
                        padding: '10px 25px'
                    }}
                    className="mg--0 pd--0"
                    title={columnValue?.toString()}
                >
                    {columnValue?.toString()}
                </div>
            )}
        </td>
    );
});

export default GridCell;