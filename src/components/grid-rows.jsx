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
import { formatRowData } from '../utils/component-utils';
import { hideLoader, showLoader } from '../utils/loading-utils';
import EditableCellFields from './editable-cell-fields';

const GridRows = ({
    state,
    setState,
    computedColumnWidthsRef
}) => {
    const loading = useLoadingIndicator();
    const { onTouchStart } = useDoubleTap();
    const onKeyDown = useTableCellNavigation();
    const windowWidth = useWindowWidth();
    const cellChangedRef = useRef(false);
    const cellChangedFocusRef = useRef(null);
    const clickTimerRef = useRef(null);
    const didDoubleClickRef = useRef(false);
    useEffect(() => {
        if (cellChangedFocusRef?.current != null) {
            const { rowIndex, columnName } = cellChangedFocusRef.current;
            const currentRow = Number(rowIndex);
            let nextSelector =
                `[data-row-index="${currentRow}"][data-col-name="${columnName}"]`;
            if (nextSelector) {
                const nextCell = document.querySelector(nextSelector);
                if (nextCell && typeof nextCell.focus === 'function') nextCell.focus();
            }
            cellChangedFocusRef.current = null
        }
    }, [state?.editingCell])

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
        editingCellData
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
    const onCellEdit = (columnName, rowIndex) => {
        setState(prev => ({
            ...prev,
            editingCell: { rowIndex, columnName }
        }));
    };
    const onCellChange = (colName, e) => {
        const updatedData = [...rowsData];
        const rowIndex = editingCell.rowIndex;
        const newValue = e.target.value;
        const prevEditingData = editingCellData || {};
        const alreadySaved = Object.prototype
            .hasOwnProperty.call(prevEditingData, colName);
        const originalValue = rowsData[rowIndex][colName];

        updatedData[rowIndex] = {
            ...updatedData[rowIndex],
            [colName]: newValue
        };
        setState(prev => ({
            ...prev,
            rowsData: updatedData,
            editingCellData: alreadySaved
                ? prev.editingCellData
                : {
                    ...prev.editingCellData,
                    [colName]: originalValue
                }
        }));
        cellChangedRef.current = true;
    };
    const commitChanges = (
        rowIndex,
        editedColumns,
        updatedRow,
        isExiting
    ) => {
        const exiting = isExiting === true;
        cellChangedFocusRef.current = exiting ? editingCell : null;
        setState(prev => ({
            ...prev,
            editingCell: exiting ? null : prev.editingCell,
            editingCellData: exiting ? null : prev.editingCellData,
        }));
        const shouldFireCellUpdate = exiting && cellChangedRef.current;
        if (shouldFireCellUpdate && typeof onCellUpdate === 'function') {
            onCellUpdate({
                rowIndex,
                editedColumns: editedColumns.map(col => ({
                    ...col,
                    newValue: updatedRow[col.colName],
                })),
                updatedRow
            });
            cellChangedRef.current = false;
        }
    };
    const revertChanges = (editableColumns) => {
        const updatedData = [...rowsData];
        const rowIndex = editingCell.rowIndex;
        const updatedRow = { ...updatedData[rowIndex] };
        cellChangedFocusRef.current = editingCell;
        editableColumns.forEach(({ colName }) => {
            if (editingCellData?.hasOwnProperty(colName)) {
                updatedRow[colName] = editingCellData[colName];
            }
        });
        updatedData[rowIndex] = updatedRow;
        setState(prev => ({
            ...prev,
            editingCell: null,
            editingCellData: null,
            rowsData: updatedData
        }));
    };
    let clickTimer;
    return rowsData.slice(firstRow, firstRow + currentPageRows)
        .map((baseRow, rowIndex) => {
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
                    .map((colName) => {
                        const columnDef = columns.find(c => c.name === colName);
                        return {
                            colName,
                            type: columnDef?.type || 'text'
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
                                ? '#e0e0e0 -0.5px 0px 1px 0px inset' : ''),
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
                                onCellEdit(col.name, rowIndex);
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
                            onCellEdit
                        })}
                        onTouchStart={onTouchStart(() => {
                            if (editable === true) onCellEdit(col.name, rowIndex);
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
                                rowIndex={rowIndex}
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
                                        padding: "10px 18px"
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
                                '#e0e0e0 -0.5px 0px 0px 0px inset' :
                                (isActionColumnRight && !isMobile
                                    ? '#e0e0e0 0.5px 0px 0px 0px inset' : '')),
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
                    style={rowClickEnabled ? { cursor: 'pointer' } : {}}
                    onClick={(e) => {
                        clickTimerRef.current = setTimeout(() => {
                            if (!didDoubleClickRef.current) {
                                onRowClick(e, baseRow);
                            }
                            didDoubleClickRef.current = false;
                        }, 250);
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