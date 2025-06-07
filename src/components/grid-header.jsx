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
    onHeaderClicked,
    onSearchClicked,
    columnWidths = [],
    gridHeaderRef,
    computedColumnWidthsRef
}) => {
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 700;
    if (isNull(columns) || isNull(columnWidths)) return null;
    let headers = [...columns];
    let computedColumnWidths = [];
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
                zIndex: (header?.fixed === true ? 101 : '')
            }} /> : null;
        const colWidth = calculateColumnWidth(columnWidths, hiddenColIndex, key, buttonColEnabled, isMobile);
        if (header?.name) {
            computedColumnWidths = [
                ...computedColumnWidths.filter(entry => entry?.name !== header?.name),
                { name: header?.name, width: colWidth ?? 0, leftPosition: `${leftPosition}px` }
            ];
        }
        leftPosition += tryParseWidth(colWidth, containerWidth);
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
            onHeaderClicked(e, colNames);
        };
        return (
            <th
                style={{
                    width: colWidth,
                    maxWidth: colWidth,
                    left: (header?.fixed === true ?
                        computedColumnWidths?.find(i => i?.name === header?.name)?.leftPosition ?? '' : ''),
                    position: (header?.fixed === true ? 'sticky' : ''),
                    zIndex: (header?.fixed === true ? 20 : ''),
                    backgroundColor: 'inherit'
                }}
                key={key}
            >
                <div className="row p-0 m-0 alignCenter">
                    <div
                        onClick={onClickHandler}
                        className="p-0 alignCenter pointer"
                    >
                        <h4>{displayName}</h4>
                        {renderSortIcon()}
                    </div>
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
        let columnSearchEnabled = enableColumnSearch
            ? header?.searchEnable ?? true
            : header?.searchEnable ?? false;

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
                    maxWidth: colWidth,
                    left: (header?.fixed === true ?
                        computedColumnWidths?.find(i => i?.name === header?.name)?.leftPosition ?? '' : ''),
                    position: (header?.fixed === true ? 'sticky' : ''),
                    zIndex: (header?.fixed === true ? 20 : ''),
                    backgroundColor: 'inherit'
                }}
                key={key}
            >
                <div className="row searchDiv p-0 m-0 alignCenter">
                    {columnSearchEnabled ? (
                        <input
                            className="searchInput"
                            placeholder="Search"
                            onChange={(e) => onSearchClicked(e, header?.name, conCols, formatting)}
                            type="text"
                        />
                    ) : (
                        <>.</>
                    )}
                </div>
            </th>
        );
    });
    computedColumnWidthsRef.current = [...computedColumnWidths];
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