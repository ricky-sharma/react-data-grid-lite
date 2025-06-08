/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { isNull } from '../src/helpers/common';
import { eventGridHeaderClicked } from './components/events/event-grid-header-clicked';
import { eventGridSearchClicked } from './components/events/event-grid-search-clicked';
import GridFooter from './components/grid-footer';
import GridGlobalSearchBar from './components/grid-global-search-bar';
import GridTable from './components/grid-table';
import { Default_Grid_Width_VW } from './constants';

const DataGrid = ({
    id,
    columns = [],
    data = [],
    pageSize,
    options = {},
    width,
    height,
    maxWidth,
    maxHeight,
    onRowClick,
    onRowHover,
    onRowOut,
    onSortComplete,
    onSearchComplete,
    onPageChange,
}) => {
    const [state, setState] = useState({
        width: width ?? Default_Grid_Width_VW,
        maxWidth: maxWidth ?? '100vw',
        height: height ?? '60vh',
        maxHeight: maxHeight ?? '100vh',
        gridID: id ?? `id-${Math.floor(Math.random() * 100000000)}`,
        enablePaging: !isNull(pageSize),
        noOfPages: 0,
        pagerSelectOptions: [],
        firstRow: 0,
        lastPageRows: 10,
        activePage: 1,
        gridCssClass: options?.gridClass ?? '',
        headerCssClass: options?.headerClass ?? '',
        rowCssClass: options?.rowClass ?? '',
        enableColumnSearch: options?.enableColumnSearch ?? true,
        enableColumnResize: options?.enableColumnResize ?? false,
        enableGlobalSearch: options?.enableGlobalSearch ?? true,
        rowClickEnabled: !isNull(onRowClick),
        onRowClick: onRowClick ?? (() => { }),
        onRowHover: onRowHover ?? (() => { }),
        onRowOut: onRowOut ?? (() => { }),
        onSortComplete: onSortComplete ?? (() => { }),
        onSearchComplete: onSearchComplete ?? (() => { }),
        onPageChange: onPageChange ?? (() => { }),
        editButtonEnabled: options?.editButton ?? false,
        editButtonEvent: options?.editButton?.event ?? (() => { }),
        deleteButtonEnabled: options?.deleteButton ?? false,
        deleteButtonEvent: options?.deleteButton?.event ?? (() => { }),
        enableDownload: options?.enableDownload ?? true,
        downloadFilename: options?.downloadFilename ?? null,
        onDownloadComplete: options?.onDownloadComplete ?? (() => { }),
        globalSearchInput: '',
        sortType: '',
        toggleState: true
    });

    const dataReceivedRef = useRef(data);
    const searchColsRef = useRef([]);
    const gridHeaderRef = useRef(null);
    const prevPageRef = useRef(null);
    const sortRef = useRef(null);
    const searchRef = useRef(null);
    const computedColumnWidthsRef = useRef(null);

    useEffect(() => {
        computedColumnWidthsRef.current = [];
        if (!isNull(columns))
            setState((prevState) => ({
                ...prevState,
                columnsReceived: !isNull(columns) ? columns : [],
                columns: !isNull(columns) && Array.isArray(columns) &&
                    columns.every(obj => typeof obj === 'object')
                    ? columns.filter(obj => typeof obj === 'object' && obj !== null
                        && typeof obj.name === 'string' && obj.name.trim() !== '').sort((a, b) => {
                            const aFlag = !!a.fixed;
                            const bFlag = !!b.fixed;
                            return (bFlag - aFlag);
                        }) : []

            }));
    }, [columns]);

    useEffect(() => {
        dataReceivedRef.current = data ?? [];
        if (!isNull(data))
            setState((prevState) => ({
                ...prevState,
                rowsData: !isNull(data) ? data : [],
                totalRows: data?.length ?? 0,
                pageRows: !isNull(parseInt(pageSize, 10)) ? parseInt(pageSize, 10) : data?.length ?? 0,
                currentPageRows: !isNull(parseInt(pageSize, 10)) ? parseInt(pageSize, 10) : data?.length ?? 0
            }));
    }, [data]);

    useEffect(() => {
        if (!isNull(state?.columns))
            setState((prevState) => ({
                ...prevState,
                hiddenColIndex: !isNull(state?.columns) ? state?.columns.map((col, key) =>
                    !isNull(col?.hidden) && col?.hidden === true ? key : null) : [],
                concatColumns: !isNull(state?.columns) ? state?.columns.map((col) => {
                    let separator = ' '
                    if (!isNull(col.concatColumns) && !isNull(col.concatColumns.columns)) {
                        if (!isNull(col.concatColumns.separator))
                            separator = col.concatColumns.separator
                        return { cols: col.concatColumns.columns, sep: separator };
                    }
                    return null
                }) : [],
                columnFormatting: !isNull(state?.columns) ? state?.columns.map((col) =>
                    !isNull(col.formatting) && !isNull(col.formatting.type) ?
                        { type: col?.formatting?.type, format: col?.formatting?.format ?? '' } : null) : [],
                columnClass: !isNull(state?.columns) ? state?.columns.map((col) =>
                    !isNull(col.class) ? col?.class : null) : [],
                columnWidths: !isNull(state?.columns)
                    ? state?.columns.map(col =>
                        typeof col?.width === 'string' && (col.width.endsWith('px') || col.width.endsWith('%'))
                            ? col.width
                            : null
                    )
                    : []
            }));
    }, [state?.columns]);

    useEffect(() => {
        setPagingVariables();
    }, [state?.rowsData, state?.pageRows]);

    const setPagingVariables = () => {
        let noOfPages = Math.floor(state.totalRows / state.pageRows);
        let lastPageRows = state.totalRows % state.pageRows;
        if (lastPageRows > 0) noOfPages++;
        else if (lastPageRows === 0) lastPageRows = state.pageRows;
        setState((prevState) => ({
            ...prevState,
            noOfPages,
            lastPageRows,
            pagerSelectOptions: noOfPages > 0 ? [...Array(noOfPages).keys()].map((i) => i + 1) : []
        }));
    };

    const handleForwardPage = (e) => {
        e.preventDefault();
        prevPageRef.current = { changeEvent: e, pageNo: state.activePage };
        if (state.activePage !== state.noOfPages) {
            setState((prevState) => ({
                ...prevState,
                activePage: prevState.activePage + 1
            }));
        }
    };

    const handleBackwardPage = (e) => {
        e.preventDefault();
        prevPageRef.current = { changeEvent: e, pageNo: state.activePage };
        if (state.activePage !== 1) {
            setState((prevState) => ({
                ...prevState,
                activePage: prevState.activePage - 1
            }));
        }
    };

    useEffect(() => {
        if (prevPageRef?.current?.changeEvent)
            handleChangePage(
                prevPageRef.current.changeEvent,
                state?.activePage,
                prevPageRef?.current?.pageNo ?? -1
            );
    }, [state?.activePage]);

    const handleChangePage = (e, newPage, previousPage = -1) => {
        e.preventDefault();
        prevPageRef.current = {
            changeEvent: e,
            pageNo: previousPage === -1 ? state.activePage : previousPage
        };
        setState(prev => (
            {
                ...prev,
                firstRow: state.pageRows * (newPage - 1),
                currentPageRows: (newPage === state.noOfPages) ? state.lastPageRows : state.pageRows,
                activePage: newPage,
            })
        );
    };

    useEffect(() => {
        if (prevPageRef?.current?.changeEvent) {
            state.onPageChange(
                prevPageRef.current.changeEvent,
                state.activePage,
                prevPageRef?.current?.pageNo ?? 0,
                state.currentPageRows,
                parseInt(state.firstRow + 1, 10) ?? 0
            );
            prevPageRef.current = null;
        }
    }, [state?.firstRow, state?.currentPageRows]);

    const onHeaderClicked = (e, name) => {
        sortRef.current = { changeEvent: e, colName: name }
        eventGridHeaderClicked(e, name, state, setState);
    };

    useEffect(() => {
        if (sortRef?.current?.changeEvent && typeof state.onSortComplete === 'function') {
            state.onSortComplete(
                sortRef.current.changeEvent,
                sortRef.current.colName,
                state.rowsData,
                state.sortType
            );
            sortRef.current = null;
        }
        if (searchRef?.current?.changeEvent && typeof state?.onSearchComplete === 'function') {
            state.onSearchComplete(
                searchRef.current.changeEvent,
                searchRef.current.searchQuery,
                searchColsRef?.current ?? [],
                state?.rowsData ?? [],
                state?.rowsData?.length || 0
            );
            searchRef.current = null;
        }
    }, [state.toggleState])

    const onSearchClicked = (e, colName, colObject, formatting) => {
        if (e?.target?.value) e.target.value = e?.target?.value.trimStart();
        searchRef.current = {
            changeEvent: e,
            searchQuery: e?.target?.value ?? ''
        };
        const isGlobalSearch =
            e?.target?.getAttribute('data-type') === `globalSearch${state.gridID}`;
        if (isGlobalSearch) {
            setState(prev => ({
                ...prev,
                globalSearchInput: e?.target?.value ?? ''
            }));
        }
        eventGridSearchClicked(e, colName, colObject, formatting, dataReceivedRef, searchColsRef, state, setState);
    };

    const handleResetSearch = (e) => {
        e.preventDefault();
        searchColsRef.current = [];
        const gridHeader = gridHeaderRef.current;
        if (gridHeader) {
            const inputs = gridHeader.querySelectorAll('input');
            if (inputs) {
                inputs.forEach(input => {
                    input.value = '';
                });
            }
        }
        setState(prev => ({
            ...prev,
            globalSearchInput: '',
            rowsData: dataReceivedRef?.current ?? [],
            activePage: 1,
            totalRows: dataReceivedRef?.current?.length ?? 0,
            firstRow: 0,
            currentPageRows: prev.currentPageRows
        }));
    };

    return (
        <div
            id={state.gridID}
            className={
                !isNull(state.gridCssClass)
                    ? `${state.gridCssClass} r-d-g-lt-component`
                    : 'r-d-g-lt-component'
            }
            style={{ maxWidth: state.maxWidth, width: state.width }}
        >
            <GridGlobalSearchBar
                enableGlobalSearch={state.enableGlobalSearch}
                globalSearchInput={state.globalSearchInput}
                gridID={state.gridID}
                columns={state.columns}
                onSearchClicked={onSearchClicked}
                handleResetSearch={handleResetSearch}
                enableDownload={state.enableDownload}
                rowsData={state.rowsData}
                downloadFilename={state.downloadFilename}
                onDownloadComplete={state.onDownloadComplete}
            />
            <div
                className={
                    !isNull(state.gridCssClass)
                        ? `${state.gridCssClass} col-12 m-0 p-0 react-data-grid-lite`
                        : 'col-12 m-0 p-0 react-data-grid-lite'
                }
            >
                <GridTable
                    state={state}
                    setState={setState}
                    onHeaderClicked={onHeaderClicked}
                    onSearchClicked={onSearchClicked}
                    gridHeaderRef={gridHeaderRef}
                    computedColumnWidthsRef={computedColumnWidthsRef}
                />
            </div>
            <GridFooter
                totalRows={state.totalRows}
                currentPageRows={state.currentPageRows}
                activePage={state.activePage}
                pageRows={state.pageRows}
                pagerSelectOptions={state.pagerSelectOptions}
                enablePaging={state.enablePaging}
                noOfPages={state.noOfPages}
                onPageChange={handleChangePage}
                onPrev={handleBackwardPage}
                onNext={handleForwardPage}
            />
        </div>
    );
}

export default DataGrid;