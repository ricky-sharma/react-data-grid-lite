import React from 'react';
import { Button_Column_Key, Button_Column_Width, Container_Identifier, Default_Grid_Width_VW, Selection_Column_Key, Selection_Column_Width } from '../constants';
import { convertViewportUnitToPixels, getContainerWidthInPixels, isNull } from '../helpers/common';
import { useDraggableColumns } from '../hooks/use-draggable-columns';
import { useWindowWidth } from '../hooks/use-window-width';
import ActionIcon from '../icons/action-icon';
import { calculateColumnWidth, tryParseWidth } from "../utils/component-utils";
import { gridWidthType } from '../utils/grid-width-type-utils';
import ColumnMenu from './column-menu';
import ColumnSortIcon from './column-sort-icon';
import Checkbox from './custom-fields/checkbox';
import Input from './custom-fields/input';

const GridHeader = ({
    state,
    setState,
    onHeaderClicked,
    searchHandler,
    gridHeaderRef,
    computedColumnWidthsRef
}) => {
    const windowWidth = useWindowWidth();
    const { getColumnProps } = useDraggableColumns(
        state?.columns,
        setState,
        state?.onColumnDragEnd
    );
    if (!state || isNull(state.columns) || isNull(state.columnWidths)) return null;
    const {
        columns,
        hiddenColIndex,
        enableColumnSearch,
        editButtonEnabled,
        deleteButtonEnabled,
        headerCssClass,
        gridID,
        columnWidths,
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
        showColumnMenu
    } = state;

    const { isSmallWidth, isMobileWidth } = gridWidthType(windowWidth, gridID);
    const isMobile = isSmallWidth || isMobileWidth;
    const noData = !Array.isArray(rowsData) || rowsData.length === 0;
    const headers = [...columns];
    if (!headers.some(col => !col?.hideable && !col?.hidden)) return null;
    let computedColumnWidths = [];
    if (computedColumnWidthsRef) computedColumnWidthsRef.current = [];
    let searchRowEnabled = false;
    const containerWidth = getContainerWidthInPixels(`#${gridID} ${Container_Identifier}`,
        convertViewportUnitToPixels(Default_Grid_Width_VW));
    let buttonColEnabled = editButtonEnabled || deleteButtonEnabled;
    if (buttonColEnabled) {
        computedColumnWidths = [
            ...computedColumnWidths.filter(entry => entry?.name !== Button_Column_Key),
            { name: Button_Column_Key, width: Button_Column_Width ?? 0 }
        ];
    }
    if (enableRowSelection === true) {
        computedColumnWidths = [
            ...computedColumnWidths.filter(entry => entry?.name !== Selection_Column_Key),
            { name: Selection_Column_Key, width: Selection_Column_Width }
        ];
    }

    const isSelectionColumnLeft = enableRowSelection === true && rowSelectColumnAlign === 'left';
    const isSelectionColumnRight = enableRowSelection === true && rowSelectColumnAlign === 'right';
    const isActionColumnLeft = buttonColEnabled && actionColumnAlign === 'left';
    const isActionColumnRight = buttonColEnabled && actionColumnAlign === 'right';

    if (enableRowSelection && headers[headers.length - 1] !== Selection_Column_Key) {
        headers[isSelectionColumnLeft ? 'unshift' : 'push'](Selection_Column_Key);
    }

    if (buttonColEnabled && headers[headers.length - 1] !== Button_Column_Key) {
        headers[isActionColumnLeft ? 'unshift' : 'push'](Button_Column_Key);
    }

    const totalExternalCols =
        (isSelectionColumnLeft ? 1 : 0) +
        (isActionColumnLeft ? 1 : 0);

    let leftPosition = 0;

    const lastVisibleIndex = (Array.isArray(headers)
        ? headers.reduce((lastIdx, item, idx) =>
            !item?.hidden ? idx : lastIdx, -1)
        : -1
    ) - totalExternalCols;

    const getActionColumnStyle = (header, withLightBoxShadow = false) => {
        var selectionColLeft = isActionColumnLeft && isSelectionColumnLeft && !isMobile ? Button_Column_Width :
            (!isActionColumnLeft && isSelectionColumnLeft && !isMobile ? 0 : '');
        var buttonColLeft = isActionColumnLeft && !isMobile ? 0 : '';
        var selectionColRight = isActionColumnRight && isSelectionColumnRight && !isMobile ?
            `${tryParseWidth(Button_Column_Width) - 0.5}px` :
            !isActionColumnRight && isSelectionColumnRight && !isMobile ? "-0.5px" : '';
        var buttonColRight = isActionColumnRight && !isMobile ? "-0.5px" : '';

        const baseStyle = {
            width: header === Button_Column_Key ? Button_Column_Width : Selection_Column_Width,
            maxWidth: header === Button_Column_Key ? Button_Column_Width : Selection_Column_Width,
            minWidth: header === Button_Column_Key ? Button_Column_Width : Selection_Column_Width,
            left: header === Button_Column_Key ? buttonColLeft : selectionColLeft,
            right: header === Button_Column_Key ? buttonColRight : selectionColRight,
            position:
                (isActionColumnRight || isActionColumnLeft || isSelectionColumnLeft || isSelectionColumnRight)
                    && !isMobile ? 'sticky' : '',
            zIndex: (isActionColumnRight || isActionColumnLeft || isSelectionColumnLeft || isSelectionColumnRight)
                && !isMobile ? 10 : '',
            backgroundColor: isActionColumnRight || isActionColumnLeft || isSelectionColumnLeft || isSelectionColumnRight
                ? 'inherit' : '',
            contain: 'layout paint',
        };

        if (!isMobile) {
            baseStyle.boxShadow = (header === Button_Column_Key && isActionColumnLeft) ||
                (header === Selection_Column_Key && isSelectionColumnLeft)
                ? `#e0e0e0 ${withLightBoxShadow ? "-0.2px" : "-0.6px"} 0 0 0 inset`
                : (header === Button_Column_Key && isActionColumnRight) ||
                    (header === Selection_Column_Key && isSelectionColumnRight)
                    ? `#e0e0e0 ${withLightBoxShadow ? "0.2px" : "0.6px"} 0 0 0 inset`
                    : '';
        }

        return baseStyle;
    };

    const getHeaderCellStyles = (header, width) => {
        const colResizable = typeof header?.resizable === "boolean"
            ? header?.resizable : enableColumnResize;
        const fixed = header?.fixed && !isMobile;
        return {
            width,
            maxWidth: colResizable ? undefined : width,
            minWidth: colResizable ? undefined : width,
            left: fixed === true ? computedColumnWidths
                .find(i => i.name === header.name)?.leftPosition ?? '' : '',
            position: fixed === true ? 'sticky' : '',
            zIndex: fixed === true ? 10 : '',
            backgroundColor: 'inherit',
            contain: 'layout paint',
            ...(typeof header?.headerStyle === 'object'
                && !Array.isArray(header?.headerStyle) ? header.headerStyle : {})
        };
    };

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

        const colWidth = calculateColumnWidth(
            columnWidths,
            hiddenColIndex,
            key,
            buttonColEnabled,
            gridID,
            enableRowSelection
        );

        if (header?.name) {
            computedColumnWidths = [
                ...computedColumnWidths.filter(entry => entry?.name !== header?.name),
                { name: header?.name, width: colWidth ?? 0, leftPosition: `${leftPosition}px` }
            ];
        }

        leftPosition += tryParseWidth(
            (isSelectionColumnLeft && key === selectionColOffset)
                ? Selection_Column_Width
                : (isActionColumnLeft && key === actionColOffset)
                    ? Button_Column_Width
                    : colWidth,
            containerWidth
        );

        if (header === Button_Column_Key || header === Selection_Column_Key) {
            const selectedRows = new Set(state?.selectedRows);
            const firstRow = state?.firstRow ?? 0;
            const lastRow = firstRow + (state?.currentPageRows ?? 0);
            const currentPageRows = state?.rowsData?.slice(firstRow, lastRow) ?? [];
            const isAllSelected = currentPageRows?.length > 0 ?
                currentPageRows?.every(row => selectedRows?.has(row?.__$index__)) : false;

            return (
                <th
                    style={getActionColumnStyle(header, true)}
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
                                    onChange={(e) => {
                                        const isSelected = e.target.checked;
                                        const firstRow = state?.firstRow ?? 0;
                                        const lastRow = firstRow + (state?.currentPageRows ?? 0);
                                        const currentPageRows = state?.rowsData.slice(firstRow, lastRow) ?? [];
                                        setState(prev => {
                                            const selectedRows = new Set(prev?.selectedRows);
                                            currentPageRows?.forEach(row => {
                                                const index = row?.__$index__;
                                                if (isSelected) {
                                                    selectedRows?.add(index);
                                                } else {
                                                    selectedRows?.delete(index);
                                                }
                                            });
                                            return {
                                                ...prev,
                                                selectedRows
                                            };
                                        });
                                        if (typeof onSelectAll === 'function') {
                                            onSelectAll(e, currentPageRows, isSelected);
                                        }
                                    }}
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
                style={getHeaderCellStyles(header, colWidth)}
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
                    className={`pd--0 mg--0 alignCenter${sortable === true ? ' pointer' : ''}`} data-column-name={header?.name}
                >
                    <div className="headerText" data-column-name={header?.name}>{displayName}</div>
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
        const colWidth = computedColumnWidths?.find(i => i?.name === header?.name)?.width ?? 0;
        const columnSearchEnabled = typeof header?.enableSearch === "boolean"
            ? header?.enableSearch : enableColumnSearch;
        const displayName = isNull(header?.alias) || header?.name === header?.alias
            ? header?.name
            : header?.alias;
        if (columnSearchEnabled) {
            searchRowEnabled = true;
        };
        if (header === Button_Column_Key || header === Selection_Column_Key) {
            return (
                <th
                    style={getActionColumnStyle(header)}
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
                style={getHeaderCellStyles(header, colWidth)}
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

    if (computedColumnWidthsRef) computedColumnWidthsRef.current = [...computedColumnWidths];

    return (
        <thead ref={gridHeaderRef}>
            <tr style={{ backgroundColor: gridHeaderBackgroundColor }} className={`${headerCssClass} gridHeader`} id={`thead-row-${gridID}`}>
                {thColHeaders}
            </tr>
            {searchRowEnabled && <tr className={`${headerCssClass} searchHeader`}>{thSearchHeaders}</tr>}
        </thead>
    );
};

export default GridHeader;