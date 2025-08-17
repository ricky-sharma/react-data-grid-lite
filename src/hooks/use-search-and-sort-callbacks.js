import { useEffect } from 'react';

export function useSearchAndSortCallbacks({ state, sortRef, searchRef, searchColsRef }) {
    useEffect(() => {
        const sortOrder =
            state?.columns?.find(col => col?.name === sortRef?.current?.colKey)?.sortOrder ?? '';

        if (sortRef?.current) {
            sortRef.current.sortOrder = sortOrder;
        }

        if (typeof state?.onSortComplete === 'function' && sortRef?.current?.changeEvent) {
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
    }, [state.toggleState]);
}