import { isNull, objectKeyMatch } from '../../helper/common';
import { formatDate } from '../../helper/date';

/**
 * Handles column or global search logic in a grid.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event
 * @param {string} colName - The name of the column being searched
 * @param {Array|undefined} colObject - Optional array of column keys (e.g., for global search)
 * @param {object|undefined} formatting - Object with keys `Format` and `Type` for date formatting
 * @param {object} context - The React class component instance (`this`)
 */
export const eventGridSearchClicked = (
    e,
    colName,
    colObject = [],
    formatting = { Format: '', Type: '' },
    context
) => {
    // Basic safety checks
    if (!e || typeof colName !== 'string' || typeof context !== 'object') {
        console.warn('Invalid parameters passed to EventGridSearchClicked.');
        return;
    }

    const searchQuery = e.target.value;
    const keyFormat = !isNull(formatting?.Format) ? formatting.Format : '';
    const formatType = !isNull(formatting?.Type) ? formatting.Type : '';
    const colObj = !isNull(colObject) ? colObject : null;

    let data = context.dataRecieved;

    // Update searchCols list
    context.searchCols = context.searchCols.filter(x => x.colName !== colName);
    if (searchQuery !== '') {
        context.searchCols.push({ colName, searchQuery, colObj, format: { keyFormat, formatType } });
    }

    let globalSearchData = [];

    context.searchCols.forEach(col => {
        const matchesSearch = (val) =>
            !isNull(val) && val.toString().toLowerCase().includes(col.searchQuery.toLowerCase());

        if (col.colName === '##globalSearch##') {
            col.colObj.forEach(c => {
                let colObjSearchData = [];
                const hidden = c.hidden || false;
                const isDateType = ['DATE', 'DATETIME'].includes((c.format?.formatType || '').toUpperCase());
                const hasFormat = !isNull(c.format?.keyFormat);

                if (isDateType && hasFormat) {
                    if (c.ConcatColumns?.Columns) {
                        colObjSearchData = data.filter(obj =>
                            Object.keys(obj).some(key =>
                                c.ConcatColumns.Columns.some(x => x?.toLowerCase() === key.toLowerCase()) &&
                                !hidden &&
                                !isNull(obj[key]) &&
                                formatDate(obj[key], c.format.keyFormat).toLowerCase().includes(col.searchQuery.toLowerCase())
                            )
                        );
                    } else {
                        colObjSearchData = data.filter(obj =>
                            !hidden &&
                            formatDate(new Date(obj[c.name]), c.format.keyFormat).toLowerCase().includes(col.searchQuery.toLowerCase())
                        );
                    }
                } else {
                    if (c.ConcatColumns?.Columns) {
                        colObjSearchData = data.filter(obj =>
                            Object.keys(obj).some(key =>
                                c.ConcatColumns.Columns.some(x => x?.toLowerCase() === key.toLowerCase()) &&
                                !hidden &&
                                matchesSearch(obj[key])
                            )
                        );
                    } else {
                        colObjSearchData = data.filter(obj =>
                            !hidden && matchesSearch(obj[c.name])
                        );
                    }
                }

                if (globalSearchData.length > 0) {
                    const ids = new Set(globalSearchData.map(d => d.id));
                    globalSearchData = [
                        ...globalSearchData,
                        ...colObjSearchData.filter(d => !ids.has(d.id)),
                    ];
                } else {
                    globalSearchData = [...colObjSearchData];
                }
            });

            data = [...globalSearchData];
        } else {
            const isDateType = ['DATE', 'DATETIME'].includes((col.format?.formatType || '').toUpperCase());
            const hasFormat = !isNull(col.format?.keyFormat);

            if (isDateType && hasFormat) {
                if (!isNull(col.colObj)) {
                    data = data.filter(obj =>
                        Object.keys(obj).some(key =>
                            col.colObj.some(x => x?.toLowerCase() === key.toLowerCase()) &&
                            !isNull(obj[key]) &&
                            formatDate(new Date(obj[key]), col.format.keyFormat).toLowerCase().includes(col.searchQuery.toLowerCase())
                        )
                    );
                } else {
                    data = data.filter(obj =>
                        objectKeyMatch(obj, col.colName) &&
                        formatDate(new Date(obj[col.colName]), col.format.keyFormat).toLowerCase().includes(col.searchQuery.toLowerCase())
                    );
                }
            } else {
                if (!isNull(col.colObj)) {
                    data = data.filter(obj =>
                        Object.keys(obj).some(key =>
                            col.colObj.some(x => x?.toLowerCase() === key.toLowerCase()) &&
                            matchesSearch(obj[key])
                        )
                    );
                } else {
                    data = data.filter(obj =>
                        objectKeyMatch(obj, col.colName) &&
                        matchesSearch(obj[col.colName])
                    );
                }
            }
        }
    });

    const dataLength = data.length;
    const pageRows = context.state.pageRows;

    context.setState(
        {
            rowsData: data,
            activePage: 1,
            totalRows: dataLength,
            firstRow: 0,
            currentPageRows: pageRows,
            toggleState: !context.state.toggleState
        },
        () => context.setPagingVariables()
    );
};


