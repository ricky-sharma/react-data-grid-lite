import { Formatting_Types } from '../../constants';
import { isEqual, isNull, normalize } from '../../helpers/common';
import { format as formatVal } from '../../helpers/format';
import { getNormalizedCombinedValue } from '../../utils/component-utils';

/*
 * Handles column or global search logic in a grid.
 */
export const eventGridSearchClicked = (
    e,
    colName,
    colObject = [],
    formatting = {
        format: '',
        type: ''
    },
    dataReceivedRef,
    searchColsRef,
    state,
    setState
) => {
    if (!e || typeof colName !== 'string') {
        return;
    }

    const searchQuery = e.target.value.trim().toLowerCase();
    const format = !isNull(formatting?.format) ? formatting.format : '';
    const type = !isNull(formatting?.type) ? formatting.type : '';
    const colObj = !isNull(colObject) ? colObject : [colName];
    const colSep = state?.columns?.
        find(c => c?.name?.toLowerCase() === colName?.toLowerCase())?.
        concatColumns?.separator || ' ';

    let data = dataReceivedRef?.current ?? [];

    // Update searchColsRef list
    searchColsRef.current = searchColsRef?.current?.filter(x => x.colName !== colName) ?? [];
    if (searchQuery !== '') {
        searchColsRef.current.push({ colName, searchQuery, colObj, formatting: { format, type }, colSep });
    }

    let globalSearchData = [];
    searchColsRef?.current?.forEach(col => {
        const q = col?.searchQuery?.toLowerCase();
        const terms = normalize(q).match(/\S+/g) || [];
        const colMatchesSearch = (val) => {
            if (isNull(val)) return false;
            const normalizedValue = normalize(val);
            return terms.every(term => normalizedValue.includes(term));
        };

        if (col.colName === '##globalSearch##') {
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

            data = globalSearchData.filter((item, index, self) =>
                index === self.findIndex(other => isEqual(item, other))
            );
        } else {
            const t = (col?.formatting?.type || '').toLowerCase();
            const f = col?.formatting?.format ?? '';
            const ccs = col?.colSep || ' ';

            data = data.filter(o => {
                // If this is a "concatenated column"
                if (col.colObj.length > 1) {
                    const combinedValue = getNormalizedCombinedValue(o, col.colObj, Formatting_Types, t, f, ccs);
                    return terms.every(term => combinedValue.includes(term));
                } else {
                    // Single field
                    return Object.keys(o).some(k =>
                        col.colObj.some(x => x?.toLowerCase() === k?.toLowerCase()) &&
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

    const dataLength = data.length;

    setState(prev => ({
        ...prev,
        rowsData: data,
        activePage: 1,
        totalRows: dataLength,
        firstRow: 0,
        toggleState: !state.toggleState
    }));
};