import { Formatting_Types } from '../../constants';
import { isEqual, isNull, normalize } from '../../helpers/common';
import { format as formatVal } from '../../helpers/format';
import { getNormalizedCombinedValue } from '../../utils/component-utils';
import { SortData } from './event-grid-header-clicked';

/*
 * Handles column or global search logic in a grid.
 */
export const eventGridSearchClicked = async (
    searchQuery,
    colName,
    colObject = [],
    formatting = {
        format: '',
        type: ''
    },
    searchableData,
    searchColsRef,
    state,
    setState,
    sortRef,
    aiSearchFailedRef,
    aiSearchEnabled
) => {
    if (typeof colName !== 'string') {
        return;
    }

    const format = !isNull(formatting?.format) ? formatting.format : '';
    const type = !isNull(formatting?.type) ? formatting.type : '';
    const colObj = !isNull(colObject) ? colObject : [colName];
    const colSep = state?.columns?.
        find(c => c?.name?.toLowerCase() === colName?.toLowerCase())?.
        concatColumns?.separator || ' ';

    let data = searchableData ?? [];
    // Update searchColsRef list
    searchColsRef.current = searchColsRef?.current?.filter(x => x.colName !== colName) ?? [];
    if (searchQuery !== '') {
        searchColsRef.current.push({ colName, searchQuery, colObj, formatting: { format, type }, colSep });
    }
    data = FilterData(searchColsRef, data, aiSearchFailedRef, aiSearchEnabled);

    const shouldSort = sortRef?.current?.colObject && sortRef?.current?.sortOrder;
    data = shouldSort
        ? await SortData(
            sortRef.current.colObject,
            sortRef.current.sortOrder,
            data
        )
        : data;

    const dataLength = data.length;
    setState(prev => {
        let noOfPages = Math.floor(dataLength / prev?.pageRows);
        let lastPageRows = dataLength % prev?.pageRows;
        if (lastPageRows > 0) noOfPages++;
        if (lastPageRows === 0) lastPageRows = prev?.pageRows;
        const resetPage = prev?.activePage > noOfPages;
        const activePage = resetPage ? 1 : prev?.activePage ?? 1;
        return {
            ...prev,
            rowsData: data,
            noOfPages,
            lastPageRows,
            activePage,
            currentPageRows: (activePage === noOfPages) ? lastPageRows : prev?.pageRows,
            totalRows: dataLength,
            firstRow: prev?.pageRows * (resetPage ? 0 : activePage - 1),
            toggleState: !prev?.toggleState
        };
    });
};

export function FilterData(searchColsRef, data, aiSearchFailedRef, aiSearchEnabled) {
    if (searchColsRef?.current?.length > 0) {
        let globalSearchData = [];
        searchColsRef?.current?.forEach(col => {
            const q = col?.searchQuery?.toLowerCase();
            const terms = normalize(q)?.match(/\S+/g) || [];
            const colMatchesSearch = (val) => {
                if (isNull(val)) return false;
                const normalizedValue = normalize(val);
                return terms.every(term => normalizedValue.includes(term));
            };

            if (col.colName === '##globalSearch##') {
                if (aiSearchEnabled === true && aiSearchFailedRef?.current === false)
                    return;
                col.colObj.forEach(c => {
                    if (c?.hidden === true) return;
                    let colObjSearchData = [];
                    const f = c?.formatting?.format ?? '';
                    const t = (c?.formatting?.type || '')?.toLowerCase();
                    const cc = c?.concatColumns?.columns;
                    const ccs = c?.concatColumns?.separator || ' ';

                    colObjSearchData = data.filter(o => {
                        let combinedValue = '';
                        // If this is a "concatenated column"
                        if (cc && Array.isArray(cc)) {
                            combinedValue = getNormalizedCombinedValue(o, cc, Formatting_Types, t, f, ccs);
                        } else {
                            const val = o[c.name];
                            combinedValue = Formatting_Types.includes(t)
                                ? formatVal(val, t, f)?.toString()?.toLowerCase()
                                : val?.toString()?.toLowerCase();
                        }

                        return terms.every(term => combinedValue?.includes(term));
                    });
                    globalSearchData = [...globalSearchData, ...colObjSearchData];
                });

                data = globalSearchData.filter((item, index, self) => index === self.findIndex(other => isEqual(item, other))
                );
            } else {
                const t = (col?.formatting?.type || '')?.toLowerCase();
                const f = col?.formatting?.format ?? '';
                const ccs = col?.colSep || ' ';

                data = data.filter(o => {
                    // If this is a "concatenated column"
                    if (col.colObj.length > 1) {
                        const combinedValue = getNormalizedCombinedValue(o, col.colObj, Formatting_Types, t, f, ccs);
                        return terms.every(term => combinedValue.includes(term));
                    } else {
                        // Single field
                        return Object.keys(o).some(k => col.colObj.some(x => x?.toLowerCase() === k?.toLowerCase()) &&
                            (
                                Formatting_Types.includes(t)
                                    ? (!isNull(o[k]) && colMatchesSearch(formatVal(o[k], t, f)))
                                    : colMatchesSearch(o[k])
                            )
                        );
                    }
                });
            }
        });
    }
    return data;
}
