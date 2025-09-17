import { Formatting_Types } from '../../constants';
import { isNull, normalize } from '../../helpers/common';
import { format as formatVal } from '../../helpers/format';
import { getNormalizedCombinedValue } from '../../utils/component-utils';
import { showLoader } from '../../utils/loading-utils';
import { sortData } from './event-grid-header-clicked';

/*
 * Handles column or global search logic in a grid.
 */
export const eventGridSearchTriggered = async (
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
    showLoader(state?.gridID);
    data = filterData(searchColsRef, data, aiSearchFailedRef, aiSearchEnabled);

    const shouldSort = sortRef?.current?.colObject && sortRef?.current?.sortOrder;
    data = shouldSort
        ? await sortData(
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

export function filterData(searchColsRef, data, aiSearchFailedRef, aiSearchEnabled) {
    if (!searchColsRef?.current?.length) return data;

    const searchCols = searchColsRef.current;
    const isAIEnabled = aiSearchEnabled === true && aiSearchFailedRef?.current === false;
    const dataLength = data?.length;
    let filteredData = data;

    for (let col of searchCols) {
        const rawQuery = col?.searchQuery?.toLowerCase();
        const terms = normalize(rawQuery)?.match(/\S+/g);
        if (!terms || terms.length === 0) continue;

        const type = (col?.formatting?.type || '').toLowerCase();
        const format = col?.formatting?.format ?? '';
        const separator = col?.colSep || ' ';

        const colMatchesSearch = (val) => {
            if (isNull(val)) return false;
            const normalizedValue = normalize(val);
            for (let term of terms) {
                if (!normalizedValue.includes(term)) return false;
            }
            return true;
        };

        if (col.colName === '##globalSearch##') {
            if (isAIEnabled) continue;

            let seen = new Set();
            let globalResults = [];

            for (let c of col.colObj) {
                if (c?.hidden === true) continue;

                const fieldType = (c?.formatting?.type || '').toLowerCase();
                const fieldFormat = c?.formatting?.format ?? '';
                const concatCols = c?.concatColumns?.columns;
                const concatSep = c?.concatColumns?.separator || ' ';

                for (let row of data) {
                    let value = '';
                    if (Array.isArray(concatCols)) {
                        value = getNormalizedCombinedValue(row, concatCols, Formatting_Types, fieldType, fieldFormat, concatSep);
                    } else {
                        const rawVal = row[c.name];
                        value = Formatting_Types.includes(fieldType)
                            ? formatVal(rawVal, fieldType, fieldFormat)?.toString()?.toLowerCase()
                            : rawVal?.toString()?.toLowerCase();
                    }

                    if (!value) continue;

                    let match = true;
                    for (let term of terms) {
                        if (!value.includes(term)) {
                            match = false;
                            break;
                        }
                    }

                    if (match) {
                        const rowKey = JSON.stringify(row);
                        if (!seen.has(rowKey)) {
                            seen.add(rowKey);
                            globalResults.push(row);
                        }
                    }
                }
                if (globalResults?.length === dataLength) {
                    break;
                }
            }

            filteredData = globalResults;
        } else {
            filteredData = filteredData.filter(row => {
                if (col.colObj.length > 1) {
                    const value = getNormalizedCombinedValue(row, col.colObj, Formatting_Types, type, format, separator);
                    return terms.every(term => value.includes(term));
                }

                // Single field
                for (let key in row) {
                    for (let targetCol of col.colObj) {
                        if (targetCol?.toLowerCase() === key?.toLowerCase()) {
                            const rawVal = row[key];
                            const valToCheck = Formatting_Types.includes(type)
                                ? formatVal(rawVal, type, format)
                                : rawVal;

                            if (colMatchesSearch(valToCheck)) return true;
                        }
                    }
                }

                return false;
            });
        }
    }

    return filteredData;
}