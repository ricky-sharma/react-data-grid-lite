/* eslint-disable react/prop-types */
import React from 'react';
import {
    Button_Column_Key,
    No_Column_Visible_Message,
    No_Data_Message
} from '../constants';
import { isNull } from '../helpers/common';
import useLoadingIndicator from '../hooks/use-loading-indicator';
import { useWindowWidth } from '../hooks/use-window-width';
import DeleteIcon from '../icons/delete-icon';
import EditIcon from '../icons/edit-icon';
import { formatRowData } from '../utils/component-utils';
import { hideLoader, showLoader } from '../utils/loading-utils';
import Input from './input';
import { useDoubleTap } from '../hooks/use-double-tap';
import { useTableCellNavigation } from '../hooks/use-table-cell-navigation';

const GridRows = ({
    state,
    setState,
    computedColumnWidthsRef
}) => {
    const loading = useLoadingIndicator();
    const { onTouchStart } = useDoubleTap();
    const onKeyDown = useTableCellNavigation();
    const windowWidth = useWindowWidth();
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
    const onCellDoubleClick = (columnName, rowIndex) => {
        setState(prev => ({
            ...prev,
            editingCell: { rowIndex, columnName }
        }));
    };

    const onCellChange = (e) => {
        const updatedData = [...rowsData];
        updatedData[editingCell.rowIndex] = {
            ...updatedData[editingCell.rowIndex],
            [editingCell.columnName]: e.target.value
        };
        setState(prev => ({
            ...prev,
            editingCellData: prev.editingCellData ??
                prev.rowsData[editingCell.rowIndex][editingCell.columnName],
            rowsData: updatedData,
        }));
    };
    const commitChanges = (rowIndex, columnName, newValue, updatedRow) => {
        setState(prev => ({
            ...prev,
            editingCell: null,
            editingCellData: null
        }));
        if (typeof onCellUpdate === 'function') {
            onCellUpdate({ rowIndex, columnName, newValue, updatedRow })
        }
    };

    const revertChanges = () => {
        const updatedData = [...rowsData];
        updatedData[editingCell.rowIndex] = {
            ...updatedData[editingCell.rowIndex],
            [editingCell.columnName]: editingCellData
        };
        setState(prev => ({
            ...prev,
            editingCell: null,
            editingCellData: null,
            rowsData: updatedData
        }));
    };
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
                        onDoubleClick={() =>
                            editable === true ?
                                onCellDoubleClick(col.name, rowIndex) : {}
                        }
                        onMouseDown={(e) => {
                            e.preventDefault();
                        }}
                        onKeyDown={(e) => onKeyDown(e, {
                            editable,
                            editingCell,
                            rowIndex,
                            col,
                            columns,
                            onCellDoubleClick
                        })}
                        onTouchStart={onTouchStart(() => {
                            if (editable) onCellDoubleClick(col.name, rowIndex);
                        })}
                        data-row-index={rowIndex}
                        data-col-name={col?.name}
                    >
                        {editable === true &&
                            editingCell?.rowIndex === rowIndex &&
                            editingCell?.columnName === col?.name ? (
                            <div
                                style={{
                                    height: "100%",
                                    textAlign: "left",
                                    padding: "5px 18px"
                                }}
                                className="mg--0 pd--0 editField"
                                title={columnValue?.toString()}
                            >
                                <Input
                                    type={col?.type || 'text'}
                                    value={baseRow[col?.name]}
                                    onChange={onCellChange}
                                    onBlur={
                                        () => commitChanges(rowIndex, col?.name, baseRow[col?.name], baseRow)
                                    }
                                    autoFocus={true}
                                    ref={(input) => {
                                        if (input) {
                                            input.focus();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            commitChanges(rowIndex, col?.name, baseRow[col?.name], baseRow);
                                        } else if (e.key === 'Escape') {
                                            e.preventDefault();
                                            revertChanges();
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            !isNull(col?.render) && typeof col?.render === 'function' ? (
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
                    onClick={e => onRowClick(e, baseRow)}
                    onMouseOver={e => onRowHover(e, baseRow)}
                    onMouseOut={e => onRowOut(e, baseRow)}
                >
                    {cols}
                </tr>
            );
        });
};

export default GridRows;