/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { isNull } from '../src/helpers/common';
import { eventGridHeaderClicked } from './components/events/event-grid-header-clicked';
import { eventGridSearchClicked } from './components/events/event-grid-search-clicked';
import GridFooter from './components/grid-footer';
import GridGlobalSearchBar from './components/grid-global-search-bar';
import GridTable from './components/grid-table';
import { Default_Grid_Width_VW } from './constants';
import { applyTheme } from './utils/themes-utils';

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
    onColumnResized,
    theme,
    currentPage,
    onColumnDragEnd,
    onCellUpdate
}) => {
    const [state, setState] = useState({
        width: width ?? Default_Grid_Width_VW,
        maxWidth: maxWidth ?? '100vw',
        height: height ?? '60vh',
        maxHeight: maxHeight ?? '100vh',
        gridID: id ?? `id-${Math.floor(Math.random() * 100000000)}`,
        enablePaging: !isNull(parseInt(pageSize, 10)),
        noOfPages: 0,
        pagerSelectOptions: [],
        firstRow: 0,
        lastPageRows: 10,
        activePage: parseInt(currentPage, 10) ? parseInt(currentPage, 10) : 1,
        theme: theme,
        gridCssClass: options?.gridClass ?? applyTheme(theme ?? '')?.grid ?? '',
        headerCssClass: options?.headerClass ?? applyTheme(theme ?? '')?.header ?? '',
        rowCssClass: options?.rowClass ?? applyTheme(theme ?? '')?.row ?? '',
        enableColumnSearch: typeof options?.enableColumnSearch === 'boolean'
            ? options?.enableColumnSearch : true,
        enableColumnResize: typeof options?.enableColumnResize === 'boolean' ?
            options?.enableColumnResize : false,
        enableColumnDrag: typeof options?.enableColumnDrag === 'boolean' ?
            options?.enableColumnDrag : false,
        enableGlobalSearch: typeof options?.enableGlobalSearch === 'boolean' ?
            options?.enableGlobalSearch : true,
        enableCellEdit: typeof options?.enableCellEdit === 'boolean' ?
            options?.enableCellEdit : false,
        showToolbar: typeof options?.showToolbar === 'boolean' ?
            options?.showToolbar : true,
        showResetButton: typeof options?.showResetButton === 'boolean' ?
            options?.showResetButton : true,
        showFooter: typeof options?.showFooter === 'boolean' ?
            options?.showFooter : true,
        rowHeight: parseInt(options?.rowHeight, 10) ? options?.rowHeight : undefined,
        rowClickEnabled: !isNull(onRowClick),
        onRowClick: onRowClick ?? (() => { }),
        onRowHover: onRowHover ?? (() => { }),
        onRowOut: onRowOut ?? (() => { }),
        onCellUpdate: onCellUpdate ?? (() => { }),
        onSortComplete: onSortComplete ?? (() => { }),
        onSearchComplete: onSearchComplete ?? (() => { }),
        onPageChange: onPageChange ?? (() => { }),
        onColumnResized: onColumnResized ?? (() => { }),
        onColumnDragEnd: onColumnDragEnd ?? (() => { }),
        editButtonEnabled: options?.editButton ?? false,
        editButtonEvent: options?.editButton?.event ?? (() => { }),
        deleteButtonEnabled: options?.deleteButton ?? false,
        deleteButtonEvent: options?.deleteButton?.event ?? (() => { }),
        actionColumnAlign: options?.actionColumnAlign ?? '',
        enableDownload: typeof options?.enableDownload === 'boolean' ?
            options?.enableDownload : true,
        downloadFilename: options?.downloadFilename ?? null,
        onDownloadComplete: options?.onDownloadComplete ?? (() => { }),
        globalSearchPlaceholder: options?.globalSearchPlaceholder,
        globalSearchInput: '',
        toggleState: true,
        searchValues: {},
        editingCell: null
    });
    const dataReceivedRef = useRef(data);
    const searchColsRef = useRef([]);
    const gridHeaderRef = useRef(null);
    const prevPageRef = useRef(null);
    const sortRef = useRef(null);
    const searchRef = useRef(null);
    const computedColumnWidthsRef = useRef(null);
    const isResizingRef = useRef(false);

    useEffect(() => {
        computedColumnWidthsRef.current = [];
        if (!isNull(columns))
            setState((prevState) => ({
                ...prevState,
                columnsReceived: columns,
                columns: Array.isArray(columns) && columns.every(obj => typeof obj === 'object')
                    ? (() => {
                        const validColumns = columns.filter(
                            obj => obj && typeof obj.name === 'string' && obj.name.trim() !== ''
                        ).map(col => ({
                            ...col,
                            fixed: typeof col?.fixed === 'boolean' ? col?.fixed : false,
                            hidden: typeof col?.hidden === 'boolean' ? col?.hidden : false
                        }));
                        const fixedCols = validColumns.filter(col => col.fixed === true);
                        const nonFixedCols = validColumns.filter(col => col.fixed === false);
                        const applyGlobalOrder = (group, globalStartIndex = 0) => {
                            const result = [];
                            const used = new Set();
                            const withOrder = group.filter(c => typeof c.order === 'number');
                            const withoutOrder = group.filter(c => typeof c.order !== 'number');
                            for (const col of withOrder) {
                                const globalIdx = col.order - 1;
                                const localIdx = Math.max(0, globalIdx - globalStartIndex);
                                let i = localIdx;
                                while (i < group.length && result[i]) i++;
                                result[i] = col;
                                used.add(col.name);
                            }
                            let i = 0;
                            for (const col of withoutOrder) {
                                while (result[i]) i++;
                                result[i] = col;
                            }
                            return result;
                        };

                        const orderedFixed = applyGlobalOrder(fixedCols, 0);
                        const orderedNonFixed = applyGlobalOrder(nonFixedCols, orderedFixed.length);
                        const finalList = [...orderedFixed, ...orderedNonFixed];

                        return finalList.map((col, index) => ({
                            ...col,
                            displayIndex: index + 1
                        }));
                    })()
                    : []
            }));
    }, [columns]);

    useEffect(() => {
        dataReceivedRef.current = data ?? [];
        if (!isNull(data))
            setState((prevState) => ({
                ...prevState,
                rowsData: !isNull(data) ? data : [],
                totalRows: data?.length,
                pageRows: !isNull(parseInt(pageSize, 10)) ? parseInt(pageSize, 10) : data?.length,
                currentPageRows: !isNull(parseInt(pageSize, 10)) ? parseInt(pageSize, 10) : data?.length
            }));
    }, [data]);

    useEffect(() => {
        if (!isNull(state?.columns))
            setState((prevState) => ({
                ...prevState,
                hiddenColIndex: !isNull(state?.columns) ? state?.columns.map((col, key) =>
                    !isNull(col?.hidden) && col?.hidden === true ? key : null) : [],
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
        let activePage = !isNull(noOfPages) && state.activePage > noOfPages ? 1 : state.activePage;
        if (lastPageRows > 0) noOfPages++;
        else if (lastPageRows === 0) lastPageRows = state.pageRows;
        setState((prevState) => ({
            ...prevState,
            noOfPages,
            activePage,
            lastPageRows,
            firstRow: state.pageRows * (activePage - 1),
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
                editingCell: null,
                editingCellData: null
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

    const onHeaderClicked = (e, colObject, colKey) => {
        sortRef.current = { changeEvent: e, colObject: colObject, colKey: colKey }
        eventGridHeaderClicked(colObject, state, setState, colKey, isResizingRef);
    };

    useEffect(() => {
        if (typeof state.onSortComplete === 'function' && sortRef?.current?.changeEvent) {
            state.onSortComplete(
                sortRef.current.changeEvent,
                sortRef.current.colObject,
                state.rowsData,
                state.columns.find(col => col?.name
                    === sortRef.current.colKey)?.sortOrder ?? ''
            );
            sortRef.current = null;
        }
        if (typeof state?.onSearchComplete === 'function' && searchRef?.current?.changeEvent) {
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
        eventGridSearchClicked(e, colName, colObject, formatting,
            dataReceivedRef, searchColsRef, state, setState);
    };

    const handleResetSearch = (e) => {
        e.preventDefault();
        searchColsRef.current = [];
        setState(prev => ({
            ...prev,
            searchValues: Object.fromEntries(
                (Array.isArray(prev.columns) ? prev.columns : [])
                    .filter(col => col && col.name)
                    .map(col => [col.name, ''])
            ),
            globalSearchInput: '',
            rowsData: dataReceivedRef?.current ?? [],
            activePage: 1,
            totalRows: dataReceivedRef?.current?.length ?? 0,
            firstRow: 0,
            columns: prev.columns.map(col => ({
                ...col,
                sortOrder: '',
            })),
        }));
    };
    return (
        <div
            id={state.gridID}
            className={
                !isNull(state.gridCssClass)
                    ? `${state.gridCssClass} r-d-g-lt-comp`
                    : 'r-d-g-lt-comp'
            }
            style={{ maxWidth: state.maxWidth, width: state.width }}
        >
            {state?.showToolbar === true &&
                (<GridGlobalSearchBar
                    setState={setState}
                    enableGlobalSearch={state.enableGlobalSearch}
                    globalSearchInput={state.globalSearchInput}
                    columns={state.columns}
                    onSearchClicked={onSearchClicked}
                    handleResetSearch={handleResetSearch}
                    enableDownload={state.enableDownload}
                    rowsData={state.rowsData}
                    downloadFilename={state.downloadFilename}
                    onDownloadComplete={state.onDownloadComplete}
                    showResetButton={state.showResetButton}
                    globalSearchPlaceholder={state.globalSearchPlaceholder}
                />)}
            <div
                className={
                    !isNull(state.gridCssClass)
                        ? `${state.gridCssClass} col-flex-12 mg--0 pd--0 react-data-grid-lite`
                        : 'col-flex-12 mg--0 pd--0 react-data-grid-lite'
                }
            >
                <GridTable
                    state={state}
                    setState={setState}
                    onHeaderClicked={onHeaderClicked}
                    onSearchClicked={onSearchClicked}
                    gridHeaderRef={gridHeaderRef}
                    computedColumnWidthsRef={computedColumnWidthsRef}
                    isResizingRef={isResizingRef}
                />
            </div>
            {state.showFooter === true && (
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
                />)}
        </div>
    );
}

export default DataGrid;