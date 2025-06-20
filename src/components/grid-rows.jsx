/* eslint-disable react/prop-types */
import React from 'react';
import {
    Button_Column_Key,
    No_Column_Visible_Message,
    No_Data_Message
} from '../constants';
import { isNull } from '../helpers/common';
import useLoadingIndicator from '../hooks/use-loading-indicator';
import { useWindowWidth } from '../hooks/use-window-width';
import DeleteIcon from '../icons/delete-icon';
import EditIcon from '../icons/edit-icon';
import { getConcatValue, getFormattedValue } from '../utils/component-utils';
import { hideLoader, showLoader } from '../utils/loading-utils';

const GridRows = ({
    state,
    computedColumnWidthsRef
}) => {
    const loading = useLoadingIndicator();
    useWindowWidth();
    const {
        rowsData,
        firstRow,
        currentPageRows,
        hiddenColIndex,
        concatColumns,
        columnFormatting,
        columnClass,
        columns,
        rowCssClass,
        rowClickEnabled,
        onRowClick,
        onRowHover,
        onRowOut,
        editButtonEnabled,
        deleteButtonEnabled,
        editButtonEvent,
        deleteButtonEvent,
        enableColumnResize,
        gridID,
        actionColumnAlign
    } = state || {};
    if (isNull(rowsData) || isNull(computedColumnWidthsRef?.current)) {
        hideLoader(gridID);
        loading ? showLoader(gridID) :
            (isNull(rowsData) ? showLoader(gridID, No_Data_Message)
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

    return rowsData.slice(firstRow, firstRow + currentPageRows).map((row, rowIndex) => {
        const cols = Object.values(columns).map((col, key) => {
            if (hiddenColIndex?.includes(key)) return null;
            const conValue = getConcatValue(row, key, concatColumns, columns);
            const columnValue = getFormattedValue(conValue || row[col?.name], columnFormatting?.[key]);
            const classNames = columnClass?.[key] || '';
            const colWidth = computedColumnWidthsRef?.current?.find(i => i?.name === col?.name)?.width ?? 0;
            const colResizable = col?.resizable ?? enableColumnResize;
            return (
                <td key={key} className={classNames} style={{
                    width: colWidth,
                    maxWidth: colResizable ? undefined : colWidth,
                    minWidth: colResizable ? undefined : colWidth,
                    left: (col?.fixed === true ?
                        computedColumnWidthsRef?.current?.find(i =>
                            i?.name === col?.name)?.leftPosition ?? '' : ''),
                    position: (col?.fixed === true ? 'sticky' : ''),
                    zIndex: (col?.fixed === true ? 6 : ''),
                    backgroundColor: 'inherit',
                    boxShadow: (lastFixedIndex === key ? '#e0e0e0 -0.5px 0px 1px 0px inset' : ''),
                    contain: 'layout paint'
                }}>
                    <div className="m-0 p-0 rowText" title={columnValue}>
                        {columnValue}
                    </div>
                </td>
            );
        });
        const isActionColumnLeft = actionColumnAlign === 'left';
        const isActionColumnRight = actionColumnAlign === 'right';
        const insert = isActionColumnLeft ? 'unshift' : 'push';
        if (buttonColEnabled) {
            cols[insert](
                <td key="gridButtons" className="alignCenter" onClick={e => e.stopPropagation()}
                    style={{
                        width: buttonColWidth,
                        maxWidth: buttonColWidth,
                        minWidth: buttonColWidth,
                        left: (isActionColumnLeft ? 0 : ''),
                        right: (isActionColumnRight ? 0 : ''),
                        position: (isActionColumnRight || isActionColumnLeft ? 'sticky' : ''),
                        zIndex: (isActionColumnRight || isActionColumnLeft ? 6 : ''),
                        backgroundColor: (isActionColumnRight || isActionColumnLeft ? 'inherit' : ''),
                        boxShadow: (isActionColumnLeft ?
                            '#e0e0e0 -0.5px 0px 0px 0px inset' :
                            (isActionColumnRight ? '#e0e0e0 0.5px 0px 0px 0px inset' : '')),
                        contain: 'layout paint'
                    }}>
                    <div className="m-0 p-0 button-column alignCenter" style={{ width: buttonColWidth }}>
                        {editButtonEnabled && (
                            <div
                                className="p-0 m-0 icon-div alignCenter grid-icon-div"
                                title="Edit"
                                onClick={e => editButtonEvent(e, row)}
                                data-toggle="tooltip"
                            >
                                <EditIcon />
                            </div>
                        )}
                        {deleteButtonEnabled && (
                            <div
                                className="p-0 m-0 icon-div alignCenter grid-icon-div"
                                title="Delete"
                                onClick={e => deleteButtonEvent(e, row)}
                                data-toggle="tooltip"
                            >
                                <DeleteIcon />
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