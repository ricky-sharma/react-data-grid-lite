import PropTypes from 'prop-types';
import React from 'react';
import {
    Data_Loading_Message,
    Desktop_Button_Column_Width,
    Mobile_Button_Column_Width,
    No_Data_Message
} from '../constants';
import { isNull } from '../helper/common';
import { format } from "../helper/date";
import { useIsMobile } from '../hooks/use-Is-Mobile';
import useLoadingIndicator from '../hooks/use-loading-indicator';
import { calColWidth } from "../utils/component-utils";

const LoadingIndicator = () => {
    const { loading } = useLoadingIndicator();
    return loading ? Data_Loading_Message : No_Data_Message;
};

const GridRows = ({
    rowsData,
    first,
    count,
    hiddenColIndex,
    concatColumns,
    columnFormatting,
    cssClassColumns,
    columns,
    columnWidths,
    rowCssClass,
    rowClickEnabled,
    onRowClick,
    onRowHover,
    onRowOut,
    editButtonEnabled,
    deleteButtonEnabled,
    editButtonEvent,
    deleteButtonEvent
}) => {
    if (!Array.isArray(rowsData) || rowsData.length === 0) {
        return (
            <tr
                key="No-Data"
                style={{
                    height: "50px",
                    borderColor: "transparent"
                }}
                className={"align-page-center"}
            >
                <th style={{
                    width: "100%",
                    border: 0,
                    padding: "50px",
                    margin: "50px",
                    fontWeight: "400"
                }}
                >
                    <LoadingIndicator />
                </th>
            </tr>
        );
    }
    const isMobile = useIsMobile();
    let buttonColEnabled = editButtonEnabled || deleteButtonEnabled;
    let buttonColWidth = isMobile ? Mobile_Button_Column_Width : Desktop_Button_Column_Width;

    return rowsData.slice(first, first + count).map((row, index) => {
        const cols = Object.values(row).map((col, key) => {
            let conValue = '';
            const conCols = !isNull(concatColumns) ? concatColumns[key]?.cols : null;
            const conSep = !isNull(concatColumns) ? concatColumns[key]?.sep : null;

            if (conCols) {
                conCols.forEach((conName) => {
                    const colDef = columns.find(c => c?.Name?.toUpperCase() === conName?.toUpperCase());
                    if (colDef && row[colDef.Name] !== undefined) {
                        conValue += row[colDef.Name] + conSep;
                    }
                });

                if (conValue.endsWith(conSep)) {
                    conValue = conValue.slice(0, -conSep.length);
                }
            }

            let columnValue = conValue !== '' ? conValue : col;

            const formatInfo = !isNull(columnFormatting) ? columnFormatting[key] : null;
            if (!isNull(columnValue) && formatInfo && formatInfo.type && formatInfo.format) {
                const typeUpper = formatInfo.type.toUpperCase();
                if (typeUpper === 'DATE' || typeUpper === 'DATETIME') {
                    columnValue = format(new Date(columnValue), formatInfo.format);
                }
            }

            const classNames = !isNull(cssClassColumns) ? cssClassColumns[key] : '';
            const hideClass = hiddenColIndex.includes(key) ? 'd-none' : '';
            const tdClass = `${hideClass}${classNames ? ` ${classNames}` : ''}`;
            const colWidth = calColWidth(columnWidths, key, buttonColEnabled, isMobile);

            return (
                <td
                    className={tdClass}
                    key={key}
                    style={{
                        "width": colWidth,
                        "maxWidth": colWidth
                    }}
                >
                    <div
                        className={`${classNames} m-0 p-0`}
                        title={columnValue}
                    >
                        {columnValue}
                    </div>
                </td>
            );
        });

        // Action Buttons
        let actionButtons = null;
        if (buttonColEnabled) {
            const editBtn = editButtonEnabled && (
                <div
                    style={{
                        margin: "auto"
                    }}
                    className="p-0 m-0"
                    title="Edit"
                    onClick={(e) => editButtonEvent(e, row)}
                    data-toggle="tooltip"
                >
                    <span className="edit-icon-pen"></span>
                </div>
            );
            const deleteBtn = deleteButtonEnabled && (
                <div
                    style={{
                        margin: "auto"
                    }}
                    className="p-0 m-0"
                    title="Delete"
                    onClick={(e) => deleteButtonEvent(e, row)}
                    data-toggle="tooltip"
                >
                    <span className="delete-icon"></span>
                </div>
            );

            actionButtons = (
                <td
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        "width": buttonColWidth,
                        "maxWidth": buttonColWidth
                    }}
                    key="gridButtons"
                >
                    <div
                        className={"m-0 p-0 align-center button-column"}
                    >
                        {editBtn}
                        {deleteBtn}
                    </div>
                </td>
            );
        }

        if (actionButtons) cols.push(actionButtons);

        return (
            <tr
                key={index}
                style={rowClickEnabled ? { cursor: 'pointer' } : {}}
                onClick={(e) => onRowClick(e, row)}
                onMouseOver={(e) => onRowHover(e, row)}
                onMouseOut={(e) => onRowOut(e, row)}
                className={rowCssClass || 'gridRows'}
            >
                {cols}
            </tr>
        );
    });
};

GridRows.propTypes = {
    rowsData: PropTypes.arrayOf(PropTypes.object),
    first: PropTypes.number,
    count: PropTypes.number,
    hiddenColIndex: PropTypes.arrayOf(PropTypes.number),
    concatColumns: PropTypes.arrayOf(PropTypes.shape({
        cols: PropTypes.arrayOf(PropTypes.string),
        sep: PropTypes.string,
    })),
    columnFormatting: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string,
        format: PropTypes.string,
    })),
    cssClassColumns: PropTypes.arrayOf(PropTypes.string),
    columns: PropTypes.arrayOf(PropTypes.object),
    columnWidths: PropTypes.arrayOf(PropTypes.string),
    rowCssClass: PropTypes.string,
    rowClickEnabled: PropTypes.bool,
    onRowClick: PropTypes.func,
    onRowHover: PropTypes.func,
    onRowOut: PropTypes.func,
    editButtonEnabled: PropTypes.bool,
    deleteButtonEnabled: PropTypes.bool,
    editButtonEvent: PropTypes.func,
    deleteButtonEvent: PropTypes.func,
};

GridRows.defaultProps = {
    rowsData: [],
    first: 1,
    count: 10,
    hiddenColIndex: [],
    concatColumns: [],
    columnFormatting: [],
    cssClassColumns: [],
    columns: [],
    columnWidths: [],
    rowCssClass: 'gridRows',
    rowClickEnabled: false,
    onRowClick: () => { },
    onRowHover: () => { },
    onRowOut: () => { },
    editButtonEnabled: false,
    deleteButtonEnabled: false,
    editButtonEvent: () => { },
    deleteButtonEvent: () => { },
};

export default GridRows;