import { renderHook, act } from '@testing-library/react';
import { useMoveColumn } from '../../../src/hooks/use-move-column';

describe('useMoveColumn', () => {
    let mockSetState;

    const baseColumns = [
        { name: 'A', displayIndex: 0, order: 1, draggable: true, fixed: false },
        { name: 'B', displayIndex: 1, order: 2, draggable: true, fixed: false },
        { name: 'C', displayIndex: 2, order: 3, draggable: true, fixed: false },
    ];

    beforeEach(() => {
        mockSetState = jest.fn(fn => {
            return fn({ columns: baseColumns, toggleColumnMove: false });
        });
    });

    it('returns null when column is not found', () => {
        const state = { columns: undefined };
        const { result } = renderHook(() => useMoveColumn(state, mockSetState));

        const res = result.current.moveColumn('right', 'Z');

        expect(res).toBeNull();
        expect(mockSetState).not.toHaveBeenCalled();
    });

    it('moves column right successfully', () => {
        const state = { columns: baseColumns };
        const { result } = renderHook(() => useMoveColumn(state, mockSetState));

        const newOrder = result.current.moveColumn('right', 'A');

        expect(newOrder).toEqual([
            { name: 'B', order: 1 },
            { name: 'A', order: 2 },
            { name: 'C', order: 3 },
        ]);

        expect(mockSetState).toHaveBeenCalled();
    });

    it('moves column left successfully', () => {
        const state = { columns: baseColumns };
        const { result } = renderHook(() => useMoveColumn(state, mockSetState));

        const newOrder = result.current.moveColumn('left', 'C');

        expect(newOrder).toEqual([
            { name: 'A', order: 1 },
            { name: 'C', order: 2 },
            { name: 'B', order: 3 },
        ]);

        expect(mockSetState).toHaveBeenCalled();
    });

    it('does not move to non-draggable or hidden/hiddenable columns', () => {
        const columns = [
            { name: 'A', displayIndex: 0, order: 1, draggable: true, fixed: false },
            { name: 'B', displayIndex: 1, order: 2, draggable: false, fixed: false, hidden: false },
            { name: 'C', displayIndex: 2, order: 3, draggable: true, fixed: false },
        ];

        const state = { columns };
        const { result } = renderHook(() => useMoveColumn(state, mockSetState));

        const newOrder = result.current.moveColumn('right', 'A');

        expect(newOrder).toEqual([
            { name: 'C', order: 1 },
            { name: 'B', order: 2 },
            { name: 'A', order: 3 },
        ]);

        expect(mockSetState).toHaveBeenCalled();
    });

    it('does not move when fixed columns mismatch', () => {
        const columns = [
            { name: 'A', displayIndex: 0, order: 1, draggable: true, fixed: 'left' },
            { name: 'B', displayIndex: 1, order: 2, draggable: true, fixed: 'right' },
        ];

        const state = { columns };
        const { result } = renderHook(() => useMoveColumn(state, mockSetState));

        const newOrder = result.current.moveColumn('right', 'A');

        expect(newOrder).toBeNull();
        expect(mockSetState).not.toHaveBeenCalled();
    });

    it('calls setState with updated columns and toggles toggleColumnMove', () => {
        const state = { columns: baseColumns, toggleColumnMove: false };
        const { result } = renderHook(() => useMoveColumn(state, mockSetState));

        act(() => {
            result.current.moveColumn('right', 'A');
        });

        expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

        const updateFn = mockSetState.mock.calls[0][0];
        const updatedState = updateFn(state);

        expect(updatedState.columns).toEqual([
            expect.objectContaining({ name: 'B', displayIndex: 0, order: 1 }),
            expect.objectContaining({ name: 'A', displayIndex: 1, order: 2 }),
            expect.objectContaining({ name: 'C', displayIndex: 2, order: 3 }),
        ]);

        expect(updatedState.toggleColumnMove).toBe(true);
    });

    it('skips over missing displayIndex and finds next valid column', () => {
        const columns = [
            { name: 'A', displayIndex: 0, order: 1, draggable: true, fixed: false },
            { name: 'C', displayIndex: 2, order: 3, draggable: true, fixed: false },
        ];

        const state = { columns };
        const mockSetState = jest.fn(fn => fn({ ...state, toggleColumnMove: false }));

        const { result } = renderHook(() => useMoveColumn(state, mockSetState));

        const newOrder = result.current.moveColumn('right', 'A');

        expect(newOrder).toEqual([
            { name: 'C', order: 1 },
            { name: 'A', order: 2 },
        ]);

        expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
    });

    it('moves left, skips over non-draggable and missing columns using targetIndex - 1', () => {
        const columns = [
            { name: 'A', displayIndex: 0, order: 1, draggable: true, fixed: false },
            { name: 'C', displayIndex: 2, order: 2, draggable: false, fixed: false },
            { name: 'D', displayIndex: 3, order: 3, draggable: true, fixed: false },
        ];

        const state = { columns };
        const mockSetState = jest.fn(fn => fn({ ...state, toggleColumnMove: false }));

        const { result } = renderHook(() => useMoveColumn(state, mockSetState));

        const newOrder = result.current.moveColumn('left', 'D');

        expect(newOrder).toEqual([
            { name: 'D', order: 1 },
            { name: 'C', order: 2 },
            { name: 'A', order: 3 },
        ]);

        expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
    });

    it('uses state.enableColumnDrag when candidate.draggable is undefined', () => {
        const columns = [
            { name: 'A', displayIndex: 0, order: 1, fixed: false },
            { name: 'B', displayIndex: 1, order: 2, draggable: true, fixed: false },
        ];

        const state = {
            columns,
            enableColumnDrag: true,
        };

        const mockSetState = jest.fn(fn => fn({ ...state, toggleColumnMove: false }));

        const { result } = renderHook(() => useMoveColumn(state, mockSetState));
        const newOrder = result.current.moveColumn('left', 'B');

        expect(newOrder).toEqual([
            { name: 'B', order: 1 },
            { name: 'A', order: 2 },
        ]);

        expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
    });

    it('skips candidate column when draggable is undefined and enableColumnDrag is false', () => {
        const columns = [
            { name: 'A', displayIndex: 0, order: 1, fixed: false },
            { name: 'B', displayIndex: 1, order: 2, draggable: true, fixed: false },
        ];

        const state = {
            columns,
            enableColumnDrag: false,
        };

        const mockSetState = jest.fn(fn => fn({ ...state, toggleColumnMove: false }));

        const { result } = renderHook(() => useMoveColumn(state, mockSetState));

        const newOrder = result.current.moveColumn('left', 'B');

        expect(newOrder).toBeNull();
        expect(mockSetState).not.toHaveBeenCalled();
    });

    it('excludes hidden columns from newColumnOrder', () => {
        const columns = [
            { name: 'A', displayIndex: 0, order: 1, draggable: true, fixed: false },
            { name: 'B', displayIndex: 1, order: 2, draggable: true, fixed: false, hidden: true },
            { name: 'C', displayIndex: 2, order: 3, draggable: true, fixed: false },
        ];

        const state = {
            columns,
            enableColumnDrag: true,
        };

        const mockSetState = jest.fn(fn => fn({ ...state, toggleColumnMove: false }));

        const { result } = renderHook(() => useMoveColumn(state, mockSetState));
        const newOrder = result.current.moveColumn('left', 'C');
        expect(newOrder).toEqual([
            { name: 'C', order: 1 },
            { name: 'A', order: 2 },
        ]);

        expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
    });

    it('skips hidden column at start of list', () => {
        const columns = [
            { name: 'HiddenCol', displayIndex: 0, order: 1, draggable: true, fixed: false, hidden: true },
            { name: 'A', alias:'A1', displayIndex: 1, order: 2, draggable: true, fixed: false },
            { name: 'B', alias: 'B1', displayIndex: 2, order: 3, draggable: true, fixed: false },
        ];

        const state = {
            columns,
            enableColumnDrag: true,
        };

        const mockSetState = jest.fn(fn => fn({ ...state, toggleColumnMove: false }));

        const { result } = renderHook(() => useMoveColumn(state, mockSetState));

        const newOrder = result.current.moveColumn('right', 'A');

        expect(newOrder).toEqual([
            { alias: 'B1', name: 'B', order: 1 },
            { alias: 'A1', name: 'A', order: 2 },
        ]);
    });

});
