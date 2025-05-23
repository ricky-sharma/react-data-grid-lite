/* eslint-disable react/prop-types */
import React from 'react';
import {
    Data_Loading_Message,
    Desktop_Button_Column_Width,
    Mobile_Button_Column_Width,
    No_Data_Message
} from '../constants';
import { isNull } from '../helper/common';
import { format } from '../helper/format';
import { useIsMobile } from '../hooks/use-Is-Mobile';
import useLoadingIndicator from '../hooks/use-loading-indicator';
import { calColWidth } from "../utils/component-utils";

const LoadingIndicator = () => {
    const { loading } = useLoadingIndicator();
    return loading ? Data_Loading_Message : No_Data_Message;
};

const GridRows = ({
    rowsData = [],
    first,
    count,
    hiddenColIndex = [],
    concatColumns = [],
    columnFormatting = [],
    cssClassColumns = [],
    columns = [],
    columnWidths = [],
    rowCssClass = '',
    rowClickEnabled = false,
    onRowClick = () => { },
    onRowHover = () => { },
    onRowOut = () => { },
    editButtonEnabled = false,
    deleteButtonEnabled = false,
    editButtonEvent = () => { },
    deleteButtonEvent = () => { }
}) => {
    if (!Array.isArray(rowsData) || rowsData.length === 0) {
        return (
            <tr
                key="No-Data"
                style={{
                    height: "50px",
                    borderColor: "transparent",
                    width: "100%"
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
                    const colDef = columns.find(c => c?.name?.toUpperCase() === conName?.toUpperCase());
                    if (colDef && row[colDef.name] !== undefined) {
                        conValue += row[colDef.name] + conSep;
                    }
                });

                if (conValue.endsWith(conSep)) {
                    conValue = conValue.slice(0, -conSep.length);
                }
            }

            let columnValue = conValue !== '' ? conValue : col;
            const formatInfo = !isNull(columnFormatting) ? columnFormatting[key] : null;
            if (!isNull(columnValue) && formatInfo && formatInfo?.type) {
                columnValue = format(columnValue, formatInfo.type, formatInfo.format)
            }

            const classNames = !isNull(cssClassColumns) && !isNull(cssClassColumns[key]) ? cssClassColumns[key] : '';
            const hideClass = hiddenColIndex.includes(key) ? 'd-none' : '';
            const tdClass = `${hideClass}${classNames ? ` ${classNames}` : ''}`;
            const colWidth = calColWidth(columnWidths, hiddenColIndex, key, buttonColEnabled, isMobile);

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
                    className="p-0 m-0 icon-div grid-icon-div"
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
                    className="p-0 m-0 icon-div grid-icon-div"
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
                        style={{
                            paddingLeft: "4px",
                            paddingRight: "2px"
                        }}
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
                className={`${rowCssClass} gridRows`}
            >
                {cols}
            </tr>
        );
    });
};

export default GridRows;