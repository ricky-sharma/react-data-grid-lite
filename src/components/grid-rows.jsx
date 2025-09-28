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
import { useResizableTableColumns } from '../hooks/use-resizable-table-columns';
import { useTableCellNavigation } from '../hooks/use-table-cell-navigation';
import { useVirtualColumns } from '../hooks/use-virtual-columns';
import { useVirtualRows } from '../hooks/use-virtual-rows';
import { useWindowWidth } from '../hooks/use-window-width';
import { formatRowData } from '../utils/component-utils';
import { gridWidthType } from '../utils/grid-width-type-utils';
import { hideLoader, isDotLoaderActive, showLoader } from '../utils/loading-utils';
import GridActionCell from './grid-action-cell';
import GridCell from './grid-cell';
import GridSelectionCell from './grid-selection-cell';

const GridRows = ({
    state,
    setState,
    computedColumnWidthsRef,
    dataReceivedRef,
    tableRef,
    isResizingRef
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
        gridID,
        actionColumnAlign,
        editingCell,
        onCellUpdate,
        editingCellData,
        rowHeight,
        enableRowSelection,
        rowSelectColumnAlign,
        selectedRows,
        enableVirtualColumns,
        enableVirtualRows,
    } = state || {};

    const pageData = rowsData?.slice(firstRow, firstRow + currentPageRows) || [];

    const {
        visibleRows,
        startIndex,
        topPaddingHeight,
        bottomPaddingHeight
    } = useVirtualRows({
        pageData,
        tableRef
    });

    const {
        visibleColumns,
        leftBufferWidth,
        rightBufferWidth
    } = useVirtualColumns({
        tableRef,
        computedColumnWidthsRef
    });

    useResizableTableColumns(
        tableRef,
        state,
        setState,
        computedColumnWidthsRef,
        isResizingRef
    );

    const filteredRows = enableVirtualRows ? visibleRows : pageData;
    const rowStartIndex = enableVirtualRows ? startIndex : firstRow;
    const visibleNames = new Set(visibleColumns?.map(col => col?.name));
    const filteredColumns = enableVirtualColumns ? columns?.filter(col => visibleNames?.has(col?.name)) : columns;

    const { isSmallWidth, isMobileWidth } = gridWidthType(windowWidth, gridID);
    const isMobile = isSmallWidth || isMobileWidth;
    const noData = isNull(rowsData);
    const shouldShowLoader =
        noData ||
        isNull(computedColumnWidthsRef?.current) ||
        !columns.some(col => !col?.hideable && !col?.hidden);

    if (shouldShowLoader) {
        const loaderActive = isDotLoaderActive?.();
        if (loading) {
            if (loaderActive === undefined || !loaderActive) {
                hideLoader(gridID);
                showLoader(gridID);
            }
        } else {
            hideLoader(gridID);
            const message = noData ? No_Data_Message : No_Column_Visible_Message;
            showLoader(gridID, message);
        }
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
    const gridRows = filteredRows
        .map((baseRow, sliceIndex) => {
            const rowIndex = sliceIndex + rowStartIndex;
            const baseRowIndex = baseRow?.__$index__;
            const formattedRow = formatRowData(baseRow, columns);
            const cols = Object.values(filteredColumns).map((col, key) => {
                if (col?.hidden === true || col?.hideable === true) return null;
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
            if (enableVirtualColumns) {
                cols['unshift'](
                    <td
                        key={`leftSpace${baseRowIndex}`}
                        style={{
                            width: leftBufferWidth,
                            maxWidth: leftBufferWidth,
                            minWidth: leftBufferWidth,
                            padding: 0,
                            margin: 0
                        }} />
                );
                cols['push'](
                    <td key={`rightSpace${baseRowIndex}`}
                        style={{
                            width: rightBufferWidth,
                            maxWidth: rightBufferWidth,
                            minWidth: rightBufferWidth,
                            padding: 0,
                            margin: 0
                        }} />
                );
            }
            const isActionColumnLeft = actionColumnAlign === 'left';
            const isActionColumnRight = actionColumnAlign === 'right';
            const isSelectionColumnLeft = rowSelectColumnAlign === 'left';
            const isSelectionColumnRight = rowSelectColumnAlign === 'right';
            const insertSelectionColumn = isSelectionColumnLeft ? 'unshift' : 'push';
            if (enableRowSelection) {
                cols[insertSelectionColumn](
                    <GridSelectionCell
                        key={`gridSelectionColumn${baseRowIndex}`}
                        selectionColWidth={selectionColWidth}
                        isSelectionColumnLeft={isSelectionColumnLeft}
                        isSelectionColumnRight={isSelectionColumnRight}
                        isActionColumnLeft={isActionColumnLeft}
                        isActionColumnRight={isActionColumnRight}
                        isMobile={isMobile}
                        buttonColWidth={buttonColWidth}
                        baseRow={baseRow}
                    />
                );
            }
            const insertButtonColumn = isActionColumnLeft ? 'unshift' : 'push';
            if (buttonColEnabled) {
                cols[insertButtonColumn](
                    <GridActionCell
                        key={`gridButtons${baseRowIndex}`}
                        buttonColWidth={buttonColWidth}
                        isActionColumnLeft={isActionColumnLeft}
                        isActionColumnRight={isActionColumnRight}
                        isMobile={isMobile}
                        baseRow={baseRow}
                    />
                );
            }
            return (
                <tr
                    key={rowIndex}
                    className={`${rowCssClass} ${selectedRows?.has(baseRow?.__$index__) ? 'selected' : ''} gridRow`}
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

    return (
        <>
            {enableVirtualRows &&
                <tr style={{
                    height: topPaddingHeight,
                    padding: 0,
                    margin: 0
                }} />
            }
            {gridRows}
            {enableVirtualRows &&
                <tr style={{
                    height: bottomPaddingHeight,
                    padding: 0,
                    margin: 0
                }} />
            }
        </>
    )
};

export default GridRows;