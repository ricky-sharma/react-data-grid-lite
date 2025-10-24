import { useEffect } from 'react';
import { isNull } from '../helpers/common';
import { logDebug } from '../helpers/logDebug';
import { filterData } from '../components/events/event-grid-search-triggered';
import { sortData } from '../components/events/event-grid-header-clicked';

export function useProcessedData({
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
}) {
    useEffect(() => {
        if (!isNull(data) && Array.isArray(data)) {
            let timeout;

            const processData = async () => {
                let processedRows = data.map((row, index) => ({
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

                const filteredData = await filterData(
                    searchColsRef,
                    processedRows,
                    aiSearchFailedRef,
                    aiEnabled
                );

                const shouldSort = sortRef?.current?.colObject && sortRef?.current?.sortOrder;
                const sortedRows = shouldSort
                    ? await sortData(
                        sortRef.current.colObject,
                        sortRef.current.sortOrder,
                        filteredData,
                        state?.columnTypes
                    )
                    : filteredData;

                const pageRowCount = state?.pageRows ?? (!isNull(parseInt(pageSize, 10))
                    ? parseInt(pageSize, 10)
                    : sortedRows?.length);

                timeout = setTimeout(() => {
                    setState(prevState => {
                        const { activePage, noOfPages, lastPageRows, processedColumns } = prevState;
                        const { colKey, sortOrder } = sortRef?.current || {};

                        const updateSortOrder = (col) => ({
                            ...col,
                            sortOrder: col.name === colKey ? sortOrder : ''
                        });

                        const updatedColumns = processedColumns?.map(updateSortOrder);

                        return {
                            ...prevState,
                            processedData: sortedRows,
                            rowsData: sortedRows,
                            totalRows: sortedRows.length,
                            pageRows: pageRowCount,
                            currentPageRows: activePage === noOfPages ? lastPageRows : pageRowCount,
                            columns: updatedColumns,
                            processedColumns: updatedColumns,
                        };
                    });
                });
            };

            processData();

            return () => clearTimeout(timeout);
        }
    }, [data, state?.transposeColumnName]);
}