/* eslint-disable react/prop-types */
import React from 'react';
import {
    Button_Column_Key,
    No_Column_Visible_Message,
    No_Data_Message
} from '../constants';
import { isNull } from '../helper/common';
import { format } from '../helper/format';
import useLoadingIndicator from '../hooks/use-loading-indicator';
import { useWindowWidth } from '../hooks/use-window-width';
import { calculateColumnWidth } from "../utils/component-utils";

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
    const loading = useLoadingIndicator();
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 700;
    let buttonColEnabled = editButtonEnabled || deleteButtonEnabled;
    const buttonColWidth = calculateColumnWidth(
        columnWidths,
        hiddenColIndex,
        Button_Column_Key,
        buttonColEnabled,
        isMobile
    );

    if (!Array.isArray(rowsData) || rowsData.length === 0 || buttonColWidth === '100%') {
        return (
            <tr
                key="No-Data"
                style={{
                    height: "50px",
                    borderColor: "transparent",
                    width: "100%"
                }}
                className={"align-page-center alignCenter"}
            >
                <th style={{
                    width: "100%",
                    border: 0,
                    padding: "50px",
                    margin: "50px",
                    fontWeight: "400"
                }}
                >
                    {loading
                        ? <div className="loader"></div> :
                        buttonColWidth === '100%' ?
                            No_Column_Visible_Message
                            : No_Data_Message}
                </th>
            </tr>
        );
    }
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
            const colWidth = calculateColumnWidth(
                columnWidths,
                hiddenColIndex,
                key,
                buttonColEnabled,
                isMobile
            );

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
                    className="p-0 m-0 icon-div alignCenter grid-icon-div"
                    title="Edit"
                    onClick={(e) => editButtonEvent(e, row)}
                    data-toggle="tooltip"
                >
                    <span className="icon-common-css edit-icon-pen"></span>
                </div>
            );
            const deleteBtn = deleteButtonEnabled && (
                <div
                    style={{
                        margin: "auto"
                    }}
                    className="p-0 m-0 icon-div alignCenter grid-icon-div"
                    title="Delete"
                    onClick={(e) => deleteButtonEvent(e, row)}
                    data-toggle="tooltip"
                >
                    <span className="icon-common-css delete-icon"></span>
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
                        className={"m-0 p-0 button-column alignCenter"}
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