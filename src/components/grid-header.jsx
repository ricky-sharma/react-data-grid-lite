/* eslint-disable react/prop-types */
import React from 'react';
import { Button_Column_Key } from '../constants';
import { isNull } from '../helper/common';
import { useWindowWidth } from '../hooks/use-window-width';
import { calculateColumnWidth } from "../utils/component-utils";

const GridHeader = ({
    columns,
    hiddenColIndex = [],
    enableColumnSearch = true,
    concatColumns = [],
    editButtonEnabled = false,
    deleteButtonEnabled = false,
    headerCssClass = '',
    gridID = '',
    onHeaderClicked = () => { },
    onSearchClicked = () => { },
    columnWidths = [],
    gridHeaderRef = null
}) => {
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 700;
    if (isNull(columns)) return null;
    let headers = [...columns];
    let searchRowEnabled = false;
    let buttonColEnabled = editButtonEnabled || deleteButtonEnabled;
    const buttonColWidth = calculateColumnWidth(columnWidths, hiddenColIndex, Button_Column_Key, buttonColEnabled, isMobile);
    const renderSortIcon = () => (
        <div className="sort-icon-wrapper alignCenter">
            <i className="updown-icon inactive icon-sort" />
        </div>
    );

    if ((buttonColEnabled) && headers[headers?.length - 1] !== '') {
        headers.push('');
    }

    const thColHeaders = headers.map((header, key, { length }) => {
        if (hiddenColIndex?.includes(key)) return null;
        const thInnerHtml = length !== key + 1 ? <span /> : null;
        const colWidth = calculateColumnWidth(columnWidths, hiddenColIndex, key, buttonColEnabled, isMobile);
        if (header === '') {
            return (
                <th
                    style={{ width: buttonColWidth, maxWidth: buttonColWidth }}
                    title="Actions"
                    data-toggle="tooltip"
                    key={key}
                    className={`${header?.class ?? ''}`}
                >
                    <div
                        style={{ width: buttonColWidth, maxWidth: buttonColWidth }}
                        className={"p-0 emptyHeader alignCenter"}
                    >
                        <i className="icon-common-css toolbox-icon emptyHeader" />
                    </div>
                </th>
            );
        }
        const displayName = isNull(header?.alias) || header?.name === header?.alias
            ? header?.name
            : header?.alias;

        const onClickHandler = (e) => {
            const colNames = !isNull(concatColumns[key]?.cols) ? concatColumns[key].cols : [header?.name];
            onHeaderClicked(e, colNames);
        };
        return (
            <th
                style={{ width: colWidth, maxWidth: colWidth }}
                key={key}
                className={`${header?.class ?? ''}`}
            >
                <div className={`${header?.class ?? ''} row p-0 m-0 alignCenter`}>
                    <div
                        onClick={onClickHandler}
                        className={`p-0 alignCenter pointer ${header?.class ?? ''}`}
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
        const colWidth = calculateColumnWidth(columnWidths, hiddenColIndex, key, buttonColEnabled, isMobile);
        let columnSearchEnabled = enableColumnSearch
            ? header?.searchEnable ?? true
            : header?.searchEnable ?? false;

        if (columnSearchEnabled) {
            searchRowEnabled = true;
        }

        if (header === '') {
            return (
                <th
                    style={{ width: buttonColWidth, maxWidth: buttonColWidth }}
                    key={key}
                    className={`${header?.class ?? ''}`}
                >
                    <div
                        style={{
                            width: buttonColWidth,
                            maxWidth: buttonColWidth
                        }}
                        className={"p-0 alignCenter"}
                    ></div>
                </th>
            );
        }
        return (
            <th
                style={{ width: colWidth, maxWidth: colWidth }}
                key={key}
                className={`${header?.class ?? ''}`}
            >
                <div className={`${header?.class ?? ''} row searchDiv p-0 m-0 alignCenter`}>
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