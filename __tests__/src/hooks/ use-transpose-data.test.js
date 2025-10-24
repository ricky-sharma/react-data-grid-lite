import { renderHook, act } from '@testing-library/react';
import * as commonHelpers from '../../../src/helpers/common';
import * as compUtils from '../../../src/utils/component-utils';
import { useTransposeData } from '../../../src/hooks/use-transpose-data';

describe('useTransposeData', () => {
    let mockSetState;

    beforeEach(() => {
        mockSetState = jest.fn(fn => fn({}));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('does nothing if transposeColumnName is missing', () => {
        const state = {
            transposeColumnName: null,
            processedData: [{ a: 1 }],
            processedColumns: [{ name: 'a', alias: 'A' }],
            showTransposeMenuItem: true,
        };
        const { rerender } = renderHook(
            ({ st, setSt }) => useTransposeData(st, setSt),
            { initialProps: { st: state, setSt: mockSetState } }
        );

        expect(mockSetState).not.toHaveBeenCalled();

        const state2 = {
            ...state,
            transposeColumnName: 'a',
            showTransposeMenuItem: false,
        };
        rerender({ st: state2, setSt: mockSetState });
        expect(mockSetState).not.toHaveBeenCalled();
    });

    it('transposes data correctly and calls setState (happy path)', () => {
        jest.spyOn(commonHelpers, 'capitalize').mockImplementation(x => `Cap(${x})`);
        jest.spyOn(compUtils, 'normalizeRowKeys').mockImplementation(row => ({ ...row }));
        jest.spyOn(compUtils, 'resolveFormattedValue').mockImplementation((row, col) => {
            return `${col.name}:${row[col.name]}`;
        });

        const processedData = [
            { key: 'X', col1: 'v11', col2: 'v12' },
            { key: 'Y', col1: 'v21', col2: 'v22' },
        ];
        const processedColumns = [
            { name: 'key', alias: 'KeyCol', hidden: false, hideable: false },
            { name: 'col1', alias: 'Column 1', hidden: false, hideable: false },
            { name: 'col2', alias: 'Column 2', hidden: false, hideable: false },
        ];

        const state = {
            transposeColumnName: 'key',
            processedData,
            processedColumns,
            showTransposeMenuItem: true,
            enableRtl: false,
            actionColumnAlign: null,
            enableCellEdit: false,
            enableColumnDrag: false,
            enableColumnResize: false,
            enableSorting: false,
            rowSelectColumnAlign: null,
            showColumnMenu: false,
            showToolbarMenu: false,
            enableColumnSearch: false,
            enableGlobalSearch: false,
            enableRowSelection: false,
            virtualization: false,
        };

        const { rerender } = renderHook(
            ({ st, setSt }) => useTransposeData(st, setSt),
            { initialProps: { st: state, setSt: mockSetState } }
        );

        rerender({ st: state, setSt: mockSetState });

        expect(mockSetState).toHaveBeenCalledTimes(1);

        const updateFn = mockSetState.mock.calls[0][0];
        const prev = {
            activePage: 1,
            noOfPages: 1,
            lastPageRows: [],
            pageRows: [],
        };

        const newState = updateFn(prev);

        expect(newState.transposeColumns).toBeDefined();
        expect(newState.transposeColumns.length).toBe(1 + processedData.length);
        expect(newState.transposeColumns[0]).toMatchObject({
            name: 'field',
            alias: 'Field',
            resizable: true,
            draggable: false,
            editable: false,
        });
        expect(newState.transposeColumns[1]).toMatchObject({
            name: `X_0`,
            alias: `key:X`,
        });
        expect(newState.transposeColumns[2]).toMatchObject({
            name: `Y_1`,
            alias: `key:Y`,
        });

        expect(newState.transposeData).toBeDefined();
        expect(newState.transposeData.length).toBe(2);
        const row0 = newState.transposeData[0];
        expect(row0.field).toBe('Cap(Column 1)');
        expect(row0['X_0']).toBe('col1:v11');
        expect(row0['Y_1']).toBe('col1:v21');

        const row1 = newState.transposeData[1];
        expect(row1.field).toBe('Cap(Column 2)');
        expect(row1['X_0']).toBe('col2:v12');
        expect(row1['Y_1']).toBe('col2:v22');
        expect(newState.rowsData).toEqual(newState.transposeData);
        expect(newState.totalRows).toBe(2);
        expect(newState.columns).toEqual(newState.transposeColumns);
        expect(newState.currentPageRows).toBe(prev.activePage === prev.noOfPages ? prev.lastPageRows : prev.pageRows);
    });

    it('does nothing if transposeColumn is not found among processedColumns', () => {
        const state = {
            transposeColumnName: 'nonexistent',
            processedData: [{ colA: 1 }],
            processedColumns: [{ name: 'colA' }],
            showTransposeMenuItem: true,
            enableRtl: false,
            actionColumnAlign: null,
            enableCellEdit: false,
            enableColumnDrag: false,
            enableColumnResize: false,
            enableSorting: false,
            rowSelectColumnAlign: null,
            showColumnMenu: false,
            showToolbarMenu: false,
            enableColumnSearch: false,
            enableGlobalSearch: false,
            enableRowSelection: false,
            virtualization: false,
        };

        const { rerender } = renderHook(
            ({ st, setSt }) => useTransposeData(st, setSt),
            { initialProps: { st: state, setSt: mockSetState } }
        );
        rerender({ st: state, setSt: mockSetState });

        expect(mockSetState).not.toHaveBeenCalled();
    });

    it('uses val.alias if defined, else falls back to val.name when creating transposeColumns', () => {
        const mockSetState = jest.fn(fn =>
            fn({
                activePage: 1,
                noOfPages: 1,
                lastPageRows: [],
                pageRows: [],
            })
        );

        jest.spyOn(commonHelpers, 'capitalize').mockImplementation(str => `Cap(${str})`);
        jest.spyOn(compUtils, 'normalizeRowKeys').mockImplementation(row => ({ ...row }));
        jest.spyOn(compUtils, 'resolveFormattedValue').mockImplementation((row, col) => {
            if (col.name === 'key') {
                return row.key === 'K1' ? 'alias-1' : undefined;
            }
            return `${col.name}:${row[col.name]}`;
        });

        const processedData = [
            { key: 'K1', colA: 'A1' },
            { key: 'K2', colA: 'A2' },
        ];

        const processedColumns = [
            { name: 'key', alias: 'KeyAlias', hidden: false, hideable: false },
            { name: 'colA', alias: 'Column A', hidden: false, hideable: false },
        ];

        const state = {
            transposeColumnName: 'key',
            processedData,
            processedColumns,
            showTransposeMenuItem: true,

            enableRtl: false,
            actionColumnAlign: null,
            enableCellEdit: false,
            enableColumnDrag: false,
            enableColumnResize: false,
            enableSorting: false,
            rowSelectColumnAlign: null,
            showColumnMenu: false,
            showToolbarMenu: false,
            enableColumnSearch: false,
            enableGlobalSearch: false,
            enableRowSelection: false,
            virtualization: false,
        };

        renderHook(() => useTransposeData(state, mockSetState));

        expect(mockSetState).toHaveBeenCalledTimes(1);

        const resultState = mockSetState.mock.calls[0][0]({
            activePage: 1,
            noOfPages: 1,
            lastPageRows: [],
            pageRows: [],
        });

        const pivotCols = resultState.transposeColumns.slice(1);

        expect(pivotCols.length).toBe(2);

        expect(pivotCols[0].name).toBe('K1_0');
        expect(pivotCols[0].alias).toBe('alias-1');

        expect(pivotCols[1].name).toBe('K2_1');
        expect(pivotCols[1].alias).toBe('K2_1');
    });

    it('returns empty array for normalizedData when processedData is undefined', () => {
        const state = {
            processedData: undefined,
            processedColumns: [{ name: 'col1' }],
            transposeColumnName: 'col1',
            showTransposeMenuItem: false,
        };
        const mockSetState = jest.fn();

        const { result } = renderHook(() => useTransposeData(state, mockSetState));

        expect(mockSetState).not.toHaveBeenCalled();
    });

    it('returns empty array for columnsByName when processedColumns is undefined', () => {
        const state = {
            processedData: [{ col1: 'value' }],
            processedColumns: undefined,
            transposeColumnName: 'col1',
            showTransposeMenuItem: false,
        };
        const mockSetState = jest.fn();

        renderHook(() => useTransposeData(state, mockSetState));
        expect(mockSetState).not.toHaveBeenCalled();
    });

    it('uses alias if defined, else falls back to name for field property', () => {
        const processedData = [
            { id: 1, col1: 'val1', col2: 'valX' },
            { id: 2, col1: 'val2', col2: 'valY' },
        ];

        const processedColumns = [
            { name: 'id', alias: 'ID', hidden: false, hideable: false },
            { name: 'col1', alias: 'Alias1', hidden: false, hideable: false },
            { name: 'col2', hidden: false, hideable: false },
        ];

        const state = {
            transposeColumnName: 'id',
            processedData,
            processedColumns,
            showTransposeMenuItem: true,
            enableRtl: false,
            actionColumnAlign: null,
            enableCellEdit: false,
            enableColumnDrag: false,
            enableColumnResize: false,
            enableSorting: false,
            rowSelectColumnAlign: null,
            showColumnMenu: false,
            showToolbarMenu: false,
            enableColumnSearch: false,
            enableGlobalSearch: false,
            enableRowSelection: false,
            virtualization: false,
        };

        const mockSetState = jest.fn(fn =>
            fn({
                activePage: 1,
                noOfPages: 1,
                lastPageRows: [],
                pageRows: [],
            })
        );

        jest.spyOn(commonHelpers, 'capitalize').mockImplementation(str => `Cap(${str})`);
        jest.spyOn(compUtils, 'normalizeRowKeys').mockImplementation(row => row);
        jest.spyOn(compUtils, 'resolveFormattedValue').mockImplementation((row, col) => row[col.name]);

        renderHook(() => useTransposeData(state, mockSetState));

        expect(mockSetState).toHaveBeenCalledTimes(1);

        const newState = mockSetState.mock.calls[0][0]({
            activePage: 1,
            noOfPages: 1,
            lastPageRows: [],
            pageRows: [],
        });

        const newRows = newState.transposeData;

        const col1Row = newRows.find(r => r.field === 'Cap(Alias1)');
        expect(col1Row).toBeDefined();

        const col2Row = newRows.find(r => r.field === 'Cap(col2)');
        expect(col2Row).toBeDefined();
    });

});

describe('useTransposeData - currentPageRows logic', () => {
    const baseState = {
        transposeColumnName: 'id',
        showTransposeMenuItem: true,
        enableRtl: false,
        actionColumnAlign: null,
        enableCellEdit: false,
        enableColumnDrag: false,
        enableColumnResize: false,
        enableSorting: false,
        rowSelectColumnAlign: null,
        showColumnMenu: false,
        showToolbarMenu: false,
        enableColumnSearch: false,
        enableGlobalSearch: false,
        enableRowSelection: false,
        virtualization: false,
        processedColumns: [
            { name: 'id', hidden: false, hideable: false },
            { name: 'name', hidden: false, hideable: false },
        ],
        processedData: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
        ],
    };

    it('uses pageRows when not on last page', () => {
        const mockSetState = jest.fn(fn =>
            fn({
                activePage: 1,
                noOfPages: 2,
                pageRows: ['page-row-1'],
                lastPageRows: ['last-page-row'],
            })
        );

        renderHook(() => useTransposeData(baseState, mockSetState));

        expect(mockSetState).toHaveBeenCalled();

        const resultState = mockSetState.mock.calls[0][0]({
            activePage: 1,
            noOfPages: 2,
            pageRows: ['page-row-1'],
            lastPageRows: ['last-page-row'],
        });

        expect(resultState.currentPageRows).toEqual(['page-row-1']);
    });

    it('uses lastPageRows when on last page', () => {
        const mockSetState = jest.fn(fn =>
            fn({
                activePage: 2,
                noOfPages: 2,
                pageRows: ['page-row-2'],
                lastPageRows: ['last-page-row'],
            })
        );

        renderHook(() => useTransposeData(baseState, mockSetState));

        expect(mockSetState).toHaveBeenCalled();

        const resultState = mockSetState.mock.calls[0][0]({
            activePage: 2,
            noOfPages: 2,
            pageRows: ['page-row-2'],
            lastPageRows: ['last-page-row'],
        });

        expect(resultState.currentPageRows).toEqual(['last-page-row']);
    });
});