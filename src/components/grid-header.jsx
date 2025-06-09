/* eslint-disable react/prop-types */
import React from 'react';
import { Button_Column_Key, Container_Identifier, Default_Grid_Width_VW } from '../constants';
import { convertViewportUnitToPixels, getContainerWidthInPixels, isNull } from '../helpers/common';
import { useWindowWidth } from '../hooks/use-window-width';
import { calculateColumnWidth, tryParseWidth } from "../utils/component-utils";

const GridHeader = ({
    columns,
    hiddenColIndex = [],
    enableColumnSearch = true,
    concatColumns = [],
    editButtonEnabled = false,
    deleteButtonEnabled = false,
    headerCssClass = '',
    gridID = '',
    columnWidths = [],
    onHeaderClicked,
    onSearchClicked,
    gridHeaderRef,
    computedColumnWidthsRef,
    enableColumnResize = false
}) => {
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 700;
    if (isNull(columns) || isNull(columnWidths)) return null;
    let headers = [...columns];
    let computedColumnWidths = computedColumnWidthsRef?.current ?? [];
    let searchRowEnabled = false;
    const containerWidth = getContainerWidthInPixels(Container_Identifier,
        convertViewportUnitToPixels(Default_Grid_Width_VW));
    let buttonColEnabled = editButtonEnabled || deleteButtonEnabled;
    const buttonColWidth = isNull(computedColumnWidthsRef?.current) ?
        calculateColumnWidth(columnWidths, hiddenColIndex,
            Button_Column_Key, buttonColEnabled, isMobile) :
        computedColumnWidths?.find(i => i?.name === Button_Column_Key)?.width ?? 0;

    if (Button_Column_Key && isNull(computedColumnWidthsRef?.current)) {
        computedColumnWidths = [
            ...computedColumnWidths.filter(entry => entry?.name !== Button_Column_Key),
            { name: Button_Column_Key, width: buttonColWidth ?? 0 }
        ];
    }

    const renderSortIcon = () => (
        <div className="sort-icon-wrapper alignCenter">
            <i className="updown-icon inactive icon-sort" />
        </div>
    );

    if ((buttonColEnabled) && headers[headers?.length - 1] !== '##Actions##') {
        headers.push('##Actions##');
    }
    let leftPosition = 0;
    const lastVisibleIndex = Array.isArray(headers)
        ? headers.reduce((lastIdx, item, idx) => {
            return item && !item?.hidden ? idx : lastIdx;
        }, -1) : -1;

    const thColHeaders = headers.map((header, key) => {
        if (hiddenColIndex?.includes(key)) return null;
        const thInnerHtml = lastVisibleIndex !== key ?
            <span style={{
                zIndex: (header?.fixed === true ? 11 : '')
            }} /> : null;
        const colWidth = isNull(computedColumnWidthsRef?.current) ?
            calculateColumnWidth(columnWidths, hiddenColIndex, key, buttonColEnabled, isMobile) :
            computedColumnWidths.find(i => i?.name === header?.name)?.width ?? 0;
        if (header?.name && isNull(computedColumnWidthsRef?.current)) {
            computedColumnWidths = [
                ...computedColumnWidths.filter(entry => entry?.name !== header?.name),
                { name: header?.name, width: colWidth ?? 0, leftPosition: `${leftPosition}px` }
            ];
        }
        leftPosition += tryParseWidth(colWidth, containerWidth);
        const colResizable = header?.resizable ?? enableColumnResize;
        if (header === '##Actions##') {
            return (
                <th
                    style={{ width: buttonColWidth, maxWidth: buttonColWidth }}
                    title="Actions"
                    data-toggle="tooltip"
                    key={key}
                >
                    <div
                        style={{ width: buttonColWidth, maxWidth: buttonColWidth }}
                        className={"p-0 emptyHeader alignCenter"}
                    >
                        <i className="icon-common-css toolbox-icon emptyHeader" />
                    </div>
                </th>
            );
        };
        const displayName = isNull(header?.alias) || header?.name === header?.alias
            ? header?.name
            : header?.alias;

        const onClickHandler = (e) => {
            const colNames = !isNull(concatColumns[key]?.cols) ? concatColumns[key].cols : [header?.name];
            if (typeof onHeaderClicked === 'function') onHeaderClicked(e, colNames);
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
                    backgroundColor: 'inherit'
                }}
                key={key}
                data-column-name={header?.name}
            >
                <div
                    onClick={onClickHandler}
                    className="p-0 m-0 alignCenter pointer"
                >
                    <h4>{displayName}</h4>
                    {renderSortIcon()}
                </div>
                {thInnerHtml}
            </th>
        );
    });

    const thSearchHeaders = headers.map((header, key) => {
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
                    style={{ width: buttonColWidth, maxWidth: buttonColWidth }}
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
                style={{
                    width: colWidth,
                    maxWidth: colResizable ? undefined : colWidth,
                    minWidth: colResizable ? undefined : colWidth,
                    left: (header?.fixed === true ?
                        computedColumnWidths?.find(i => i?.name === header?.name)?.leftPosition ?? '' : ''),
                    position: (header?.fixed === true ? 'sticky' : ''),
                    zIndex: (header?.fixed === true ? 10 : ''),
                    backgroundColor: 'inherit'
                }}
                key={key}
                data-column-name={header?.name}
            >
                <div className="row searchDiv p-0 m-0 alignCenter">
                    {columnSearchEnabled ? (
                        <input
                            className="searchInput"
                            placeholder="Search"
                            onChange={typeof onSearchClicked === 'function' ?
                                (e) => onSearchClicked(e, header?.name, conCols, formatting) :
                                () => { }
                            }
                            type="text"
                        />
                    ) : (
                        <>.</>
                    )}
                </div>
            </th>
        );
    });
    if (computedColumnWidthsRef &&
        isNull(computedColumnWidthsRef?.current)) {
        computedColumnWidthsRef.current = [...computedColumnWidths];
    }
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