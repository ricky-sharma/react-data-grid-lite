import { act, renderHook } from '@testing-library/react';
import { useCellCommit } from '../../../src/hooks/use-cell-commit';

describe('useCellCommit', () => {
    it('should call onCellUpdate and reset refs when exiting and cellChangedRef is true', () => {
        const mockSetState = jest.fn();
        const mockOnCellUpdate = jest.fn();
        const cellChangedRef = { current: true };
        const cellChangedFocusRef = { current: null };

        const { result } = renderHook(() =>
            useCellCommit({ cellChangedRef, cellChangedFocusRef })
        );

        act(() => {
            result.current.configure({
                editingCell: { rowIndex: 0, columnName: 'name' },
                setState: mockSetState,
                onCellUpdate: mockOnCellUpdate
            });

            result.current.commitChanges(
                [{ colName: 'name' }],
                { name: 'Alice', __$index__: 0 },
                true
            );
        });

        expect(cellChangedFocusRef.current).toEqual({ rowIndex: 0, columnName: 'name' });
        expect(mockSetState).toHaveBeenCalledTimes(1);
        expect(mockOnCellUpdate).toHaveBeenCalledWith({
            rowIndex: 0,
            editedColumns: [{ colName: 'name', value: 'Alice' }],
            updatedRow: { name: 'Alice', __$index__: 0 }
        });
        expect(cellChangedRef.current).toBe(false);
    });

    it('should not call onCellUpdate if not exiting', () => {
        const mockSetState = jest.fn();
        const mockOnCellUpdate = jest.fn();
        const cellChangedRef = { current: true };
        const cellChangedFocusRef = { current: null };

        const { result } = renderHook(() =>
            useCellCommit({ cellChangedRef, cellChangedFocusRef })
        );

        act(() => {
            result.current.configure({
                editingCell: { rowIndex: 0, columnName: 'name' },
                setState: mockSetState,
                onCellUpdate: mockOnCellUpdate
            });

            result.current.commitChanges(
                [{ colName: 'name' }],
                { name: 'Bob', __$index__: 1 },
                false
            );
        });

        expect(cellChangedFocusRef.current).toBeNull();
        expect(mockSetState).toHaveBeenCalledTimes(1);
        expect(mockOnCellUpdate).not.toHaveBeenCalled();
        expect(cellChangedRef.current).toBe(true);
    });

    it('should not call onCellUpdate if cellChangedRef is false', () => {
        const mockSetState = jest.fn();
        const mockOnCellUpdate = jest.fn();
        const cellChangedRef = { current: false };
        const cellChangedFocusRef = { current: null };

        const { result } = renderHook(() =>
            useCellCommit({ cellChangedRef, cellChangedFocusRef })
        );

        act(() => {
            result.current.configure({
                editingCell: { rowIndex: 1, columnName: 'age' },
                setState: mockSetState,
                onCellUpdate: mockOnCellUpdate
            });

            result.current.commitChanges(
                [{ colName: 'age' }],
                { age: 28, __$index__: 1 },
                true
            );
        });

        expect(mockOnCellUpdate).not.toHaveBeenCalled();
        expect(mockSetState).toHaveBeenCalledTimes(1);
    });

    it('should not throw if onCellUpdate is not a function', () => {
        const mockSetState = jest.fn();
        const cellChangedRef = { current: true };
        const cellChangedFocusRef = { current: null };

        const { result } = renderHook(() =>
            useCellCommit({ cellChangedRef, cellChangedFocusRef })
        );

        act(() => {
            result.current.configure({
                editingCell: { rowIndex: 2, columnName: 'id' },
                setState: mockSetState,
                onCellUpdate: null
            });

            expect(() =>
                result.current.commitChanges(
                    [{ colName: 'id' }],
                    { id: 123, __$index__: 2 },
                    true
                )
            ).not.toThrow();
        });

        expect(mockSetState).toHaveBeenCalled();
    });

    it('should use default no-op setState if not configured', () => {
        const cellChangedRef = { current: true };
        const cellChangedFocusRef = { current: null };

        const { result } = renderHook(() =>
            useCellCommit({ cellChangedRef, cellChangedFocusRef })
        );

        act(() => {
            result.current.configure({
                editingCell: { rowIndex: 0, columnName: 'name' }
            });

            expect(() =>
                result.current.commitChanges(
                    [{ colName: 'name' }],
                    { name: 'Fallback', __$index__: 0 },
                    true
                )
            ).not.toThrow();
        });
        expect(cellChangedFocusRef.current).toEqual({ rowIndex: 0, columnName: 'name' });
    });

    it('should retain prev.editingCell and prev.editingCellData when not exiting', () => {
        const cellChangedRef = { current: true };
        const cellChangedFocusRef = { current: null };

        const mockSetState = jest.fn();
        const prevState = {
            editingCell: { rowIndex: 1, columnName: 'name' },
            editingCellData: { name: 'Bob' }
        };

        const { result } = renderHook(() =>
            useCellCommit({ cellChangedRef, cellChangedFocusRef })
        );

        act(() => {
            result.current.configure({
                setState: mockSetState,
                editingCell: prevState.editingCell,
                onCellUpdate: jest.fn()
            });

            result.current.commitChanges(
                [{ colName: 'name' }],
                { name: 'Bob', __$index__: 1 },
                false
            );
        });

        expect(mockSetState).toHaveBeenCalledTimes(1);
        const updater = mockSetState.mock.calls[0][0];
        const newState = updater(prevState);

        expect(newState.editingCell).toEqual(prevState.editingCell);
        expect(newState.editingCellData).toEqual(prevState.editingCellData);
    });
});