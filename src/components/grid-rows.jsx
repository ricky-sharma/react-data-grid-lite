import React, { useCallback, useEffect, useRef } from 'react';
import {
    Button_Column_Key,
    No_Column_Visible_Message,
    No_Data_Message,
    Selection_Column_Key
} from '../constants';
import { isNull } from '../helpers/common';
import { useCellChange } from '../hooks/use-cell-change';
import { useCellCommit } from '../hooks/use-cell-commit';
import { useCellRevert } from '../hooks/use-cell-revert';
import { useDoubleTap } from '../hooks/use-double-tap';
import useLoadingIndicator from '../hooks/use-loading-indicator';
import { useTableCellNavigation } from '../hooks/use-table-cell-navigation';
import { useWindowWidth } from '../hooks/use-window-width';
import DeleteIcon from '../icons/delete-icon';
import EditIcon from '../icons/edit-icon';
import { formatRowData } from '../utils/component-utils';
import { hideLoader, showLoader } from '../utils/loading-utils';
import Checkbox from './custom-fields/checkbox';
import GridCell from './grid-cell';

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

    const onCellEdit = useCallback((columnName, rowIndex, baseRowIndex) => {
        setState(prev => ({
            ...prev,
            editingCell: { rowIndex, columnName, baseRowIndex }
        }));
    });

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
        gridID,
        actionColumnAlign,
        editingCell,
        onCellUpdate,
        editingCellData,
        rowHeight,
        enableRowSelection,
        rowSelectColumnAlign,
        onRowSelect
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
    const selectionColWidth = computedColumnWidthsRef?.current?.find(i =>
        i?.name === Selection_Column_Key)?.width ?? 0;
    let lastFixedIndex = -1;
    columns.reduceRight((_, col, index) => {
        if (lastFixedIndex === -1 && col?.fixed === true && !col?.hidden) {
            lastFixedIndex = index;
        }
    }, null);
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
                return (
                    <GridCell
                        key={key}
                        keyProp={key}
                        col={col}
                        isMobile={isMobile}
                        computedColumnWidthsRef={computedColumnWidthsRef}
                        lastFixedIndex={lastFixedIndex}
                        rowIndex={rowIndex}
                        baseRowIndex={baseRowIndex}
                        baseRow={baseRow}
                        formattedRow={formattedRow}
                        onCellEdit={onCellEdit}
                        onKeyDown={onKeyDown}
                        onTouchStart={onTouchStart}
                        commitChanges={commitChanges}
                        onCellChange={onCellChange}
                        revertChanges={revertChanges}
                        cellChangedFocusRef={cellChangedFocusRef}
                        clickTimerRef={clickTimerRef}
                        didDoubleClickRef={didDoubleClickRef}
                    />
                );
            });
            const isActionColumnLeft = actionColumnAlign === 'left';
            const isActionColumnRight = actionColumnAlign === 'right';
            const isSelectionColumnLeft = rowSelectColumnAlign === 'left';
            const isSelectionColumnRight = rowSelectColumnAlign === 'right';
            const insertSelectionColumn = isSelectionColumnLeft ? 'unshift' : 'push';
            var selectionColLeft = isActionColumnLeft && isSelectionColumnLeft && !isMobile ? buttonColWidth :
                (!isActionColumnLeft && isSelectionColumnLeft && !isMobile ? 0 : '');
            var selectionColRight = isActionColumnRight && isSelectionColumnRight && !isMobile ? buttonColWidth :
                !isActionColumnRight && isSelectionColumnRight && !isMobile ? "-0.1px" : '';
            if (enableRowSelection) {
                cols[insertSelectionColumn](
                    <td key="gridSelectionColumn" className="alignCenter"
                        onClick={e => e.stopPropagation()}
                        title="Select row"
                        aria-label="Select row"
                        style={{
                            width: selectionColWidth,
                            maxWidth: selectionColWidth,
                            minWidth: selectionColWidth,
                            left: selectionColLeft,
                            right: selectionColRight,
                            position: ((isSelectionColumnRight || isSelectionColumnLeft)
                                && !isMobile ? 'sticky' : ''),
                            zIndex: ((isActionColumnRight || isSelectionColumnLeft)
                                && !isMobile ? 6 : ''),
                            backgroundColor: (isSelectionColumnRight || isSelectionColumnLeft
                                ? 'inherit' : ''),
                            boxShadow: (isSelectionColumnLeft && !isMobile ?
                                '#e0e0e0 -0.5px 0 0 0 inset' :
                                (isSelectionColumnRight && !isMobile
                                    ? '#e0e0e0 0.5px 0 0 0 inset' : '')),
                            contain: 'layout paint'
                        }}>
                        <div className="mg--0 pd--0 selection-column alignCenter"
                            style={{ width: selectionColWidth }}>
                            <Checkbox onChange={() => {
                                if (typeof onRowSelect === 'function')
                                    onRowSelect?.(formattedRow, baseRow);
                            }} />
                        </div>
                    </td>
                );
            }
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
                        }, 200);
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