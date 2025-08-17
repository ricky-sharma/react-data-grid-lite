import { useCallback } from 'react';
import { eventGridSearchTriggered } from '../components/events/event-grid-search-triggered';
import { logDebug } from '../helpers/logDebug';

export function useSearchHandler({
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
}) {
    const onSearch = useCallback((e, colName, colObject, formatting, onChange = true) => {
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
                    searchColsRef.current.push({ colName, searchQuery: query, colObj: colObject });
                }
                globalSearchQueryRef.current = query;
            }

            const rowCount = searchableData?.length;
            const globalSearchCol = searchColsRef.current.find(col => col.colName === '##globalSearch##');
            const aiQuery = query !== '' ? query : globalSearchCol?.searchQuery;

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

                eventGridSearchTriggered(
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
    }, [
        state,
        setState,
        runAISearch,
        dataReceivedRef,
        searchTimeoutRef,
        searchRef,
        searchColsRef,
        globalSearchQueryRef,
        aiSearchFailedRef,
        sortRef,
        logDebug,
        eventGridSearchTriggered
    ]);

    return onSearch;
}