import { useEffect } from 'react';
import { capitalize } from '../helpers/common';
import { normalizeRowKeys, resolveFormattedValue } from '../utils/component-utils';

export function useTransposeData(state, setState) {
    const {
        transposeColumnName,
        processedData,
        processedColumns,
        enableRtl,
        actionColumnAlign,
        enableCellEdit,
        enableColumnDrag,
        enableColumnResize,
        enableSorting,
        rowSelectColumnAlign,
        showColumnMenu,
        showToolbarMenu,
        enableColumnSearch,
        enableGlobalSearch,
        enableRowSelection,
        virtualization
    } = state;

    useEffect(() => {
        if (!transposeColumnName || !processedData?.length || !processedColumns?.length) {
            return;
        }

        const transposeColumn = processedColumns?.find(col => col?.name === transposeColumnName);

        if (!transposeColumn)
            return;
        const allFields = processedColumns?.filter(col => !col?.hidden && !col?.hideable)?.map(col => col?.name);
        const transposedFields = allFields.filter(f => f !== transposeColumnName);
        const pivotValues = processedData.map(row => {
            const normalizedRow = normalizeRowKeys(row);
            return {
                name: normalizedRow[transposeColumnName?.toLowerCase()],
                alias: resolveFormattedValue(normalizedRow, transposeColumn)
            };
        });

        const newColumns = [
            { name: 'field', alias: 'Field' },
            ...pivotValues.map((val, index) => ({
                name: String(`${val?.name}_${index}`),
                alias: String(val?.alias ?? val?.name),
            })),
        ];

        const newRows = transposedFields.map(fieldName => {
            const column = processedColumns?.find(col => col?.name === fieldName);
            const row = {
                field: capitalize(column?.alias ?? column?.name)
            };
            processedData.forEach((item, index) => {
                row[`${item[transposeColumnName]}_${index}`] = resolveFormattedValue(item, column);
            });
            return row;
        });

        setState(prevState => {
            const { activePage, noOfPages, lastPageRows, pageRows } = prevState;
            return {
                ...prevState,
                transposeData: newRows,
                rowsData: newRows,
                totalRows: newRows.length,
                currentPageRows: activePage === noOfPages ? lastPageRows : pageRows,
                transposeColumns: newColumns,
                columns: newColumns
            };
        });
    }, [
        transposeColumnName,
        processedData,
        processedColumns,
        enableRtl,
        actionColumnAlign,
        enableCellEdit,
        enableColumnDrag,
        enableColumnResize,
        enableSorting,
        rowSelectColumnAlign,
        showColumnMenu,
        showToolbarMenu,
        enableColumnSearch,
        enableGlobalSearch,
        enableRowSelection,
        virtualization
    ]);
}