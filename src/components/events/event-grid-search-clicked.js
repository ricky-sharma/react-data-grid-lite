import { isNull, objectKeyMatch } from '../../helper/common';
import { format as formatVal } from '../../helper/format';

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
    // Basic safety checks
    if (!e || typeof colName !== 'string') {
        return;
    }
    const searchQuery = e.target.value;
    const format = !isNull(formatting?.format) ? formatting.format : '';
    const type = !isNull(formatting?.type) ? formatting.type : '';
    const colObj = !isNull(colObject) ? colObject : [colName];
    let data = dataReceivedRef?.current ?? [];
    // Update searchColsRef list
    searchColsRef.current = searchColsRef?.current?.filter(x => x.colName !== colName) ?? [];
    if (searchQuery !== '') {
        searchColsRef.current.push({ colName, searchQuery, colObj, formatting: { format, type } });
    }
    let globalSearchData = [];
    const formattingType = ['date', 'number', 'currency', 'percent', 'boolean'];
    searchColsRef?.current?.forEach(col => {
        const q = col?.searchQuery?.toLowerCase(),
            matchesSearch = (val) => !isNull(val) && val.toString().toLowerCase().includes(q);
        if (col.colName === '##globalSearch##') {
            col.colObj.forEach(c => {
                let colObjSearchData = [];
                const hidden = c?.hidden || false, f = c?.formatting?.format ?? '',
                    t = (c?.formatting?.type || '')?.toLowerCase(), cc = c?.concatColumns?.columns;
                colObjSearchData = data.filter(o => formattingType.includes(t) && !isNull(f) ?
                    (cc ? Object.keys(o).some(k => cc.some(x => x?.toLowerCase() === k.toLowerCase()) &&
                        !hidden && !isNull(o[k]) && formatVal(o[k], t, f).toLowerCase().includes(q))
                        : !hidden && formatVal(o[c.name], t, f).toLowerCase().includes(q))
                    : (cc ? Object.keys(o).some(k => cc.some(x => x?.toLowerCase() === k.toLowerCase())
                        && !hidden && matchesSearch(o[k]))
                        : !hidden && matchesSearch(o[c.name])));
                globalSearchData = globalSearchData.length ?
                    [...globalSearchData, ...colObjSearchData.filter(d => !new Set(globalSearchData.map(x => x.id)).has(d.id))]
                    : [...colObjSearchData];
            });
            data = [...globalSearchData];
        } else {
            const t = (col?.formatting?.type || '').toLowerCase(), f = col?.formatting?.format ?? '';
            data = data.filter(o => formattingType.includes(t) && !isNull(f)
                ? (!isNull(col.colObj)
                    ? Object.keys(o).some(k => col.colObj.some(x => x?.toLowerCase() === k.toLowerCase()) && !isNull(o[k])
                        && formatVal(o[k], t, f).toLowerCase().includes(q))
                    : objectKeyMatch(o, col.colName) && formatVal(o[col.colName], t, f).toLowerCase().includes(q))
                : (!isNull(col.colObj)
                    ? Object.keys(o).some(k => col.colObj.some(x => x?.toLowerCase() === k.toLowerCase()) && matchesSearch(o[k]))
                    : objectKeyMatch(o, col.colName) && matchesSearch(o[col.colName]))
            );
        }
    });
    const dataLength = data.length;
    setState(prev => (
        {
            ...prev,
            rowsData: data,
            activePage: 1,
            totalRows: dataLength,
            firstRow: 0,
            toggleState: !state.toggleState
        }));
};