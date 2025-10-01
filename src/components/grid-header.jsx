import React, { useMemo } from 'react';
import { Button_Column_Key, Button_Column_Width, Left_Space_Column_Key, Right_Space_Column_Key, Selection_Column_Key, Selection_Column_Width } from '../constants';
import { isNull } from '../helpers/common';
import { useDraggableColumns } from '../hooks/use-draggable-columns';
import { useVirtualColumns } from '../hooks/use-virtual-columns';
import { useWindowWidth } from '../hooks/use-window-width';
import ActionIcon from '../icons/action-icon';
import { calculateColumnWidth, tryParseValue } from "../utils/component-utils";
import { getActionColumnStyle, getHeaderCellStyles } from '../utils/grid-style-utils';
import { gridWidthType } from '../utils/grid-width-type-utils';
import ColumnMenu from './column-menu';
import ColumnSortIcon from './column-sort-icon';
import Checkbox from './custom-fields/checkbox';
import Input from './custom-fields/input';
import { handleHeaderSelectAllChange } from './events/handle-header-selectall-change';

const GridHeader = ({
    state,
    setState,
    onHeaderClicked,
    searchHandler,
    gridHeaderRef,
    computedColumnWidthsRef,
    tableRef
}) => {
    const windowWidth = useWindowWidth();
    const { getColumnProps } = useDraggableColumns(
        state?.columns,
        setState,
        state?.onColumnDragEnd
    );

    const {
        columns,
        enableColumnSearch,
        editButtonEnabled,
        deleteButtonEnabled,
        headerCssClass,
        gridID,
        enableColumnResize,
        rowsData,
        searchValues,
        actionColumnAlign,
        enableColumnDrag,
        gridHeaderBackgroundColor,
        enableSorting,
        enableRowSelection,
        rowSelectColumnAlign,
        onSelectAll,
        showColumnMenu,
        enableRtl,
        enableVirtualColumns
    } = state || {};
    const buttonColEnabled = editButtonEnabled || deleteButtonEnabled;
    const isSelectionColumnLeft = enableRowSelection === true && rowSelectColumnAlign === 'left';
    const isSelectionColumnRight = enableRowSelection === true && rowSelectColumnAlign === 'right';
    const isActionColumnLeft = buttonColEnabled && actionColumnAlign === 'left';
    const isActionColumnRight = buttonColEnabled && actionColumnAlign === 'right';

    const { colWidthMap, computedColumnWidths } = useMemo(() => {
        let colWidthMap = {};
        let leftMap = {};
        let computed = [];
        let left = 0;

        state?.columns?.forEach((header, _key) => {
            let key = _key;
            if (isSelectionColumnLeft) key -= 1;
            if (isActionColumnLeft) key -= 1;

            if (header?.hidden === true || header?.hideable === true) return;

            const width = calculateColumnWidth(
                columns,
                header,
                buttonColEnabled,
                gridID,
                enableRowSelection
            );

            const actualWidth = (isSelectionColumnLeft && key === selectionColOffset)
                ? Selection_Column_Width
                : (isActionColumnLeft && key === actionColOffset)
                    ? Button_Column_Width
                    : width;

            if (header?.name) {
                colWidthMap[header.name] = width;
                leftMap[header.name] = left;
                computed.push({
                    name: header.name,
                    width: width ?? 0,
                    leftPosition: `${left}px`
                });
            }

            left += tryParseValue(actualWidth);
        });

        if (buttonColEnabled) {
            computed = [...computed, { name: Button_Column_Key, width: Button_Column_Width }];
        }
        if (enableRowSelection === true) {
            computed = [...computed, { name: Selection_Column_Key, width: Selection_Column_Width }];
        }
        return { colWidthMap, leftMap, computedColumnWidths: computed };
    }, [
        columns,
        buttonColEnabled,
        gridID,
        enableRowSelection,
        isSelectionColumnLeft,
        isActionColumnLeft
    ]);

    if (computedColumnWidthsRef) computedColumnWidthsRef.current = [...computedColumnWidths];

    const {
        visibleColumns,
        leftBufferWidth,
        rightBufferWidth
    } = useVirtualColumns({
        tableRef,
        computedColumnWidthsRef
    });

    if (!state || isNull(state.columns)) return null;

    const { isSmallWidth, isMobileWidth } = gridWidthType(windowWidth, gridID);
    const isMobile = isSmallWidth || isMobileWidth;
    const noData = !Array.isArray(rowsData) || rowsData.length === 0;
    const filteredColumns = enableVirtualColumns ? visibleColumns : columns;
    const headers = [...filteredColumns];
    if (!headers.some(col => !col?.hideable && !col?.hidden)) return null;

    let searchRowEnabled = false;

    if (enableVirtualColumns) {
        headers['unshift'](Left_Space_Column_Key);
        headers['push'](Right_Space_Column_Key);
    }

    if (enableRowSelection) {
        headers[isSelectionColumnLeft ? 'unshift' : 'push'](Selection_Column_Key);
    }

    if (buttonColEnabled) {
        headers[isActionColumnLeft ? 'unshift' : 'push'](Button_Column_Key);
    }

    const totalExternalCols =
        (isSelectionColumnLeft ? 1 : 0) +
        (isActionColumnLeft ? 1 : 0);

    const lastVisibleIndex = (Array.isArray(headers)
        ? headers.reduce((lastIdx, item, idx) =>
            !item?.hidden ? idx : lastIdx, -1)
        : -1
    ) - totalExternalCols;

    const selectionColOffset = isSelectionColumnLeft ? -1 : 0;
    const actionColOffset = isActionColumnLeft ? selectionColOffset - 1 : selectionColOffset;

    const thColHeaders = headers.map((header, _key) => {
        let key = _key;

        if (isSelectionColumnLeft) key -= 1;
        if (isActionColumnLeft) key -= 1;

        if (header?.hidden === true || header?.hideable === true) return null;
        const colResizable = typeof header?.resizable === "boolean"
            ? header?.resizable : enableColumnResize;
        const thInnerHtml = lastVisibleIndex !== key || colResizable === true ?
            <span style={{
                zIndex: (header?.fixed === true ? 11 : '')
            }} /> : null;

        if (header === Left_Space_Column_Key) {
            return <th
                key={key}
                style={{
                    width: leftBufferWidth,
                    minWidth: leftBufferWidth,
                    maxWidth: leftBufferWidth,
                    padding: 0,
                    margin: 0
                }} />
        }
        else if (header === Right_Space_Column_Key) {
            return <th
                key={key}
                style={{
                    width: rightBufferWidth,
                    minWidth: rightBufferWidth,
                    maxWidth: rightBufferWidth,
                    padding: 0,
                    margin: 0
                }} />
        }
        else if (header === Button_Column_Key || header === Selection_Column_Key) {
            const selectedRows = new Set(state?.selectedRows);
            const firstRow = state?.firstRow ?? 0;
            const lastRow = firstRow + (state?.currentPageRows ?? 0);
            const currentPageRows = state?.rowsData?.slice(firstRow, lastRow) ?? [];
            const isAllSelected = currentPageRows?.length > 0 ?
                currentPageRows?.every(row => selectedRows?.has(row?.__$index__)) : false;
            return (
                <th
                    style={
                        getActionColumnStyle(
                            header,
                            isActionColumnLeft,
                            isActionColumnRight,
                            isSelectionColumnLeft,
                            isSelectionColumnRight,
                            isMobile,
                            enableRtl,
                            true
                        )
                    }
                    title={header === Button_Column_Key ? "Actions" : "Select all rows"}
                    key={key}
                    role="columnheader"
                    aria-label={header === Button_Column_Key ? "Actions" : "Select all rows"}
                >
                    <div
                        style={{
                            width: header === Button_Column_Key ? Button_Column_Width : Selection_Column_Width,
                            maxWidth: header === Button_Column_Key ? Button_Column_Width : Selection_Column_Width
                        }}
                        className={"pd--0 emptyHeader alignCenter"}
                    > {
                            (header === Button_Column_Key && <ActionIcon />) ||
                            (header === Selection_Column_Key &&
                                <Checkbox
                                    isSelected={isAllSelected}
                                    onChange={(e) => handleHeaderSelectAllChange(e, state, setState, onSelectAll)}
                                />
                            )
                        }
                    </div>
                    {(isActionColumnLeft && header === Button_Column_Key)
                        || (isSelectionColumnLeft && header === Selection_Column_Key)
                        || (isActionColumnRight && isSelectionColumnRight && header === Selection_Column_Key) ?
                        <span style={{ zIndex: 11 }} />
                        : null}
                </th>
            );
        };
        const displayName = isNull(header?.alias) || header?.name === header?.alias
            ? header?.name
            : header?.alias;
        const sortable = typeof header?.sortable === "boolean"
            ? header?.sortable
            : enableSorting;
        const onClickHandler = (e) => {
            const colNames = !isNull(header?.concatColumns?.columns) ? header?.concatColumns?.columns : [header?.name];
            if (typeof onHeaderClicked === 'function' && sortable === true) onHeaderClicked(e, colNames, header?.name);
        };

        const draggableProps = (typeof header?.draggable === 'boolean' ?
            header.draggable : enableColumnDrag)
            ? getColumnProps(header.displayIndex)
            : {};

        return (
            <th {...draggableProps}
                style={
                    getHeaderCellStyles(
                        header,
                        colWidthMap[header?.name],
                        enableColumnResize,
                        enableRtl,
                        isMobile,
                        computedColumnWidths
                    )
                }
                key={key}
                data-column-name={header?.name}
                onClick={onClickHandler}
                onKeyDown={
                    (e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                            onClickHandler(e)
                    }}
                className={sortable === true ? ' pointer' : undefined}
                role="columnheader"
                aria-label={displayName}
                tabIndex="0"
            >
                <div
                    className={`pd--0 mg--0 alignCenter${sortable === true ? ' pointer' : ''}`}
                    data-column-name={header?.name}
                >
                    <div
                        className="headerText"
                        style={
                            typeof header?.headerStyle === 'object' && !Array.isArray(header?.headerStyle)
                                ? header.headerStyle
                                : {}
                        }
                        data-column-name={header?.name}>
                        {displayName}
                    </div>
                    {sortable === true && <ColumnSortIcon columns={columns} header={header} />}
                    {showColumnMenu === true && <ColumnMenu column={header} sortable={sortable} />}
                </div>
                {thInnerHtml}
            </th>
        );
    });
    const thSearchHeaders = headers.map((header, _key) => {
        let key = _key;

        if (isSelectionColumnLeft) key -= 1;
        if (isActionColumnLeft) key -= 1;

        if (header?.hidden === true || header?.hideable === true) return null;
        const conCols = header?.concatColumns?.columns ?? null;
        const formatting = header?.formatting;
        const columnSearchEnabled = typeof header?.enableSearch === "boolean"
            ? header?.enableSearch : enableColumnSearch;
        const displayName = isNull(header?.alias) || header?.name === header?.alias
            ? header?.name
            : header?.alias;
        if (columnSearchEnabled) {
            searchRowEnabled = true;
        };

        if (header === Left_Space_Column_Key) {
            return <th
                key={key}
                style={{
                    width: leftBufferWidth,
                    minWidth: leftBufferWidth,
                    maxWidth: leftBufferWidth,
                    padding: 0,
                    margin: 0
                }} />
        }
        else if (header === Right_Space_Column_Key) {
            return <th
                key={key}
                style={{
                    width: rightBufferWidth,
                    minWidth: rightBufferWidth,
                    maxWidth: rightBufferWidth,
                    padding: 0,
                    margin: 0
                }} />
        }
        else if (header === Button_Column_Key || header === Selection_Column_Key) {
            return (
                <th
                    style={
                        getActionColumnStyle(
                            header,
                            isActionColumnLeft,
                            isActionColumnRight,
                            isSelectionColumnLeft,
                            isSelectionColumnRight,
                            isMobile,
                            enableRtl
                        )
                    }
                    key={key}
                >
                    <div
                        style={{
                            width: header === Button_Column_Key ? Button_Column_Width : Selection_Column_Width,
                            maxWidth: header === Button_Column_Key ? Button_Column_Width : Selection_Column_Width,
                        }}
                        className="pd--0 alignCenter"
                    ></div>
                </th>
            );
        };
        return (
            <th
                className="alignCenter"
                style={
                    getHeaderCellStyles(
                        header,
                        colWidthMap[header?.name],
                        enableColumnResize,
                        enableRtl,
                        isMobile,
                        computedColumnWidths
                    )
                }
                key={key}
                data-column-name={header?.name}
            >
                <div
                    style={{
                        opacity: (noData ? '0.8' : '')
                    }}
                    className="searchDiv pd--0 mg--0">
                    {columnSearchEnabled ? (
                        <Input
                            placeholder={header?.searchPlaceholder ?? `Search ${displayName?.toLowerCase()}`}
                            type="text"
                            value={searchValues?.[header?.name] ?? ''}
                            onChange={(e) => {
                                const updatedVal = e.target.value;
                                setState(prev => ({
                                    ...prev,
                                    searchValues: {
                                        ...prev.searchValues,
                                        [header?.name]: updatedVal
                                    }
                                }));
                                if (typeof searchHandler === 'function') {
                                    searchHandler(e, header?.name, conCols, formatting);
                                }
                            }}
                        />
                    ) : (
                        <>.</>
                    )}
                </div>
            </th>
        );
    });

    return (
        <thead ref={gridHeaderRef}>
            <tr style={{ backgroundColor: gridHeaderBackgroundColor }} className={`${headerCssClass} gridHeader`} id={`thead-row-${gridID}`}>
                {thColHeaders}
            </tr>
            {searchRowEnabled && <tr className={`${headerCssClass} searchHeader`}>
                {thSearchHeaders}
            </tr>}
        </thead>
    );
};

export default GridHeader;