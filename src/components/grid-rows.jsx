/* eslint-disable react/prop-types */
import React from 'react';
import {
    Button_Column_Key,
    No_Column_Visible_Message,
    No_Data_Message
} from '../constants';
import { hideLoader, isNull, showLoader } from '../helpers/common';
import { format } from '../helpers/format';
import useLoadingIndicator from '../hooks/use-loading-indicator';
import { useWindowWidth } from '../hooks/use-window-width';

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
    columnClass = [],
    columns = [],
    rowCssClass = '',
    rowClickEnabled = false,
    onRowClick,
    onRowHover,
    onRowOut,
    editButtonEnabled = false,
    deleteButtonEnabled = false,
    editButtonEvent,
    deleteButtonEvent,
    computedColumnWidthsRef,
    enableColumnResize,
    gridID
}) => {
    const loading = useLoadingIndicator();
    useWindowWidth();
    if (!Array.isArray(rowsData) || rowsData.length === 0 || isNull(computedColumnWidthsRef?.current)) {
        hideLoader(gridID);
        loading ? showLoader(gridID) :
            (!rowsData.length ? showLoader(gridID, No_Data_Message)
                : showLoader(gridID, No_Column_Visible_Message));
        return null;
    }
    hideLoader(gridID);
    const buttonColEnabled = editButtonEnabled || deleteButtonEnabled;
    const buttonColWidth = computedColumnWidthsRef?.current?.find(i =>
        i?.name === Button_Column_Key)?.width ?? 0;
    let lastFixedIndex = -1;
    columns.reduceRight((_, col, index) => {
        if (lastFixedIndex === -1 && col?.fixed === true && !col?.hidden) {
            lastFixedIndex = index;
        }
    }, null);
    return rowsData.slice(first, first + count).map((row, rowIndex) => {
        const cols = Object.values(columns).map((col, key) => {
            if (hiddenColIndex?.includes(key)) return null;
            const conValue = getConcatValue(row, key, concatColumns, columns);
            const columnValue = getFormattedValue(conValue || row[col?.name], columnFormatting[key]);
            const classNames = columnClass?.[key] || '';
            const colWidth = computedColumnWidthsRef?.current?.find(i => i?.name === col?.name)?.width ?? 0;
            const colResizable = col?.resizable ?? enableColumnResize;
            return (
                <td key={key} className={classNames} style={{
                    width: colWidth,
                    maxWidth: colResizable ? undefined : colWidth,
                    minWidth: colResizable ? undefined : colWidth,
                    left: (col?.fixed === true ?
                        computedColumnWidthsRef?.current?.find(i => i?.name === col?.name)?.leftPosition ?? '' : ''),
                    position: (col?.fixed === true ? 'sticky' : ''),
                    zIndex: (col?.fixed === true ? 6 : ''),
                    backgroundColor: 'inherit',
                    boxShadow: (lastFixedIndex === key ? '#e0e0e0 -2px 0px 1px 0px inset' : '')
                }}>
                    <div className="m-0 p-0 rowText" title={columnValue}>{columnValue}</div>
                </td>
            );
        });
        if (buttonColEnabled) {
            cols.push(
                <td key="gridButtons" className="alignCenter" onClick={e => e.stopPropagation()}
                    style={{ width: buttonColWidth, maxWidth: buttonColWidth }}>
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
                className={`${rowCssClass} gridRow`}
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