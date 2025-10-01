import { useEffect, useMemo } from 'react';
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
        virtualization,
        showTransposeMenuItem
    } = state;

    const normalizedData = useMemo(() => {
        return processedData?.map(row => normalizeRowKeys(row)) || [];
    }, [processedData]);

    const columnsByName = useMemo(() => {
        return processedColumns?.reduce((acc, col) => {
            acc[col.name] = col;
            return acc;
        }, {}) || [];
    }, [processedColumns]);

    const pivotKeys = useMemo(() => {
        return normalizedData?.map((row, index) => `${row[transposeColumnName?.toLowerCase()]}_${index}`) || [];
    }, [normalizedData, transposeColumnName]);

    useEffect(() => {
        if (!transposeColumnName || !processedData?.length || !processedColumns?.length || !showTransposeMenuItem) {
            return;
        }

        const transposeColumn = processedColumns?.find(col => col?.name === transposeColumnName);

        if (!transposeColumn)
            return;

        const allFields = processedColumns?.filter(col => !col?.hidden && !col?.hideable)?.map(col => col?.name);
        const transposedFields = allFields.filter(f => f !== transposeColumnName);
        const pivotValues = normalizedData.map((row, i) => {
            return {
                name: pivotKeys[i],
                alias: resolveFormattedValue(row, transposeColumn)
            };
        });

        const commonProps = {
            resizable: true,
            draggable: false,
            editable: false
        };

        const newColumns = [
            {
                name: 'field',
                alias: 'Field',
                ...commonProps
            },
            ...pivotValues.map((val, index) => ({
                name: String(val?.name),
                alias: String(val?.alias ?? val?.name),
                ...commonProps
            })),
        ];

        const newRows = transposedFields.map(fieldName => {
            const column = columnsByName[fieldName];
            const row = {
                field: capitalize(column?.alias ?? column?.name)
            };

            for (let i = 0; i < normalizedData.length; i++) {
                const rowData = normalizedData[i];
                const key = pivotKeys[i];
                row[key] = resolveFormattedValue(rowData, column);
            }
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