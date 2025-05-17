import PropTypes from 'prop-types';
import React from 'react';
import { isNull } from '../helper/common';

const GridHeader = ({
    columns,
    hiddenColIndex,
    enableColumnSearch,
    concatColumns,
    editButtonEnabled,
    deleteButtonEnabled,
    headerCssClass,
    gridID,
    sortIconHtml,
    onHeaderClicked,
    onSearchClicked,
}) => {
    if (isNull(columns)) return null;

    let headers = [...columns]; // Clone to avoid mutating props
    const hiddenCols = hiddenColIndex || [];
    const enableColSearch = enableColumnSearch || false;
    const concatCols = concatColumns || [];
    let columnSearchEnabled = false;
    let searchRowEnabled = false;

    // Modify headers based on buttons
    if ((editButtonEnabled || deleteButtonEnabled)
        && headers[headers.length - 1] !== '') {
        headers.push('');
    }

    const thColHeaders = headers.map((header, key, { length }) => {
        const thInnerHtml = length !== key + 1 ? <span></span> : null;
        const hideClass = hiddenCols.includes(key) ? 'd-none' : '';
        const inputProps = {
            className: !isNull(header.cssClass) ? `${header.cssClass} row p-0 m-0` : 'row p-0 m-0',
        };

        if (header === '') {
            return (
                <th
                    key={key}
                    className={`${hideClass} ${editButtonEnabled && deleteButtonEnabled ? 'col1width90 p-0' : 'col1width45 p-0'
                        }${!isNull(header.cssClass) ? ' ' + header.cssClass : ''}`}
                >
                    <div
                        className={`${editButtonEnabled && deleteButtonEnabled ? 'col1width90' : 'col1width45'
                            } p-0 inline-display`}
                    ></div>
                    {thInnerHtml}
                </th>
            );
        } else if (isNull(header.Alias) || header.Name === header.Alias) {
            return (
                <th
                    key={key}
                    className={`${hideClass}${!isNull(header.cssClass) ? ' ' + header.cssClass : ''}`}
                >
                    <div {...inputProps}>
                        <div
                            onClick={(e) => onHeaderClicked(e, header.Name)}
                            className={`p-0 pointer inline-display${!isNull(header.cssClass) ? ' ' + header.cssClass : ''
                                }`}
                        >
                            {header.Name}
                            {sortIconHtml}
                        </div>
                    </div>
                    {thInnerHtml}
                </th>
            );
        } else {
            return (
                <th
                    key={key}
                    className={`${hideClass}${!isNull(header.cssClass) ? ' ' + header.cssClass : ''}`}
                >
                    <div {...inputProps}>
                        <div
                            onClick={(e) => onHeaderClicked(e, header.Name)}
                            className={`p-0 pointer inline-display${!isNull(header.cssClass) ? ' ' + header.cssClass : ''
                                }`}
                        >
                            {header.Alias}
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

        columnSearchEnabled = enableColSearch
            ? header?.SearchEnable ?? true
            : header?.SearchEnable ?? false;

        if (columnSearchEnabled) {
            searchRowEnabled = true;
        }

        if (header === '') {
            return (
                <th
                    key={key}
                    className={`${hideClass} ${editButtonEnabled && deleteButtonEnabled ? 'col1width90 p-0' : 'col1width45 p-0'
                        }${!isNull(header.cssClass) ? ' ' + header.cssClass : ''}`}
                >
                    <div
                        className={`${editButtonEnabled && deleteButtonEnabled ? 'col1width90' : 'col1width45'
                            } p-0 inline-display`}
                    ></div>
                </th>
            );
        } else {
            return (
                <th
                    key={key}
                    className={`${hideClass}${!isNull(header.cssClass) ? ' ' + header.cssClass : ''}`}
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
        <thead>
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
    sortIconHtml: PropTypes.node,
    onHeaderClicked: PropTypes.func.isRequired,
    onSearchClicked: PropTypes.func.isRequired
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
    sortIconHtml: null
};

export default GridHeader;
