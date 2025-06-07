/* eslint-disable react/prop-types */
import React from 'react';
import GridHeader from './grid-header';
import GridRows from './grid-rows';

const GridTable = ({
    state,
    onHeaderClicked,
    onSearchClicked,
    gridHeaderRef,
    computedColumnWidthsRef,
}) => {
    return (
        <table className="m-0 p-0">
            <GridHeader
                columns={state.columns}
                hiddenColIndex={state.hiddenColIndex}
                enableColumnSearch={state.enableColumnSearch}
                concatColumns={state.concatColumns}
                editButtonEnabled={state.editButtonEnabled}
                deleteButtonEnabled={state.deleteButtonEnabled}
                headerCssClass={state.headerCssClass}
                gridID={state.gridID}
                onHeaderClicked={onHeaderClicked}
                onSearchClicked={onSearchClicked}
                columnWidths={state.columnWidths}
                gridHeaderRef={gridHeaderRef}
                computedColumnWidthsRef={computedColumnWidthsRef}
            />

            <tbody style={{ height: state.height, maxHeight: state.maxHeight }}>
                <GridRows
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
                />
            </tbody>
        </table>
    );
};

export default GridTable;
