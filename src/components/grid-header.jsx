/* eslint-disable react/prop-types */
import React from 'react';
import { Button_Column_Key, Container_Identifier, Default_Grid_Width_VW } from '../constants';
import { convertViewportUnitToPixels, getContainerWidthInPixels, isNull } from '../helpers/common';
import { useWindowWidth } from '../hooks/use-window-width';
import { calculateColumnWidth, tryParseWidth } from "../utils/component-utils";
import ColumnSortIcon from './column-sort-icon';
import Input from './input';
import ActionIcon from '../icons/action-icon';

const GridHeader = ({
    state,
    setState,
    onHeaderClicked,
    onSearchClicked,
    gridHeaderRef,
    computedColumnWidthsRef
}) => {
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 700;
    const {
        columns,
        hiddenColIndex,
        enableColumnSearch,
        concatColumns,
        editButtonEnabled,
        deleteButtonEnabled,
        headerCssClass,
        gridID,
        columnWidths,
        enableColumnResize,
        rowsData,
        searchValues,
        actionColumnAlign
    } = state;
    if (isNull(columns) || isNull(columnWidths)) return null;
    const noData = !Array.isArray(rowsData) || rowsData.length === 0;
    let headers = [...columns];
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
        const insert = isActionColumnLeft ? 'unshift' : 'push';
        headers[insert]('##Actions##');
    }

    let leftPosition = 0;

    const lastVisibleIndex = (Array.isArray(headers) ?
        headers.reduce((lastIdx, item, idx) =>
            (!item?.hidden ? idx : lastIdx), -1)
        : -1
    ) - ((isActionColumnLeft && buttonColEnabled) ? 1 : 0);

    const thColHeaders = headers.map((header, key) => {
        key -= (isActionColumnLeft && buttonColEnabled) ? 1 : 0;

        if (hiddenColIndex?.includes(key)) return null;

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

        const colResizable = header?.resizable ?? enableColumnResize;
        if (header === '##Actions##') {
            return (
                <th
                    style={{
                        width: buttonColWidth,
                        maxWidth: buttonColWidth,
                        minWidth: buttonColWidth,
                        left: (isActionColumnLeft ? 0 : ''),
                        right: (isActionColumnRight ? 0 : ''),
                        position: (isActionColumnRight || isActionColumnLeft ? 'sticky' : ''),
                        zIndex: (isActionColumnRight || isActionColumnLeft ? 10 : ''),
                        backgroundColor: (isActionColumnRight || isActionColumnLeft ? 'inherit' : ''),
                        contain: 'layout paint'
                    }}
                    title="Actions"
                    data-toggle="tooltip"
                    key={key}
                >
                    <div
                        style={{ width: buttonColWidth, maxWidth: buttonColWidth }}
                        className={"p-0 emptyHeader alignCenter"}
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
            const colNames = !isNull(concatColumns[key]?.cols) ? concatColumns[key].cols : [header?.name];
            if (typeof onHeaderClicked === 'function') onHeaderClicked(e, colNames, header?.name);
        };
        return (
            <th
                style={{
                    width: colWidth,
                    maxWidth: colResizable ? undefined : colWidth,
                    minWidth: colResizable ? undefined : colWidth,
                    left: (header?.fixed === true ?
                        computedColumnWidths?.find(i => i?.name === header?.name)?.leftPosition ?? '' : ''),
                    position: (header?.fixed === true ? 'sticky' : ''),
                    zIndex: (header?.fixed === true ? 10 : ''),
                    backgroundColor: 'inherit',
                    contain: 'layout paint'
                }}
                key={key}
                data-column-name={header?.name}
                onClick={onClickHandler}
                className="pointer"
            >
                <div
                    className="p-0 m-0 alignCenter"
                >
                    <div className="headerText">{displayName}</div>
                    <ColumnSortIcon columns={columns} header={header} />
                </div>
                {thInnerHtml}
            </th>
        );
    });
    const thSearchHeaders = headers.map((header, key) => {
        key -= actionColumnAlign === 'left' ? 1 : 0;
        if (hiddenColIndex?.includes(key)) return null;
        const conCols = !isNull(concatColumns[key]) ? concatColumns[key].cols : null;
        const formatting = header?.formatting;
        const colWidth = computedColumnWidths?.find(i => i?.name === header?.name)?.width ?? 0;
        const colResizable = header?.resizable ?? enableColumnResize;
        const columnSearchEnabled = header?.searchEnable ?? enableColumnSearch;
        if (columnSearchEnabled) {
            searchRowEnabled = true;
        };
        if (header === '##Actions##') {
            return (
                <th
                    style={{
                        width: buttonColWidth,
                        maxWidth: buttonColWidth,
                        minWidth: buttonColWidth,
                        left: (isActionColumnLeft ? 0 : ''),
                        right: (isActionColumnRight ? 0 : ''),
                        position: (isActionColumnRight || isActionColumnLeft ? 'sticky' : ''),
                        zIndex: (isActionColumnRight || isActionColumnLeft ? 10 : ''),
                        backgroundColor: (isActionColumnRight || isActionColumnLeft ? 'inherit' : ''),
                        boxShadow: (isActionColumnLeft ?
                            '#e0e0e0 -0.5px 0px 0px 0px inset' :
                            (isActionColumnRight ? '#e0e0e0 0.5px 0px 0px 0px inset' : '')),
                        contain: 'layout paint'
                    }}
                    key={key}
                >
                    <div
                        style={{
                            width: buttonColWidth,
                            maxWidth: buttonColWidth
                        }}
                        className="p-0 alignCenter"
                    ></div>
                </th>
            );
        };
        return (
            <th
                className="alignCenter"
                style={{
                    width: colWidth,
                    maxWidth: colResizable ? undefined : colWidth,
                    minWidth: colResizable ? undefined : colWidth,
                    left: (header?.fixed === true ?
                        computedColumnWidths?.find(i => i?.name === header?.name)?.leftPosition ?? '' : ''),
                    position: (header?.fixed === true ? 'sticky' : ''),
                    zIndex: (header?.fixed === true ? 10 : ''),
                    backgroundColor: 'inherit',
                    contain: 'layout paint'
                }}
                key={key}
                data-column-name={header?.name}
            >
                <div
                    style={{
                        opacity: (noData ? '0.8' : '')
                    }}
                    className="searchDiv p-0 m-0">
                    {columnSearchEnabled ? (
                        <Input
                            className="searchInput"
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