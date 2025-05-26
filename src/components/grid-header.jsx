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
    let headers = [...columns]; // Clone to avoid mutating props
    const hiddenCols = hiddenColIndex || [];
    const enableColSearch = enableColumnSearch || false;
    const concatCols = concatColumns || [];
    let columnSearchEnabled = false;
    let searchRowEnabled = false;
    let buttonColEnabled = editButtonEnabled || deleteButtonEnabled;
    const buttonColWidth = calculateColumnWidth(
        columnWidths,
        hiddenColIndex,
        Button_Column_Key,
        buttonColEnabled,
        isMobile
    );
    const sortIconHtml =
        (<div className="sort-icon-wrapper alignCenter">
            <i className='updown-icon inactive icon-sort' />
        </div>)

    // Modify headers based on buttons
    if ((buttonColEnabled)
        && headers[headers?.length - 1] !== '') {
        headers.push('');
    }

    const thColHeaders = headers.map((header, key, { length }) => {
        const thInnerHtml = length !== key + 1 ? <span></span> : null;
        const hideClass = hiddenCols.includes(key) ? 'd-none' : '';
        const inputProps = {
            className: !isNull(header?.cssClass) ? `${header?.cssClass} row p-0 m-0` : 'row p-0 m-0',
        };
        const colWidth = calculateColumnWidth(
            columnWidths,
            hiddenCols,
            key,
            buttonColEnabled,
            isMobile
        );

        if (header === '') {
            return (
                <th
                    style={{
                        "width": buttonColWidth,
                        "maxWidth": buttonColWidth
                    }}
                    key={key}
                    className={`${hideClass}${!isNull(header?.cssClass) ? ` ${header?.cssClass}` : ''}`}
                >
                    <div
                        className={"p-0 emptyHeader alignCenter"}
                    ></div>
                    {thInnerHtml}
                </th>
            );
        } else {
            return (
                <th
                    style={{
                        "width": colWidth,
                        "maxWidth": colWidth
                    }}
                    key={key}
                    className={`${hideClass}${!isNull(header?.cssClass) ? ` ${header?.cssClass}` : ''}`}
                >
                    <div {...inputProps} className={"alignCenter"}>
                        <div
                            onClick={
                                (e) => onHeaderClicked(
                                    e,
                                    (!isNull(concatCols) && !isNull(concatCols[key]?.cols)
                                        ? concatCols[key]?.cols : [header?.name])
                                )
                            }
                            className={`p-0 alignCenter pointer ${!isNull(header?.cssClass) ? ` ${header?.cssClass}` : ''
                                }`}
                        >
                            <h4>
                                {
                                    isNull(header?.alias) || header?.name === header?.alias ?
                                        header?.name : header?.alias
                                }
                            </h4>
                            {sortIconHtml}
                        </div>
                    </div>
                    {thInnerHtml}
                </th>
            );
        }
    });

    const thSearchHeaders = headers.map((header, key) => {
        const conCols = !isNull(concatCols[key]) ? concatCols[key].cols : null;
        const formatting = header?.formatting;
        const hideClass = hiddenCols.includes(key) ? 'd-none' : '';
        const inputProps = {
            className: !isNull(header.cssClass)
                ? `${header.cssClass} row searchDiv p-0 m-0`
                : 'row searchDiv p-0 m-0',
        };
        const colWidth = calculateColumnWidth(
            columnWidths,
            hiddenCols,
            key,
            buttonColEnabled,
            isMobile
        );
        columnSearchEnabled = enableColSearch
            ? header?.searchEnable ?? true
            : header?.searchEnable ?? false;

        if (columnSearchEnabled) {
            searchRowEnabled = true;
        }

        if (header === '') {
            return (
                <th
                    style={{
                        "width": buttonColWidth,
                        "maxWidth": buttonColWidth
                    }}
                    key={key}
                    className={`${hideClass}${!isNull(header.cssClass) ? ` ${header.cssClass}` : ''}`}
                >
                    <div
                        className={"p-0 alignCenter"}
                    ></div>
                </th>
            );
        } else {
            return (
                <th
                    style={{
                        "width": colWidth,
                        "maxWidth": colWidth
                    }}
                    key={key}
                    className={`${hideClass}${!isNull(header.cssClass) ? ` ${header.cssClass}` : ''}`}
                >
                    <div {...inputProps} className={"alignCenter"}>
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
        }
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
