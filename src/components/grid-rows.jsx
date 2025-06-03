/* eslint-disable react/prop-types */
import React from 'react';
import {
    Button_Column_Key,
    No_Column_Visible_Message,
    No_Data_Message
} from '../constants';
import { isNull } from '../helpers/common';
import { format } from '../helpers/format';
import useLoadingIndicator from '../hooks/use-loading-indicator';
import { useWindowWidth } from '../hooks/use-window-width';
import { calculateColumnWidth } from "../utils/component-utils";

const getConcatValue = (row, key, concatColumns, columns) => {
    const conCols = concatColumns?.[key]?.cols || [];
    const conSep = concatColumns?.[key]?.sep || '';
    return conCols
        .map(conName => {
            const colDef = columns.find(c => c?.name?.toUpperCase() === conName?.toUpperCase());
            return colDef ? row[colDef.name] : '';
        })
        .filter(Boolean)
        .join(conSep);
};

const getFormattedValue = (value, formatting) => {
    if (!isNull(value) && formatting?.type) {
        return format(value, formatting.type, formatting.format);
    }
    return value;
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
    onRowClick,
    onRowHover,
    onRowOut,
    editButtonEnabled = false,
    deleteButtonEnabled = false,
    editButtonEvent,
    deleteButtonEvent
}) => {
    const loading = useLoadingIndicator();
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 700;
    const buttonColEnabled = editButtonEnabled || deleteButtonEnabled;
    const buttonColWidth = calculateColumnWidth(columnWidths, hiddenColIndex, Button_Column_Key, buttonColEnabled, isMobile);

    if (!Array.isArray(rowsData) || rowsData.length === 0 || buttonColWidth === '100%') {
        const message = loading ? <div className="loader" /> :
            (!rowsData.length ? No_Data_Message : No_Column_Visible_Message);

        return (
            <tr key="No-Data" className="align-page-center alignCenter" style={{ backgroundColor: 'transparent' }}>
                <th className="alignCenter" style={{ border: 0, bottom: 0, margin: 0, padding: 0, position: 'absolute', backgroundColor: 'transparent', top: 0 }}>
                    {message}
                </th>
            </tr>
        );
    }

    return rowsData.slice(first, first + count).map((row, rowIndex) => {
        const cols = Object.values(row).map((col, key) => {
            if (hiddenColIndex?.includes(key)) return null;

            const conValue = getConcatValue(row, key, concatColumns, columns);
            const columnValue = getFormattedValue(conValue || col, columnFormatting[key]);
            const classNames = cssClassColumns?.[key] || '';
            const colWidth = calculateColumnWidth(columnWidths, hiddenColIndex, key, buttonColEnabled, isMobile);

            return (
                <td key={key} className={classNames} style={{ width: colWidth, maxWidth: colWidth }}>
                    <div className={`${classNames} m-0 p-0`} title={columnValue}>{columnValue}</div>
                </td>
            );
        });

        if (buttonColEnabled) {
            cols.push(
                <td key="gridButtons" onClick={e => e.stopPropagation()} style={{ width: buttonColWidth, maxWidth: buttonColWidth }}>
                    <div className="m-0 p-0 button-column alignCenter" style={{ width: buttonColWidth }}>
                        {editButtonEnabled && (
                            <div
                                className="p-0 m-0 icon-div alignCenter grid-icon-div"
                                title="Edit"
                                onClick={e => editButtonEvent(e, row)}
                                data-toggle="tooltip"
                            >
                                <span className="icon-common-css edit-icon-pen" />
                            </div>
                        )}
                        {deleteButtonEnabled && (
                            <div
                                className="p-0 m-0 icon-div alignCenter grid-icon-div"
                                title="Delete"
                                onClick={e => deleteButtonEvent(e, row)}
                                data-toggle="tooltip"
                            >
                                <span className="icon-common-css delete-icon" />
                            </div>
                        )}
                    </div>
                </td>
            );
        }
        return (
            <tr
                key={rowIndex}
                className={`${rowCssClass} gridRows`}
                style={rowClickEnabled ? { cursor: 'pointer' } : {}}
                onClick={e => onRowClick(e, row)}
                onMouseOver={e => onRowHover(e, row)}
                onMouseOut={e => onRowOut(e, row)}
            >
                {cols}
            </tr>
        );
    });
};

export default GridRows;