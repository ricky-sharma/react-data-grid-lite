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
import { formatRowData } from '../utils/component-utils';
import { hideLoader, showLoader } from '../utils/loading-utils';

const GridRows = ({
    state,
    computedColumnWidthsRef
}) => {
    const loading = useLoadingIndicator();
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 701;
    const {
        rowsData,
        firstRow,
        currentPageRows,
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
    return rowsData.slice(firstRow, firstRow + currentPageRows).map((baseRow, rowIndex) => {
        const formattedRow = formatRowData(baseRow, columns);
        const cols = Object.values(columns).map((col, key) => {
            if (col?.hidden === true) return null;
            const columnValue = formattedRow[col?.name?.toLowerCase()];
            const classNames = col?.class || '';
            const colWidth = computedColumnWidthsRef?.current?.find(i => i?.name === col?.name)?.width ?? 0;
            const colResizable = typeof col?.resizable === "boolean"
                ? col?.resizable : enableColumnResize;
            return (
                <td key={key} className={classNames} style={{
                    width: colWidth,
                    maxWidth: colResizable ? undefined : colWidth,
                    minWidth: colResizable ? undefined : colWidth,
                    left: (col?.fixed === true && !isMobile ?
                        computedColumnWidthsRef?.current?.find(i =>
                            i?.name === col?.name)?.leftPosition ?? '' : ''),
                    position: (col?.fixed === true && !isMobile ? 'sticky' : ''),
                    zIndex: (col?.fixed === true && !isMobile ? 6 : ''),
                    backgroundColor: 'inherit',
                    boxShadow: (lastFixedIndex === key && !isMobile ? '#e0e0e0 -0.5px 0px 1px 0px inset' : ''),
                    contain: 'layout paint'
                }}>
                    {!isNull(col?.render) && typeof col?.render === 'function' ?
                        col.render(formattedRow, baseRow) :
                        <div className="m-0 p-0 rowText" title={columnValue?.toString()}>
                            {columnValue?.toString()}
                        </div>}
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
                        left: (isActionColumnLeft && !isMobile ? 0 : ''),
                        right: (isActionColumnRight && !isMobile ? "-0.1px" : ''),
                        position: ((isActionColumnRight || isActionColumnLeft) && !isMobile ? 'sticky' : ''),
                        zIndex: ((isActionColumnRight || isActionColumnLeft) && !isMobile ? 6 : ''),
                        backgroundColor: (isActionColumnRight || isActionColumnLeft ? 'inherit' : ''),
                        boxShadow: (isActionColumnLeft && !isMobile ?
                            '#e0e0e0 -0.5px 0px 0px 0px inset' :
                            (isActionColumnRight && !isMobile ? '#e0e0e0 0.5px 0px 0px 0px inset' : '')),
                        contain: 'layout paint'
                    }}>
                    <div className="m-0 p-0 button-column alignCenter" style={{ width: buttonColWidth }}>
                        {editButtonEnabled && (
                            <div
                                className="p-0 m-0 icon-div alignCenter grid-icon-div"
                                title="Edit"
                                onClick={e => editButtonEvent(e, baseRow)}
                                data-toggle="tooltip"
                            >
                                <EditIcon />
                            </div>
                        )}
                        {deleteButtonEnabled && (
                            <div
                                className="p-0 m-0 icon-div alignCenter grid-icon-div"
                                title="Delete"
                                onClick={e => deleteButtonEvent(e, baseRow)}
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
                onClick={e => onRowClick(e, baseRow)}
                onMouseOver={e => onRowHover(e, baseRow)}
                onMouseOut={e => onRowOut(e, baseRow)}
            >
                {cols}
            </tr>
        );
    });
};

export default GridRows;