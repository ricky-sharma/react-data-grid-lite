import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { isNull } from '../src/helpers/common';
import { eventGridHeaderClicked } from './components/events/event-grid-header-clicked';
import GridFooter from './components/grid-footer';
import GridGlobalSearchBar from './components/grid-global-search-bar';
import GridTable from './components/grid-table';
import { Default_Grid_Width_VW } from './constants';
import { GridConfigContext } from './context/grid-config-context';
import ErrorBoundary from './error-boundary';
import { useAISearch } from './hooks/use-ai-search';
import useContainerWidth from './hooks/use-container-width';
import { useGridApi } from './hooks/use-grid-api';
import { useProcessedColumns } from './hooks/use-processed-columns';
import { useProcessedData } from './hooks/use-processed-data';
import { useResetGrid } from './hooks/use-reset-grid';
import { useSearchAndSortCallbacks } from './hooks/use-search-and-sort-callbacks';
import { useSearchHandler } from './hooks/use-search-handler';
import { applyTheme } from './utils/themes-utils';

const DataGrid = forwardRef(({
    id,
    columns = [],
    data = [],
    pageSize,
    currentPage,
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
    onColumnDragEnd,
    onCellUpdate,
    onRowSelect,
    onSelectAll,
    theme
}, ref) => {
    const fallbackfn = () => { };
    const [state, setState] = useState({
        width: width ?? Default_Grid_Width_VW,
        maxWidth: maxWidth ?? '100vw',
        height: height ?? '60vh',
        maxHeight: maxHeight ?? '100vh',
        gridID: id ? `id-${id}` : `id-${Math.floor(Math.random() * 100000000)}`,
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
        enableSorting: typeof options?.enableSorting === 'boolean' ?
            options?.enableSorting : true,
        enableRowSelection: typeof options?.enableRowSelection === 'boolean' ?
            options?.enableRowSelection : true,
        showToolbar: typeof options?.showToolbar === 'boolean' ?
            options?.showToolbar : true,
        showResetButton: typeof options?.showResetButton === 'boolean' ?
            options?.showResetButton : false,
        showResetMenuItem: typeof options?.showResetMenuItem === 'boolean' ?
            options?.showResetMenuItem : true,
        csvExportUI: options?.csvExportUI === 'button' ? 'button' : 'menu',
        isCSVExportUIButton: options?.csvExportUI === 'button',
        showFooter: typeof options?.showFooter === 'boolean' ?
            options?.showFooter : true,
        showNumberPagination: typeof options?.showNumberPagination === 'boolean' ?
            options?.showNumberPagination : true,
        showSelectPagination: typeof options?.showSelectPagination === 'boolean' ?
            options?.showSelectPagination : true,
        showPageSizeSelector: typeof options?.showPageSizeSelector === 'boolean' ?
            options?.showPageSizeSelector : true,
        showPageInfo: typeof options?.showPageInfo === 'boolean' ?
            options?.showPageInfo : true,
        rowHeight: parseInt(options?.rowHeight, 10) ? options?.rowHeight : undefined,
        rowClickEnabled: !isNull(onRowClick),
        onRowClick: onRowClick ?? fallbackfn,
        onRowHover: onRowHover ?? fallbackfn,
        onRowOut: onRowOut ?? fallbackfn,
        onRowSelect: onRowSelect ?? fallbackfn,
        onSelectAll: onSelectAll ?? fallbackfn,
        onCellUpdate: onCellUpdate ?? fallbackfn,
        onSortComplete: onSortComplete ?? fallbackfn,
        onSearchComplete: onSearchComplete ?? fallbackfn,
        onPageChange: onPageChange ?? fallbackfn,
        onColumnResized: onColumnResized ?? fallbackfn,
        onColumnDragEnd: onColumnDragEnd ?? fallbackfn,
        editButtonEnabled: typeof options?.editButton === 'object',
        editButtonEvent: options?.editButton?.event ?? fallbackfn,
        deleteButtonEnabled: typeof options?.deleteButton === 'object',
        deleteButtonEvent: options?.deleteButton?.event ?? fallbackfn,
        actionColumnAlign: options?.actionColumnAlign ?? 'right',
        rowSelectColumnAlign: options?.rowSelectColumnAlign ?? 'left',
        enableDownload: typeof options?.enableDownload === 'boolean' ?
            options?.enableDownload : true,
        downloadFilename: options?.downloadFilename ?? null,
        onDownloadComplete: options?.onDownloadComplete ?? fallbackfn,
        globalSearchPlaceholder: options?.globalSearchPlaceholder,
        gridBackgroundColor: options?.gridBgColor,
        gridHeaderBackgroundColor: options?.headerBgColor,
        aiSearchOptions: options?.aiSearch ?? {},
        debug: typeof options?.debug === 'boolean' ? options?.debug : false,
        globalSearchInput: '',
        toggleState: true,
        searchValues: {},
        editingCell: null,
        selectedRows: new Set()
    });
    const dataReceivedRef = useRef(null);
    const searchColsRef = useRef([]);
    const gridHeaderRef = useRef(null);
    const prevPageRef = useRef(null);
    const sortRef = useRef(null);
    const searchRef = useRef(null);
    const computedColumnWidthsRef = useRef(null);
    const isResizingRef = useRef(false);
    const containerWidth = useContainerWidth(state?.gridID);
    const searchTimeoutRef = useRef(null);
    const aiSearchFailedRef = useRef(false);
    const globalSearchQueryRef = useRef('');
    const { runAISearch } = useAISearch({
        apiKey: state?.aiSearchOptions?.apiKey,
        model: state?.aiSearchOptions?.model,
        endpoint: state?.aiSearchOptions?.endpoint,
        systemPrompt: state?.aiSearchOptions?.systemPrompt,
        customRunAISearch: state?.aiSearchOptions?.runAISearch,
        customHeaders: state?.aiSearchOptions?.headers
    });

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    useProcessedColumns(columns, setState, computedColumnWidthsRef);

    useProcessedData({
        data,
        pageSize,
        state,
        setState,
        dataReceivedRef,
        globalSearchQueryRef,
        aiSearchFailedRef,
        searchColsRef,
        sortRef,
        runAISearch
    });

    useEffect(() => {
        if (!isNull(state?.columns)) {
            setState((prevState) => ({
                ...prevState,
                hiddenColIndex: state?.columns.map((col, key) =>
                    !isNull(col?.hidden) && col?.hidden === true ? key : null),
                columnWidths: state?.columns.map(col =>
                    typeof col?.width === 'string' && (col.width.endsWith('px') || col.width.endsWith('%'))
                        ? col.width
                        : null
                )
            }));
        }
    }, [state?.columns, containerWidth]);

    useEffect(() => {
        setPagingVariables();
    }, [state?.rowsData, state?.pageRows]);

    const setPagingVariables = () => {
        let noOfPages = Math.floor(state.totalRows / state.pageRows);
        let lastPageRows = state.totalRows % state.pageRows;
        if (lastPageRows > 0) noOfPages++;
        if (lastPageRows === 0) lastPageRows = state.pageRows;
        let activePage = !isNull(noOfPages) && state.activePage > noOfPages ? 1 : state.activePage;
        setState((prevState) => ({
            ...prevState,
            noOfPages,
            activePage,
            lastPageRows,
            firstRow: state.pageRows * (activePage - 1),
            pagerSelectOptions: noOfPages > 0 ? [...Array(noOfPages).keys()].map((i) => i + 1) : []
        }));
    };

    const handleForwardPage = useCallback((e) => {
        e.preventDefault();
        prevPageRef.current = { changeEvent: e, pageNo: state.activePage };
        if (state.activePage !== state.noOfPages) {
            setState((prevState) => ({
                ...prevState,
                activePage: prevState.activePage + 1
            }));
        }
    });

    const handleBackwardPage = useCallback((e) => {
        e.preventDefault();
        prevPageRef.current = { changeEvent: e, pageNo: state.activePage };
        if (state.activePage !== 1) {
            setState((prevState) => ({
                ...prevState,
                activePage: prevState.activePage - 1
            }));
        }
    });

    useEffect(() => {
        if (prevPageRef?.current?.changeEvent)
            handleChangePage(
                prevPageRef.current.changeEvent,
                state?.activePage,
                prevPageRef?.current?.pageNo ?? -1
            );
    }, [state?.activePage]);

    const handleChangePage = useCallback((e, newPage, previousPage = -1) => {
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
    }, [state, setState]);

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

    const onHeaderClicked = useCallback((e, colObject, colKey) => {
        sortRef.current = { changeEvent: e, colObject: colObject, colKey: colKey }
        eventGridHeaderClicked(colObject, state, setState, colKey, isResizingRef);
    }, [state, setState]);

    useSearchAndSortCallbacks({ state, sortRef, searchRef, searchColsRef });

    const searchHandler = useSearchHandler({
        state,
        setState,
        runAISearch,
        dataReceivedRef,
        searchTimeoutRef,
        searchRef,
        searchColsRef,
        globalSearchQueryRef,
        aiSearchFailedRef,
        sortRef
    });

    const handleResetGrid = useResetGrid({
        state,
        setState,
        pageSize,
        searchColsRef,
        globalSearchQueryRef,
        sortRef,
        dataReceivedRef
    });

    useGridApi(ref, {
        state,
        dataReceivedRef,
        setState,
        handleResetGrid
    });

    return (
        <ErrorBoundary debug={state?.debug}>
            <GridConfigContext.Provider value={{ state, setState }}>
                <div
                    id={state.gridID}
                    className={
                        !isNull(state.gridCssClass)
                            ? `${state.gridCssClass} r-d-g-lt-comp`
                            : 'r-d-g-lt-comp'
                    }
                    style={{
                        maxWidth: state.maxWidth,
                        width: state.width,
                        backgroundColor: state.gridBackgroundColor
                    }}
                >
                    {state?.showToolbar === true &&
                        (<GridGlobalSearchBar
                            searchHandler={searchHandler}
                            handleResetGrid={handleResetGrid}
                        />)}
                    <div
                        style={{
                            backgroundColor: state.gridBackgroundColor
                        }}
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
                            searchHandler={searchHandler}
                            gridHeaderRef={gridHeaderRef}
                            computedColumnWidthsRef={computedColumnWidthsRef}
                            isResizingRef={isResizingRef}
                            dataReceivedRef={dataReceivedRef}
                        />
                    </div>
                    {state.showFooter === true && (
                        <GridFooter
                            onPageChange={handleChangePage}
                            onPrev={handleBackwardPage}
                            onNext={handleForwardPage}
                        />)}
                </div>
            </GridConfigContext.Provider>
        </ErrorBoundary>
    );
});

export default DataGrid;