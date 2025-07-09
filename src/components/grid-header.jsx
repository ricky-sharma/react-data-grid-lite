/* eslint-disable react/prop-types */
import React from 'react';
import { Button_Column_Key, Container_Identifier, Default_Grid_Width_VW } from '../constants';
import { convertViewportUnitToPixels, getContainerWidthInPixels, isNull } from '../helpers/common';
import { useDraggableColumns } from '../hooks/use-draggable-columns';
import { useWindowWidth } from '../hooks/use-window-width';
import ActionIcon from '../icons/action-icon';
import { calculateColumnWidth, tryParseWidth } from "../utils/component-utils";
import ColumnSortIcon from './column-sort-icon';
import Input from './custom-fields/input';

const GridHeader = ({
    state,
    setState,
    onHeaderClicked,
    onSearchClicked,
    gridHeaderRef,
    computedColumnWidthsRef
}) => {
    const windowWidth = useWindowWidth();
    const { getColumnProps } = useDraggableColumns(state?.columns,
        setState, state?.onColumnDragEnd);
    const isMobile = windowWidth < 701;
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
        enableColumnDrag
    } = state;

    const noData = !Array.isArray(rowsData) || rowsData.length === 0;
    const headers = [...columns];
    let computedColumnWidths = [];
    if (computedColumnWidthsRef) computedColumnWidthsRef.current = [];
    let searchRowEnabled = false;
    const containerWidth = getContainerWidthInPixels(Container_Identifier,
        convertViewportUnitToPixels(Default_Grid_Width_VW));
    let buttonColEnabled = editButtonEnabled || deleteButtonEnabled;
    const buttonColWidth = calculateColumnWidth(columnWidths, hiddenColIndex,
        Button_Column_Key, buttonColEnabled, isMobile);

    if (Button_Column_Key) {
        computedColumnWidths = [
            ...computedColumnWidths.filter(entry => entry?.name !== Button_Column_Key),
            { name: Button_Column_Key, width: buttonColWidth ?? 0 }
        ];
    }

    const isActionColumnLeft = actionColumnAlign === 'left';
    const isActionColumnRight = actionColumnAlign === 'right';

    if (buttonColEnabled && headers[headers.length - 1] !== '##Actions##') {
        headers[isActionColumnLeft ? 'unshift' : 'push']('##Actions##');
    }

    let leftPosition = 0;

    const lastVisibleIndex = (Array.isArray(headers) ?
        headers.reduce((lastIdx, item, idx) =>
            (!item?.hidden ? idx : lastIdx), -1)
        : -1
    ) - ((isActionColumnLeft && buttonColEnabled) ? 1 : 0);

    const getActionColumnStyle = (withBoxShadow = false) => {
        const baseStyle = {
            width: buttonColWidth,
            maxWidth: buttonColWidth,
            minWidth: buttonColWidth,
            left: isActionColumnLeft && !isMobile ? 0 : '',
            right: isActionColumnRight && !isMobile ? "-0.1px" : '',
            position: (isActionColumnRight || isActionColumnLeft) && !isMobile ? 'sticky' : '',
            zIndex: (isActionColumnRight || isActionColumnLeft) && !isMobile ? 10 : '',
            backgroundColor: isActionColumnRight || isActionColumnLeft ? 'inherit' : '',
            contain: 'layout paint',
        };

        if (withBoxShadow && !isMobile) {
            baseStyle.boxShadow = isActionColumnLeft
                ? '#e0e0e0 -0.5px 0px 0px 0px inset'
                : isActionColumnRight
                    ? '#e0e0e0 0.5px 0px 0px 0px inset'
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
            contain: 'layout paint'
        };
    };
    const thColHeaders = headers.map((header, key) => {
        key -= (isActionColumnLeft && buttonColEnabled) ? 1 : 0;

        if (header?.hidden === true) return null;

        const thInnerHtml = lastVisibleIndex !== key ?
            <span style={{
                zIndex: (header?.fixed === true ? 11 : '')
            }} /> : null;

        const colWidth = calculateColumnWidth(columnWidths, hiddenColIndex,
            key, buttonColEnabled, isMobile);

        if (header?.name) {
            computedColumnWidths = [
                ...computedColumnWidths.filter(entry => entry?.name !== header?.name),
                { name: header?.name, width: colWidth ?? 0, leftPosition: `${leftPosition}px` }
            ];
        }

        leftPosition += tryParseWidth((isActionColumnLeft && key === -1 ?
            buttonColWidth : colWidth), containerWidth);

        if (header === '##Actions##') {
            return (
                <th
                    style={getActionColumnStyle()}
                    title="Actions"
                    data-toggle="tooltip"
                    key={key}
                    role="columnheader"
                    aria-label="Actions"
                >
                    <div
                        style={{ width: buttonColWidth, maxWidth: buttonColWidth }}
                        className={"pd--0 emptyHeader alignCenter"}
                    >
                        <ActionIcon />
                    </div>
                    {actionColumnAlign === 'left' ? <span style={{
                        zIndex: 11
                    }} /> : null}
                </th>
            );
        };
        const displayName = isNull(header?.alias) || header?.name === header?.alias
            ? header?.name
            : header?.alias;
        const onClickHandler = (e) => {
            const colNames = !isNull(header?.concatColumns?.columns) ? header?.concatColumns?.columns : [header?.name];
            if (typeof onHeaderClicked === 'function') onHeaderClicked(e, colNames, header?.name);
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
                className="pointer"
                role="columnheader"
                aria-label={displayName}
                tabIndex="0"
            >
                <div
                    className="pd--0 mg--0 alignCenter" data-column-name={header?.name}
                >
                    <div className="headerText" data-column-name={header?.name}>{displayName}</div>
                    <ColumnSortIcon columns={columns} header={header} />
                </div>
                {thInnerHtml}
            </th>
        );
    });
    const thSearchHeaders = headers.map((header, key) => {
        key -= actionColumnAlign === 'left' ? 1 : 0;
        if (header?.hidden === true) return null;
        const conCols = header?.concatColumns?.columns ?? null;
        const formatting = header?.formatting;
        const colWidth = computedColumnWidths?.find(i => i?.name === header?.name)?.width ?? 0;
        const columnSearchEnabled = typeof header?.enableSearch === "boolean"
            ? header?.enableSearch : enableColumnSearch;
        if (columnSearchEnabled) {
            searchRowEnabled = true;
        };
        if (header === '##Actions##') {
            return (
                <th
                    style={getActionColumnStyle(true)}
                    key={key}
                >
                    <div
                        style={{
                            width: buttonColWidth,
                            maxWidth: buttonColWidth
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
                            placeholder="Search"
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
                                if (typeof onSearchClicked === 'function') {
                                    onSearchClicked(e, header?.name, conCols, formatting);
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
            <tr className={`${headerCssClass} gridHeader`} id={`thead-row-${gridID}`}>
                {thColHeaders}
            </tr>
            {searchRowEnabled && <tr className={`${headerCssClass} searchHeader`}>{thSearchHeaders}</tr>}
        </thead>
    );
};

export default GridHeader;