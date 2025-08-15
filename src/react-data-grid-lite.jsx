import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { isNull } from '../src/helpers/common';
import { eventGridHeaderClicked, sortData } from './components/events/event-grid-header-clicked';
import { eventGridSearchClicked, filterData } from './components/events/event-grid-search-clicked';
import GridFooter from './components/grid-footer';
import GridGlobalSearchBar from './components/grid-global-search-bar';
import GridTable from './components/grid-table';
import { Default_Grid_Width_VW } from './constants';
import { GridConfigContext } from './context/grid-config-context';
import ErrorBoundary from './error-boundary';
import { logDebug } from './helpers/logDebug';
import { useAISearch } from './hooks/use-ai-search';
import useContainerWidth from './hooks/use-container-width';
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
        enableSorting: typeof options?.enableSorting === 'boolean' ?
            options?.enableSorting : true,
        enableRowSelection: typeof options?.enableRowSelection === 'boolean' ?
            options?.enableRowSelection : true,
        showToolbar: typeof options?.showToolbar === 'boolean' ?
            options?.showToolbar : true,
        showResetButton: typeof options?.showResetButton === 'boolean' ?
            options?.showResetButton : true,
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
                            hidden: typeof col?.hidden === 'boolean' ? col?.hidden : false,
                            width: prevState.columns?.find(c => c?.name === col?.name)?.width ?? col?.width ?? '',
                            order: prevState.columns?.find(c => c?.name === col?.name)?.displayIndex ?? col?.order ?? ''
                        }));
                        const fixedCols = validColumns.filter(col => col.fixed === true);
                        const nonFixedCols = validColumns.filter(col => col.fixed === false);
                        const applyGlobalOrder = (group, globalStartIndex = 0) => {
                            const result = [];
                            const withOrder = group.filter(c => typeof c.order === 'number');
                            const withoutOrder = group.filter(c => typeof c.order !== 'number');
                            const orderGroups = new Map();
                            for (const col of withOrder) {
                                const order = col.order;
                                if (!orderGroups.has(order)) orderGroups.set(order, []);
                                orderGroups.get(order).push(col);
                            }
                            const sortedOrderValues = Array.from(orderGroups.keys()).sort((a, b) => a - b);
                            for (const order of sortedOrderValues) {
                                const cols = orderGroups.get(order).sort((a, b) => a.name.localeCompare(b.name));
                                for (const col of cols) {
                                    const maxIndex = group.length - 1;
                                    const globalIdx = Math.min(Math.max(0, col.order - 1), maxIndex + globalStartIndex);
                                    const localIdx = Math.max(0, globalIdx - globalStartIndex);
                                    let i = localIdx;
                                    while (result[i]) i++;
                                    result[i] = col;
                                }
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
                        return finalList.filter(Boolean).map((col, index) => ({
                            ...col,
                            displayIndex: index + 1
                        }));
                    })()
                    : []
            }));
    }, [columns]);

    useEffect(() => {
        if (!isNull(data)) {
            let timeout;
            const processData = async () => {
                let processedRows = data?.map((row, index) => ({
                    ...row,
                    __$index__: index
                }));
                dataReceivedRef.current = processedRows;
                const aiQuery = globalSearchQueryRef?.current?.trim();
                const aiEnabled = state?.aiSearchOptions?.enabled;
                const aiThreshold = state?.aiSearchOptions?.minRowCount ?? 1;

                if (aiEnabled && aiQuery && processedRows.length >= aiThreshold) {
                    try {
                        aiSearchFailedRef.current = false;
                        processedRows = await runAISearch({
                            data: dataReceivedRef.current,
                            query: aiQuery
                        });
                    } catch (err) {
                        aiSearchFailedRef.current = true;
                        logDebug(state?.debug, 'error', 'AI search failed, falling back to default local search.', err);
                    }
                }
                const filteredData = await filterData(searchColsRef, processedRows, aiSearchFailedRef,
                    aiEnabled);
                const shouldSort = sortRef?.current?.colObject && sortRef?.current?.sortOrder;
                const sortedRows = shouldSort
                    ? await sortData(
                        sortRef.current.colObject,
                        sortRef.current.sortOrder,
                        filteredData
                    )
                    : filteredData;
                const pageRowCount = state?.pageRows ?? (!isNull(parseInt(pageSize, 10))
                    ? parseInt(pageSize, 10)
                    : sortedRows?.length);
                timeout = setTimeout(() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            rowsData: sortedRows,
                            totalRows: sortedRows?.length,
                            pageRows: pageRowCount,
                            currentPageRows: (prevState?.activePage === prevState?.noOfPages)
                                ? prevState?.lastPageRows : pageRowCount,
                            columns: prevState?.columns?.map(col => ({
                                ...col,
                                sortOrder: col?.name === sortRef?.current?.colKey
                                    ? sortRef?.current?.sortOrder : ''
                            }))
                        }
                    });
                });
            };
            processData();
            return () => clearTimeout(timeout);
        }
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
    }, [state?.columns, containerWidth]);

    const selectedSet = useMemo(() => new Set(state?.selectedRows ?? []), [state?.selectedRows]);
    useImperativeHandle(ref, () => ({
        getFilteredRows: () => {
            return state?.rowsData ?? [];
        },
        getFilteredSelectedRowsIndexes: () => {
            return (state?.rowsData ?? [])
                .filter(row => selectedSet?.has(row?.__$index__))
                .map(row => row?.__$index__);
        },
        getFilteredSelectedRows: () => {
            return state?.rowsData?.filter(row => selectedSet?.has(row?.__$index__)) ?? [];
        },
        getAllSelectedRowsIndexes: () => {
            return Array.from(selectedSet);
        },
        getAllSelectedRows: () => {
            return dataReceivedRef?.current?.filter(row => selectedSet?.has(row?.__$index__)) ?? [];
        },
        getCurrentPage: () => state?.activePage ?? 1,
        resetGrid: handleResetGrid,
    }), [selectedSet, state?.rowsData, state?.activePage, dataReceivedRef, handleResetGrid]);

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

    useEffect(() => {
        const sortOrder = state?.columns?.find(col => col?.name
            === sortRef?.current?.colKey)?.sortOrder ?? ''
        if (sortRef?.current) sortRef.current.sortOrder = sortOrder;
        if (typeof state.onSortComplete === 'function' && sortRef?.current?.changeEvent) {
            state.onSortComplete(
                sortRef.current.changeEvent,
                sortRef.current.colObject,
                state.rowsData,
                sortOrder
            );
            sortRef.current.changeEvent = null;
        }
        if (typeof state?.onSearchComplete === 'function' && searchRef?.current?.changeEvent) {
            state.onSearchComplete(
                searchRef.current.changeEvent,
                searchRef.current.searchQuery,
                searchColsRef?.current ?? [],
                state?.rowsData ?? [],
                state?.rowsData?.length || 0
            );
        }
        searchRef.current = null;
    }, [state.toggleState])

    const onSearchClicked = useCallback((
        e,
        colName,
        colObject,
        formatting,
        onChange = true
    ) => {
        if (searchTimeoutRef?.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        let searchableData = dataReceivedRef?.current ?? [];
        const eventCopy = e?.nativeEvent ? { ...e } : e;
        const isGlobal = colName === '##globalSearch##';
        const aiEnabled = state?.aiSearchOptions?.enabled;
        const aiThreshold = state?.aiSearchOptions?.minRowCount ?? 1;
        const query = isGlobal && aiEnabled && !onChange
            ? state.globalSearchInput?.trimStart() ?? ''
            : eventCopy?.target?.value?.trimStart() ?? '';

        searchTimeoutRef.current = setTimeout(() => {
            searchRef.current = {
                changeEvent: eventCopy,
                searchQuery: query
            };

            if (isGlobal) {
                const existingGlobalCol = searchColsRef.current.find(col => col.colName === '##globalSearch##');
                if (existingGlobalCol) {
                    existingGlobalCol.searchQuery = query;
                } else {
                    searchColsRef.current.push({
                        colName,
                        searchQuery: query,
                        colObj: colObject
                    });
                }
                globalSearchQueryRef.current = query;
            }

            const rowCount = searchableData?.length ?? 0;
            const globalSearchCol = searchColsRef.current.find(col => col.colName === '##globalSearch##');
            const aiQuery = query !== '' ? query : globalSearchCol?.searchQuery ?? '';

            (async () => {
                if (aiEnabled && rowCount >= aiThreshold && aiQuery) {
                    try {
                        aiSearchFailedRef.current = false;
                        searchableData = await runAISearch({
                            data: searchableData,
                            query: aiQuery
                        });
                    } catch (err) {
                        aiSearchFailedRef.current = true;
                        logDebug(state?.debug, 'error', 'AI search failed, falling back to default local search.', err);
                    }
                }

                eventGridSearchClicked(
                    query,
                    colName,
                    colObject,
                    formatting,
                    searchableData,
                    searchColsRef,
                    state,
                    setState,
                    sortRef,
                    aiSearchFailedRef,
                    aiEnabled
                );
            })();
        }, 300);
    }, [state, setState, runAISearch, state?.aiSearchOptions]);

    const handleResetGrid = useCallback((e) => {
        try {
            e.preventDefault();
            searchColsRef.current = [];
            globalSearchQueryRef.current = '';
            sortRef.current = null;
            setState(prev => {
                const dataLength = dataReceivedRef?.current?.length ?? 0
                let noOfPages = Math.floor(dataLength / prev?.pageRows);
                let lastPageRows = dataLength % prev?.pageRows;
                if (lastPageRows > 0) noOfPages++;
                if (lastPageRows === 0) lastPageRows = prev?.pageRows;

                return {
                    ...prev,
                    searchValues: Object.fromEntries(
                        (Array.isArray(prev.columns) ? prev.columns : [])
                            .filter(col => col && col.name)
                            .map(col => [col.name, ''])
                    ),
                    globalSearchInput: '',
                    rowsData: dataReceivedRef?.current ?? [],
                    noOfPages,
                    lastPageRows,
                    currentPageRows: prev?.pageRows,
                    activePage: 1,
                    totalRows: dataLength,
                    firstRow: 0,
                    selectedRows: new Set(),
                    columns: prev.columns.map(col => ({
                        ...col,
                        sortOrder: '',
                    })),
                }
            });
        }
        catch (err) {
            logDebug(state?.debug, 'error', 'Reset Grid:', err);
        }
    }, [state, setState]);

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
                            onSearchClicked={onSearchClicked}
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
                            onSearchClicked={onSearchClicked}
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