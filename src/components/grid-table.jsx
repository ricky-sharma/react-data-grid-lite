import React, { useRef } from 'react';
import { useResizableTableColumns } from '../hooks/use-resizable-table-columns';
import GridHeader from './grid-header';
import GridRows from './grid-rows';

const GridTable = ({
    state,
    setState,
    onHeaderClicked,
    searchHandler,
    gridHeaderRef,
    computedColumnWidthsRef,
    isResizingRef,
    dataReceivedRef
}) => {
    const tableRef = useRef(null);
    useResizableTableColumns(tableRef, state, setState,
        computedColumnWidthsRef, state.enableColumnResize, isResizingRef);
    return (
        <table ref={tableRef} className="mg--0 pd--0 gd-tbl">
            <GridHeader
                state={state}
                setState={setState}
                onHeaderClicked={onHeaderClicked}
                searchHandler={searchHandler}
                gridHeaderRef={gridHeaderRef}
                computedColumnWidthsRef={computedColumnWidthsRef}
            />

            <tbody style={{ height: state.height, maxHeight: state.maxHeight }}>
                <GridRows
                    state={state}
                    setState={setState}
                    computedColumnWidthsRef={computedColumnWidthsRef}
                    dataReceivedRef={dataReceivedRef}
                />
            </tbody>
        </table>
    );
};

export default GridTable;
