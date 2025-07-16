/* eslint-disable no-prototype-builtins */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import {
    Button_Column_Key,
    No_Column_Visible_Message,
    No_Data_Message
} from '../constants';
import { isNull } from '../helpers/common';
import { useDoubleTap } from '../hooks/use-double-tap';
import useLoadingIndicator from '../hooks/use-loading-indicator';
import { useTableCellNavigation } from '../hooks/use-table-cell-navigation';
import { useWindowWidth } from '../hooks/use-window-width';
import DeleteIcon from '../icons/delete-icon';
import EditIcon from '../icons/edit-icon';
import { formatRowData, resolveColumnItems, resolveColumnType } from '../utils/component-utils';
import { hideLoader, showLoader } from '../utils/loading-utils';
import EditableCellFields from './grid-edit/editable-cell-fields';
import { useCellChange } from '../hooks/use-cell-change';
import { useCellCommit } from '../hooks/use-cell-commit';
import { useCellRevert } from '../hooks/use-cell-revert';

const GridRows = ({
    state,
    setState,
    computedColumnWidthsRef,
    dataReceivedRef
}) => {
    const loading = useLoadingIndicator();
    const { onTouchStart } = useDoubleTap();
    const onKeyDown = useTableCellNavigation();
    const windowWidth = useWindowWidth();
    const cellChangedRef = useRef(false);
    const cellChangedFocusRef = useRef(null);
    const clickTimerRef = useRef(null);
    const didDoubleClickRef = useRef(false);
    const { onCellChange, configure: configureCellChange } = useCellChange({ cellChangedRef });
    const { commitChanges, configure: configureCellCommit } = useCellCommit({ cellChangedRef, cellChangedFocusRef });
    const { revertChanges, configure: configureCellRevert } = useCellRevert({ cellChangedFocusRef });

    useEffect(() => {
        setTimeout(() => {
            const active = document.activeElement;
            if (active === document.body && cellChangedFocusRef?.current) {
                const { rowIndex, columnName } = cellChangedFocusRef.current;
                const selector = `[data-row-index="${rowIndex}"][data-col-name="${columnName}"]`;
                const nextCell = document.querySelector(selector);
                if (nextCell?.focus) {
                    nextCell.focus();
                }
            }
            cellChangedFocusRef.current = null;
        }, 0);
    }, [state?.editingCell]);

    useEffect(() => {
        return () => {
            if (clickTimerRef.current) {
                clearTimeout(clickTimerRef.current);
            }
        };
    }, []);

    const isMobile = windowWidth < 701;
    const {
        rowsData,
        firstRow,
        currentPageRows,
        columns,
        rowCssClass,
        rowClickEnabled,
        onRowClick,
        onRowHover,
        onRowOut,
        editButtonEnabled,
        deleteButtonEnabled,
        editButtonEvent,
        deleteButtonEvent,
        enableColumnResize,
        gridID,
        actionColumnAlign,
        enableCellEdit,
        editingCell,
        onCellUpdate,
        editingCellData,
        rowHeight
    } = state || {};
    if (isNull(rowsData) || isNull(computedColumnWidthsRef?.current)) {
        hideLoader(gridID);
        loading ? showLoader(gridID) :
            (isNull(rowsData) ? showLoader(gridID, No_Data_Message)
                : showLoader(gridID, No_Column_Visible_Message));
        return null;
    }
    hideLoader(gridID);
    const buttonColEnabled = editButtonEnabled || deleteButtonEnabled;
    const buttonColWidth = computedColumnWidthsRef?.current?.find(i =>
        i?.name === Button_Column_Key)?.width ?? 0;
    let lastFixedIndex = -1;
    columns.reduceRight((_, col, index) => {
        if (lastFixedIndex === -1 && col?.fixed === true && !col?.hidden) {
            lastFixedIndex = index;
        }
    }, null);
    const onCellEdit = (columnName, rowIndex, baseRowIndex) => {
        setState(prev => ({
            ...prev,
            editingCell: { rowIndex, columnName, baseRowIndex }
        }));
    };
    configureCellChange({ editingCell, editingCellData, rowsData, dataReceivedRef, setState });
    configureCellCommit({ editingCell, onCellUpdate, setState });
    configureCellRevert({ editingCell, editingCellData, rowsData, setState, dataReceivedRef });

    return rowsData.slice(firstRow, firstRow + currentPageRows)
        .map((baseRow, sliceIndex) => {
            const rowIndex = sliceIndex + firstRow;
            const baseRowIndex = baseRow?.__$index__;
            const formattedRow = formatRowData(baseRow, columns);
            const cols = Object.values(columns).map((col, key) => {
                if (col?.hidden === true) return null;
                const columnValue = formattedRow[col?.name?.toLowerCase()];
                const classNames = col?.class || '';
                const colWidth = computedColumnWidthsRef?.current?.find(i =>
                    i?.name === col?.name)?.width ?? 0;
                const colResizable = typeof col?.resizable === "boolean"
                    ? col?.resizable : enableColumnResize;
                const editable = typeof col?.editable === "boolean"
                    ? col?.editable : enableCellEdit;
                const editableColumns = (col.concatColumns?.columns ?? [col?.name])
                    .map((colName, index) => {
                        const columnDef = columns.find(c => c.name === colName);
                        const concatType = col.concatColumns?.editor?.[index];
                        const baseType = columnDef?.editor;
                        return {
                            colName,
                            type: resolveColumnType(concatType, baseType),
                            values: resolveColumnItems(concatType, baseType)
                        };
                    });
                return (
                    <td
                        key={key}
                        className={classNames + (editable === true
                            ? " editable-cell" : "")}
                        tabIndex={editable === true ? 0 : undefined}
                        style={{
                            width: colWidth,
                            maxWidth: colResizable ? undefined : colWidth,
                            minWidth: colResizable ? undefined : colWidth,
                            left: (col?.fixed === true && !isMobile
                                ? computedColumnWidthsRef?.current?.find(i =>
                                    i?.name === col?.name)?.leftPosition ?? '' : ''),
                            position: (col?.fixed === true && !isMobile ? 'sticky' : ''),
                            zIndex: (col?.fixed === true && !isMobile ? 6 : ''),
                            backgroundColor: 'inherit',
                            boxShadow: (lastFixedIndex === key && !isMobile
                                ? '#e0e0e0 -0.5px 0 0 0 inset' : ''),
                            contain: 'layout paint',
                            cursor: editable === true ? 'pointer' : 'default',
                        }}
                        onBlur={() => cellChangedFocusRef.current = null}
                        onDoubleClick={() => {
                            if (clickTimerRef.current) {
                                clearTimeout(clickTimerRef.current);
                            }
                            didDoubleClickRef.current = true;
                            if (editable) {
                                onCellEdit(col.name, rowIndex, baseRowIndex);
                            }
                        }}
                        onMouseDown={(e) => {
                            if (e.target instanceof HTMLElement
                                && e.target.tagName === 'A') {
                                e.preventDefault();
                            }
                            if (!editable) e.preventDefault()
                        }}
                        onKeyDown={(e) => onKeyDown(e, {
                            editable,
                            editingCell,
                            rowIndex,
                            col,
                            columns,
                            onCellEdit,
                            baseRowIndex
                        })}
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
                        ) : (
                            !isNull(col?.render)
                                && typeof col?.render === 'function' ? (
                                col.render(formattedRow, baseRow)
                            ) : (
                                <div
                                    style={{
                                        height: "100%",
                                        textAlign: "left",
                                        padding: "10px 25px"
                                    }}
                                    className="mg--0 pd--0"
                                    title={columnValue?.toString()}
                                >
                                    {columnValue?.toString()}
                                </div>
                            )
                        )}
                    </td>
                );
            });
            const isActionColumnLeft = actionColumnAlign === 'left';
            const isActionColumnRight = actionColumnAlign === 'right';
            const insert = isActionColumnLeft ? 'unshift' : 'push';
            if (buttonColEnabled) {
                cols[insert](
                    <td key="gridButtons" className="alignCenter"
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: buttonColWidth,
                            maxWidth: buttonColWidth,
                            minWidth: buttonColWidth,
                            left: (isActionColumnLeft && !isMobile ? 0 : ''),
                            right: (isActionColumnRight && !isMobile ? "-0.1px" : ''),
                            position: ((isActionColumnRight || isActionColumnLeft)
                                && !isMobile ? 'sticky' : ''),
                            zIndex: ((isActionColumnRight || isActionColumnLeft)
                                && !isMobile ? 6 : ''),
                            backgroundColor: (isActionColumnRight || isActionColumnLeft
                                ? 'inherit' : ''),
                            boxShadow: (isActionColumnLeft && !isMobile ?
                                '#e0e0e0 -0.5px 0 0 0 inset' :
                                (isActionColumnRight && !isMobile
                                    ? '#e0e0e0 0.5px 0 0 0 inset' : '')),
                            contain: 'layout paint'
                        }}>
                        <div className="mg--0 pd--0 button-column alignCenter"
                            style={{ width: buttonColWidth }}>
                            {editButtonEnabled && (
                                <div
                                    className=
                                    "pd--0 mg--0 icon-div alignCenter grid-icon-div"
                                    title="Edit"
                                    onClick={e => editButtonEvent(e, baseRow)}
                                    data-toggle="tooltip"
                                    role="button"
                                    tabIndex="0"
                                    onKeyDown={
                                        (e) => {
                                            if (e.key === 'Enter' || e.key === ' ')
                                                editButtonEvent(e, baseRow)
                                        }}
                                >
                                    <EditIcon />
                                </div>
                            )}
                            {deleteButtonEnabled && (
                                <div
                                    className=
                                    "pd--0 mg--0 icon-div alignCenter grid-icon-div"
                                    title="Delete"
                                    onClick={e => deleteButtonEvent(e, baseRow)}
                                    data-toggle="tooltip"
                                    role="button"
                                    tabIndex="0"
                                    onKeyDown={
                                        (e) => {
                                            if (e.key === 'Enter' || e.key === ' ')
                                                deleteButtonEvent(e, baseRow)
                                        }}
                                >
                                    <DeleteIcon />
                                </div>
                            )}
                        </div>
                    </td>
                );
            }
            return (
                <tr
                    key={rowIndex}
                    className={`${rowCssClass} gridRow`}
                    style={{
                        cursor: rowClickEnabled ? 'pointer' : undefined,
                        height: rowHeight
                    }}
                    onClick={(e) => {
                        clickTimerRef.current = setTimeout(() => {
                            if (!didDoubleClickRef.current) {
                                onRowClick(e, baseRow);
                            }
                            didDoubleClickRef.current = false;
                        }, 400);
                    }}
                    onMouseOver={e => onRowHover(e, baseRow)}
                    onMouseOut={e => onRowOut(e, baseRow)}
                >
                    {cols}
                </tr>
            );
        });
};

export default GridRows;