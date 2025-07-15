import { act, renderHook } from '@testing-library/react';
import { useCellRevert } from '../../../src/hooks/use-cell-revert';

describe('useCellRevert', () => {
    let cellChangedFocusRef;

    beforeEach(() => {
        cellChangedFocusRef = { current: null };
    });

    it('should revert changes correctly and update state', () => {
        const mockSetState = jest.fn();
        const dataReceivedRef = {
            current: [
                { name: 'Alice', age: 25, __$index__: 0 }
            ]
        };

        const initialRow = {
            name: 'Bob',
            age: 30,
            __$index__: 0
        };

        const editableColumns = [
            { colName: 'name' },
            { colName: 'age' }
        ];

        const { result } = renderHook(() =>
            useCellRevert({ cellChangedFocusRef })
        );

        act(() => {
            result.current.configure({
                editingCell: { rowIndex: 0, baseRowIndex: 0 },
                editingCellData: { name: 'Alice', age: 25 },
                rowsData: [initialRow],
                setState: mockSetState,
                dataReceivedRef
            });

            result.current.revertChanges(editableColumns);
        });
        expect(cellChangedFocusRef.current).toEqual({ rowIndex: 0, baseRowIndex: 0 });
        expect(mockSetState).toHaveBeenCalledTimes(1);
        const newState = mockSetState.mock.calls[0][0]({});

        expect(newState.rowsData[0]).toEqual({ name: 'Alice', age: 25, __$index__: 0 });
        expect(newState.editingCell).toBeNull();
        expect(newState.editingCellData).toBeNull();
        expect(dataReceivedRef.current[0]).toEqual({ name: 'Alice', age: 25, __$index__: 0 });
    });

    it('should do nothing if row index is not found', () => {
        const mockSetState = jest.fn();

        const { result } = renderHook(() =>
            useCellRevert({ cellChangedFocusRef })
        );

        act(() => {
            result.current.configure({
                editingCell: { rowIndex: 0, baseRowIndex: 99 },
                editingCellData: { name: 'Alice' },
                rowsData: [{ name: 'Bob', __$index__: 0 }],
                setState: mockSetState,
                dataReceivedRef: { current: [] }
            });

            result.current.revertChanges([{ colName: 'name' }]);
        });

        expect(mockSetState).not.toHaveBeenCalled();
        expect(cellChangedFocusRef.current).toEqual({ rowIndex: 0, baseRowIndex: 99 });
    });

    it('should skip reverting if editableColumns is empty', () => {
        const mockSetState = jest.fn();

        const { result } = renderHook(() =>
            useCellRevert({ cellChangedFocusRef })
        );

        act(() => {
            result.current.configure({
                editingCell: { rowIndex: 0, baseRowIndex: 0 },
                editingCellData: { name: 'Alice' },
                rowsData: [{ name: 'Bob', __$index__: 0 }],
                setState: mockSetState,
                dataReceivedRef: { current: [] }
            });

            result.current.revertChanges([]);
        });

        expect(mockSetState).toHaveBeenCalledTimes(1);
        const newState = mockSetState.mock.calls[0][0]({});
        expect(newState.rowsData[0].name).toBe('Bob');
    });

    it('should skip updating dataReceivedRef if fullDataRow is falsy', () => {
        const mockSetState = jest.fn();
        const dataReceivedRef = {
            current: [null]
        };

        const initialRow = {
            name: 'Bob',
            age: 30,
            __$index__: 0
        };

        const editableColumns = [
            { colName: 'name' }
        ];

        const { result } = renderHook(() =>
            useCellRevert({ cellChangedFocusRef: { current: null } })
        );

        act(() => {
            result.current.configure({
                editingCell: { rowIndex: 0, baseRowIndex: 0 },
                editingCellData: { name: 'Alice' },
                rowsData: [initialRow],
                setState: mockSetState,
                dataReceivedRef
            });

            result.current.revertChanges(editableColumns);
        });

        expect(mockSetState).toHaveBeenCalledTimes(1);
        const newState = mockSetState.mock.calls[0][0]({});
        expect(newState.rowsData[0].name).toBe('Alice');
        expect(dataReceivedRef.current[0]).toBeNull();
    });

    it('should skip updating dataReceivedRef if dataReceivedRef.current is not an array', () => {
        const mockSetState = jest.fn();
        const dataReceivedRef = {
            current: {}
        };

        const initialRow = {
            name: 'Bob',
            age: 30,
            __$index__: 0
        };

        const editableColumns = [
            { colName: 'name' }
        ];

        const cellChangedFocusRef = { current: null };

        const { result } = renderHook(() =>
            useCellRevert({ cellChangedFocusRef })
        );

        act(() => {
            result.current.configure({
                editingCell: { rowIndex: 0, baseRowIndex: 0 },
                editingCellData: { name: 'Alice' },
                rowsData: [initialRow],
                setState: mockSetState,
                dataReceivedRef
            });

            result.current.revertChanges(editableColumns);
        });

        expect(mockSetState).toHaveBeenCalledTimes(1);
        const updatedState = mockSetState.mock.calls[0][0]({});
        expect(updatedState.rowsData[0].name).toBe('Alice');
        expect(dataReceivedRef.current).toEqual({});
    });

    it('should skip reverting column if editingCellData does not contain the column', () => {
        const mockSetState = jest.fn();
        const dataReceivedRef = {
            current: [{ name: 'ShouldNotChange', age: 25 }]
        };

        const initialRow = {
            name: 'Bob',
            age: 30,
            __$index__: 0
        };

        const editableColumns = [
            { colName: 'name' },
            { colName: 'age' }
        ];

        const cellChangedFocusRef = { current: null };

        const { result } = renderHook(() =>
            useCellRevert({ cellChangedFocusRef })
        );

        act(() => {
            result.current.configure({
                editingCell: { rowIndex: 0, baseRowIndex: 0 },
                editingCellData: {
                    age: 24
                },
                rowsData: [initialRow],
                setState: mockSetState,
                dataReceivedRef
            });

            result.current.revertChanges(editableColumns);
        });

        expect(mockSetState).toHaveBeenCalledTimes(1);
        const newState = mockSetState.mock.calls[0][0]({});
        expect(newState.rowsData[0].name).toBe('Bob');
        expect(newState.rowsData[0].age).toBe(24);
        expect(dataReceivedRef.current[0]).toEqual({ name: 'ShouldNotChange', age: 24 });
    });

    it('should skip setting focus ref if cellChangedFocusRef is not provided', () => {
        const mockSetState = jest.fn();
        const dataReceivedRef = {
            current: [{ name: 'Bob', age: 30 }]
        };

        const initialRow = {
            name: 'Bob',
            age: 30,
            __$index__: 0
        };

        const editableColumns = [
            { colName: 'name' }
        ];

        const { result } = renderHook(() =>
            useCellRevert({ cellChangedFocusRef: undefined })
        );

        act(() => {
            result.current.configure({
                editingCell: { rowIndex: 0, baseRowIndex: 0 },
                editingCellData: { name: 'Alice' },
                rowsData: [initialRow],
                setState: mockSetState,
                dataReceivedRef
            });

            result.current.revertChanges(editableColumns);
        });

        expect(mockSetState).toHaveBeenCalledTimes(1);
        const updatedState = mockSetState.mock.calls[0][0]({});
        expect(updatedState.rowsData[0].name).toBe('Alice');
    });

    it('should safely use default no-op setState if not provided', () => {
        const dataReceivedRef = {
            current: [{ name: 'Bob', age: 30 }]
        };

        const initialRow = {
            name: 'Bob',
            age: 30,
            __$index__: 0
        };

        const editableColumns = [{ colName: 'name' }];
        const cellChangedFocusRef = { current: null };
        const { result } = renderHook(() =>
            useCellRevert({ cellChangedFocusRef })
        );

        act(() => {
            result.current.configure({
                editingCell: { rowIndex: 0, baseRowIndex: 0 },
                editingCellData: { name: 'Alice' },
                rowsData: [initialRow],
                dataReceivedRef
            });
            result.current.revertChanges(editableColumns);
        });

        expect(dataReceivedRef.current[0].name).toBe('Alice');
        expect(cellChangedFocusRef.current).toEqual({
            rowIndex: 0,
            baseRowIndex: 0
        });
    });
});