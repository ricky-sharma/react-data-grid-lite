import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getBool, isNull } from '../src/helpers/common';
import { eventGridHeaderClicked } from './components/events/event-grid-header-clicked';
import GridFooter from './components/grid-footer';
import GridGlobalSearchBar from './components/grid-global-search-bar';
import GridTable from './components/grid-table';
import GridToolBarMenu from './components/grid-toolbar-menu';
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
import { showLoader } from './utils/loading-utils';

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

    const {
        enableRtl,
        actionColumnAlign,
        enableCellEdit,
        enableColumnDrag,
        enableColumnResize,
        enableSorting,
        rowSelectColumnAlign,
        showColumnMenu,
        showToolbarMenu,
        enableColumnSearch,
        enableGlobalSearch,
        enableRowSelection,
        showToolbar,
        showResetButton,
        showResetMenuItem,
        csvExportUI,
        gridClass,
        headerClass,
        rowClass,
        showFooter,
        showNumberPagination,
        showSelectPagination,
        showPageSizeSelector,
        showPageInfo,
        rowHeight,
        editButton,
        deleteButton,
        enableDownload,
        downloadFilename,
        onDownloadComplete,
        globalSearchPlaceholder,
        gridBgColor,
        headerBgColor,
        aiSearch,
        debug,
        virtualization
    } = options || {};

    const optionProps = useMemo(() => ({
        enableRtl: getBool(enableRtl),
        actionColumnAlign: actionColumnAlign ?? 'right',
        enableCellEdit: getBool(enableCellEdit),
        enableColumnDrag: getBool(enableColumnDrag),
        enableColumnResize: getBool(enableColumnResize),
        enableSorting: getBool(enableSorting, true),
        rowSelectColumnAlign: rowSelectColumnAlign ?? 'left',
        showColumnMenu: getBool(showColumnMenu, true),
        showToolbarMenu: getBool(showToolbarMenu, true),
        enableColumnSearch: getBool(enableColumnSearch, true),
        enableGlobalSearch: getBool(enableGlobalSearch, true),
        enableRowSelection: getBool(enableRowSelection, true),
        showToolbar: getBool(showToolbar, true),
        showResetButton: getBool(showResetButton),
        showResetMenuItem: getBool(showResetMenuItem, true),
        csvExportUI: csvExportUI === 'button' ? 'button' : 'menu',
        isCSVExportUIButton: csvExportUI === 'button',
        gridCssClass: gridClass ?? applyTheme(theme ?? '')?.grid ?? '',
        headerCssClass: headerClass ?? applyTheme(theme ?? '')?.header ?? '',
        rowCssClass: rowClass ?? applyTheme(theme ?? '')?.row ?? '',
        showFooter: getBool(showFooter, true),
        showNumberPagination: getBool(showNumberPagination, true),
        showSelectPagination: getBool(showSelectPagination, true),
        showPageSizeSelector: getBool(showPageSizeSelector, true),
        showPageInfo: getBool(showPageInfo, true),
        rowHeight: parseInt(rowHeight, 10) ? rowHeight : undefined,
        editButtonEnabled: typeof editButton === 'object',
        editButtonEvent: editButton?.event ?? fallbackfn,
        deleteButtonEnabled: typeof deleteButton === 'object',
        deleteButtonEvent: deleteButton?.event ?? fallbackfn,
        enableDownload: getBool(enableDownload, true),
        downloadFilename: downloadFilename ?? null,
        onDownloadComplete: onDownloadComplete ?? fallbackfn,
        globalSearchPlaceholder: globalSearchPlaceholder,
        gridBackgroundColor: gridBgColor,
        gridHeaderBackgroundColor: headerBgColor,
        aiSearchOptions: aiSearch ?? {},
        debug: getBool(debug),
        virtualization: typeof virtualization === 'boolean' ? virtualization : undefined
    }), [
        enableRtl,
        actionColumnAlign,
        enableCellEdit,
        enableColumnDrag,
        enableColumnResize,
        enableSorting,
        rowSelectColumnAlign,
        showColumnMenu,
        showToolbarMenu,
        enableColumnSearch,
        enableGlobalSearch,
        enableRowSelection,
        showToolbar,
        showResetButton,
        showResetMenuItem,
        csvExportUI,
        gridClass,
        headerClass,
        rowClass,
        showFooter,
        showNumberPagination,
        showSelectPagination,
        showPageSizeSelector,
        showPageInfo,
        rowHeight,
        editButton,
        deleteButton,
        enableDownload,
        downloadFilename,
        onDownloadComplete,
        globalSearchPlaceholder,
        gridBgColor,
        headerBgColor,
        aiSearch,
        debug,
        virtualization
    ]);

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
        globalSearchInput: '',
        toggleState: true,
        searchValues: {},
        editingCell: null,
        selectedRows: new Set(),
        ...optionProps
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
        setState(prevState => ({
            ...prevState,
            ...optionProps
        }))
    }, [optionProps])

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
            const visibleColumns = state?.columns?.filter(col => !col?.hidden && !col?.hideable);
            setState((prevState) => ({
                ...prevState,
                enableVirtualColumns: state?.virtualization === true
                    || (state?.virtualization === undefined && visibleColumns?.length > 25)
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
            firstRow: prevState.pageRows * (activePage - 1),
            enableVirtualRows: prevState?.virtualization === true
                || (prevState?.virtualization === undefined && prevState.pageRows > 25),
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
        showLoader(state?.gridID);
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
        showLoader(state?.gridID);
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
                    dir={state.enableRtl ? 'rtl' : ''}
                    id={state.gridID}
                    className={`${state.gridCssClass ?? ''} r-d-g-lt-comp${state.enableRtl ? ' rdg-rtl' : ''}`.trim()}
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
                        {state?.showToolbar === false &&
                            state?.showToolbarMenu === true &&
                            <div
                                style={{
                                    right: !state.enableRtl ? '30px' : undefined,
                                    left: state.enableRtl ? '30px' : undefined,
                                    top: '-4px',
                                    position: 'absolute'
                                }}
                                className="pd--0 mg--0">
                                <GridToolBarMenu
                                    handleResetGrid={handleResetGrid}
                                    vertical={false}
                                    borderRadius={"0"}
                                    noBorder="true"
                                    height={"10px"}
                                    boxShadow='.1px 0 2px 0 currentcolor'
                                />
                            </div>}
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