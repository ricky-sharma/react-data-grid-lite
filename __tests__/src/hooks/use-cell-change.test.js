import { act, renderHook } from '@testing-library/react';
import { useCellChange } from '../../../src/hooks/use-cell-change';

describe('useCellChange', () => {
    let cellChangedRef;

    beforeEach(() => {
        cellChangedRef = { current: false };
    });

    const setup = () => renderHook(() => useCellChange({ cellChangedRef }));

    it('should update cell value and mark cell as changed', () => {
        const mockSetState = jest.fn();
        const dataReceivedRef = {
            current: [{ name: 'Alice' }, { name: 'Bob' }]
        };

        const { result } = setup();

        act(() => {
            result.current.configure({
                editingCell: { baseRowIndex: 1 },
                editingCellData: {},
                rowsData: [
                    { __$index__: 0, name: 'Alice' },
                    { __$index__: 1, name: 'Bob' }
                ],
                dataReceivedRef,
                setState: mockSetState
            });

            result.current.onCellChange({ target: { value: 'Charlie' } }, null, 'name');
        });

        expect(mockSetState).toHaveBeenCalledTimes(1);
        const updater = mockSetState.mock.calls[0][0];
        const resultState = updater({ editingCellData: {} });

        expect(resultState.rowsData[1].name).toBe('Charlie');
        expect(resultState.editingCellData).toEqual({ name: 'Bob' }); // original value
        expect(dataReceivedRef.current[1].name).toBe('Charlie');
        expect(cellChangedRef.current).toBe(true);
    });

    it('should skip if row index not found', () => {
        const mockSetState = jest.fn();
        const { result } = setup();

        act(() => {
            result.current.configure({
                editingCell: { baseRowIndex: 99 },
                editingCellData: {},
                rowsData: [{ __$index__: 0, name: 'Alice' }],
                setState: mockSetState
            });

            result.current.onCellChange({ target: { value: 'X' } }, null, 'name');
        });

        expect(mockSetState).not.toHaveBeenCalled();
        expect(cellChangedRef.current).toBe(false);
    });

    it('should skip updating dataReceivedRef if not array', () => {
        const mockSetState = jest.fn();

        const { result } = setup();

        act(() => {
            result.current.configure({
                editingCell: { baseRowIndex: 0 },
                editingCellData: {},
                rowsData: [{ __$index__: 0, name: 'Alice' }],
                dataReceivedRef: { current: null },
                setState: mockSetState
            });

            result.current.onCellChange(null, 'Zoe', 'name');
        });

        expect(mockSetState).toHaveBeenCalled();
        expect(cellChangedRef.current).toBe(true);
    });

    it('should skip fullDataRow update if not found', () => {
        const mockSetState = jest.fn();
        const dataReceivedRef = {
            current: [undefined]
        };

        const { result } = setup();

        act(() => {
            result.current.configure({
                editingCell: { baseRowIndex: 0 },
                editingCellData: {},
                rowsData: [{ __$index__: 0, name: 'Alice' }],
                dataReceivedRef,
                setState: mockSetState
            });

            result.current.onCellChange(null, 'Zoe', 'name');
        });

        expect(mockSetState).toHaveBeenCalled();
        expect(cellChangedRef.current).toBe(true);
    });

    it('should not overwrite editingCellData if alreadySaved is true', () => {
        const mockSetState = jest.fn();

        const { result } = setup();

        act(() => {
            result.current.configure({
                editingCell: { baseRowIndex: 0 },
                editingCellData: { name: 'Alice' },
                rowsData: [{ __$index__: 0, name: 'Alice' }],
                setState: mockSetState
            });

            result.current.onCellChange(null, 'Zoe', 'name');
        });

        const updater = mockSetState.mock.calls[0][0];
        const newState = updater({
            editingCellData: { name: 'Alice' }
        });

        expect(newState.editingCellData).toEqual({ name: 'Alice' });
    });

    it('should handle null e and fallback to value', () => {
        const mockSetState = jest.fn();

        const { result } = setup();

        act(() => {
            result.current.configure({
                editingCell: { baseRowIndex: 0 },
                editingCellData: {},
                rowsData: [{ __$index__: 0, name: 'Alice' }],
                setState: mockSetState
            });

            result.current.onCellChange(null, 'Zoe', 'name');
        });

        const updater = mockSetState.mock.calls[0][0];
        const newState = updater({
            editingCellData: {}
        });

        expect(newState.rowsData[0].name).toBe('Zoe');
    });

    it('should fallback to empty object when editingCellData is undefined', () => {
        const mockSetState = jest.fn();

        const { result } = setup();

        act(() => {
            result.current.configure({
                editingCell: { baseRowIndex: 0 },
                rowsData: [{ __$index__: 0, name: 'Alice' }],
                dataReceivedRef: { current: [{ name: 'Alice' }] },
                setState: mockSetState
            });

            result.current.onCellChange(null, 'Zoe', 'name');
        });

        const updater = mockSetState.mock.calls[0][0];
        const updatedState = updater({ editingCellData: undefined });

        expect(updatedState.rowsData[0].name).toBe('Zoe');
        expect(updatedState.editingCellData).toEqual({ name: 'Alice' });
    });

    it('should not throw when setState is default no-op', () => {
        const cellChangedRef = { current: false };
        const { result } = renderHook(() =>
            useCellChange({ cellChangedRef })
        );
        act(() => {
            result.current.configure({
                editingCell: { baseRowIndex: 0 },
                editingCellData: null,
                rowsData: [{ __$index__: 0, name: 'Alice' }],
                dataReceivedRef: { current: [{ name: 'Alice' }] }
            });
            expect(() => {
                result.current.onCellChange(null, 'Bob', 'name');
            }).not.toThrow();
        });
        expect(cellChangedRef.current).toBe(true);
    });
});
