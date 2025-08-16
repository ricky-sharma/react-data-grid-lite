import { useEffect } from 'react';
import { isNull } from '../helpers/common';

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
    runAISearch,
    filterData,
    sortData,
    logDebug
}) {
    useEffect(() => {
        if (!isNull(data)) {
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
                        filteredData
                    )
                    : filteredData;

                const pageRowCount = state?.pageRows ?? (!isNull(parseInt(pageSize, 10))
                    ? parseInt(pageSize, 10)
                    : sortedRows?.length);

                timeout = setTimeout(() => {
                    setState(prevState => ({
                        ...prevState,
                        rowsData: sortedRows,
                        totalRows: sortedRows.length,
                        pageRows: pageRowCount,
                        currentPageRows:
                            prevState.activePage === prevState.noOfPages
                                ? prevState.lastPageRows
                                : pageRowCount,
                        columns: prevState.columns?.map(col => ({
                            ...col,
                            sortOrder:
                                col.name === sortRef?.current?.colKey
                                    ? sortRef.current.sortOrder
                                    : ''
                        }))
                    }));
                });
            };

            processData();

            return () => clearTimeout(timeout);
        }
    }, [data]);
}