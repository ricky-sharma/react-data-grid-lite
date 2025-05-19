import PropTypes from 'prop-types';
import React from 'react';
import { Desktop_Button_Column_Width, Mobile_Button_Column_Width } from '../constants';
import { isNull } from '../helper/common';
import { useIsMobile } from '../hooks/use-Is-Mobile';
import { calColWidth } from "../utils/component-utils";

const GridHeader = ({
    columns,
    hiddenColIndex,
    enableColumnSearch,
    concatColumns,
    editButtonEnabled,
    deleteButtonEnabled,
    headerCssClass,
    gridID,
    onHeaderClicked,
    onSearchClicked,
    columnWidths,
    gridHeaderRef
}) => {
    if (isNull(columns)) return null;
    const isMobile = useIsMobile();
    let headers = [...columns]; // Clone to avoid mutating props
    const hiddenCols = hiddenColIndex || [];
    const enableColSearch = enableColumnSearch || false;
    const concatCols = concatColumns || [];
    let columnSearchEnabled = false;
    let searchRowEnabled = false;
    let buttonColEnabled = editButtonEnabled || deleteButtonEnabled;
    let buttonColWidth = isMobile ? Mobile_Button_Column_Width : Desktop_Button_Column_Width;
    const sortIconHtml =
        (<div className="sort-icon-wrapper">
            <i className='updown-icon inactive fa fa-sort' />
        </div>)

    // Modify headers based on buttons
    if ((buttonColEnabled)
        && headers[headers.length - 1] !== '') {
        headers.push('');
    }

    const thColHeaders = headers.map((header, key, { length }) => {
        const thInnerHtml = length !== key + 1 ? <span></span> : null;
        const hideClass = hiddenCols.includes(key) ? 'd-none' : '';
        const inputProps = {
            className: !isNull(header.cssClass) ? `${header.cssClass} row p-0 m-0` : 'row p-0 m-0',
        };
        const colWidth = calColWidth(columnWidths, key, buttonColEnabled, isMobile);

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
                        className={"p-0 emptyHeader"}
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
                    className={`${hideClass}${!isNull(header.cssClass) ? ` ${header.cssClass}` : ''}`}
                >
                    <div {...inputProps}>
                        <div
                            onClick={(e) => onHeaderClicked(e, header.Name)}
                            className={`p-0 pointer no-select ${!isNull(header.cssClass) ? ` ${header.cssClass}` : ''
                                }`}
                        >
                            <h4>{isNull(header.Alias) || header.Name === header.Alias ? header.Name : header.Alias}</h4>
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
        const formatting = header?.Formatting;
        const hideClass = hiddenCols.includes(key) ? 'd-none' : '';
        const inputProps = {
            className: !isNull(header.cssClass)
                ? `${header.cssClass} row searchDiv p-0 m-0`
                : 'row searchDiv p-0 m-0',
        };
        const colWidth = calColWidth(columnWidths, key, buttonColEnabled, isMobile);
        columnSearchEnabled = enableColSearch
            ? header?.SearchEnable ?? true
            : header?.SearchEnable ?? false;

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
                        className={"p-0 inline-display"}
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
                    <div {...inputProps}>
                        {columnSearchEnabled ? (
                            <input
                                className="searchInput"
                                placeholder="Search"
                                onChange={(e) => onSearchClicked(e, header.Name, conCols, formatting)}
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
            <tr className={headerCssClass || 'gridHeader'} id={`thead-row-${gridID}`}>
                {thColHeaders}
            </tr>
            {searchRowEnabled && <tr className={headerCssClass || 'searchHeader'}>{thSearchHeaders}</tr>}
        </thead>
    );
};

// PropTypes
GridHeader.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                Name: PropTypes.string,
                Alias: PropTypes.string,
                cssClass: PropTypes.string,
                SearchEnable: PropTypes.bool,
                Formatting: PropTypes.object
            })
        ])
    ).isRequired,
    hiddenColIndex: PropTypes.arrayOf(PropTypes.number),
    enableColumnSearch: PropTypes.bool,
    concatColumns: PropTypes.arrayOf(PropTypes.object),
    editButtonEnabled: PropTypes.bool,
    deleteButtonEnabled: PropTypes.bool,
    headerCssClass: PropTypes.string,
    gridID: PropTypes.string,
    onHeaderClicked: PropTypes.func.isRequired,
    onSearchClicked: PropTypes.func.isRequired,
    columnWidths: PropTypes.arrayOf(PropTypes.string),
    gridHeaderRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any })
    ])
};

// Default Props
GridHeader.defaultProps = {
    hiddenColIndex: [],
    enableColumnSearch: false,
    concatColumns: [],
    editButtonEnabled: false,
    deleteButtonEnabled: false,
    headerCssClass: '',
    gridID: '',
    columnWidths: [],
    gridHeaderRef: null
};

export default GridHeader;
