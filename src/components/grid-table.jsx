/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { useResizableTableColumns } from '../hooks/use-resizable-table-columns';
import GridHeader from './grid-header';
import GridRows from './grid-rows';

const GridTable = ({
    state,
    setState,
    onHeaderClicked,
    onSearchClicked,
    gridHeaderRef,
    computedColumnWidthsRef
}) => {
    const tableRef = useRef(null);
    useResizableTableColumns(tableRef, state, setState,
        computedColumnWidthsRef, state.enableColumnResize);
    return (
        <table ref={tableRef} className="m-0 p-0">
            <GridHeader
                columns={state.columns}
                hiddenColIndex={state.hiddenColIndex}
                enableColumnSearch={state.enableColumnSearch}
                concatColumns={state.concatColumns}
                editButtonEnabled={state.editButtonEnabled}
                deleteButtonEnabled={state.deleteButtonEnabled}
                headerCssClass={state.headerCssClass}
                gridID={state.gridID}
                columnWidths={state.columnWidths}
                onHeaderClicked={onHeaderClicked}
                onSearchClicked={onSearchClicked}
                gridHeaderRef={gridHeaderRef}
                computedColumnWidthsRef={computedColumnWidthsRef}
                enableColumnResize={state.enableColumnResize}
                rowsData={state.rowsData}
            />

            <tbody style={{ height: state.height, maxHeight: state.maxHeight }}>
                <GridRows
                    gridID={state.gridID}
                    rowsData={state.rowsData}
                    first={state.firstRow}
                    count={state.currentPageRows}
                    hiddenColIndex={state.hiddenColIndex}
                    concatColumns={state.concatColumns}
                    columnFormatting={state.columnFormatting}
                    columnClass={state.columnClass}
                    columns={state.columns}
                    rowCssClass={state.rowCssClass}
                    rowClickEnabled={state.rowClickEnabled}
                    onRowClick={state.onRowClick}
                    onRowHover={state.onRowHover}
                    onRowOut={state.onRowOut}
                    editButtonEnabled={state.editButtonEnabled}
                    deleteButtonEnabled={state.deleteButtonEnabled}
                    editButtonEvent={state.editButtonEvent}
                    deleteButtonEvent={state.deleteButtonEvent}
                    computedColumnWidthsRef={computedColumnWidthsRef}
                    enableColumnResize={state.enableColumnResize}
                />
            </tbody>
        </table>
    );
};

export default GridTable;
