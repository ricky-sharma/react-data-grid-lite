import { handleHeaderSelectAllChange } from "../../../../src/components/events/handle-header-selectall-change";

describe('handleHeaderSelectAllChange', () => {
    let mockSetState;
    let mockOnSelectAll;
    let mockEvent;
    let initialState;

    beforeEach(() => {
        mockSetState = jest.fn(fn => fn({
            selectedRows: new Set([1, 2]),
            firstRow: 0,
            currentPageRows: 3,
            rowsData: [
                { __$index__: 0 },
                { __$index__: 1 },
                { __$index__: 2 },
            ],
        }));
        mockOnSelectAll = jest.fn();
        mockEvent = { target: { checked: true } };
        initialState = {
            firstRow: 0,
            currentPageRows: 3,
            rowsData: [
                { __$index__: 0 },
                { __$index__: 1 },
                { __$index__: 2 },
            ],
            selectedRows: new Set(),
        };
    });

    it('should select all rows when checkbox is checked', () => {
        handleHeaderSelectAllChange(mockEvent, initialState, mockSetState, mockOnSelectAll);
        expect(mockSetState).toHaveBeenCalledTimes(1);

        const updateFn = mockSetState.mock.calls[0][0];
        const updatedState = updateFn(initialState);

        expect(updatedState.selectedRows).toEqual(new Set([0, 1, 2]));
        expect(mockOnSelectAll).toHaveBeenCalledWith(mockEvent, initialState.rowsData, true);
    });

    it('should deselect all rows when checkbox is unchecked', () => {
        const stateWithSelected = {
            ...initialState,
            selectedRows: new Set([0, 1, 2]),
        };

        mockEvent.target.checked = false;

        handleHeaderSelectAllChange(mockEvent, stateWithSelected, mockSetState, mockOnSelectAll);

        expect(mockSetState).toHaveBeenCalledTimes(1);

        const updateFn = mockSetState.mock.calls[0][0];
        const updatedState = updateFn(stateWithSelected);

        expect(updatedState.selectedRows).toEqual(new Set());

        expect(mockOnSelectAll).toHaveBeenCalledWith(mockEvent, stateWithSelected.rowsData, false);
    });

    it('should handle missing onSelectAll callback gracefully', () => {
        mockOnSelectAll = undefined;
        expect(() => {
            handleHeaderSelectAllChange(mockEvent, initialState, mockSetState, mockOnSelectAll);
        }).not.toThrow();

        expect(mockSetState).toHaveBeenCalledTimes(1);
    });

    it('should fallback to 0 for firstRow and currentPageRows when undefined', () => {
        const mockSetState = jest.fn(updateFn => updateFn({ selectedRows: new Set() }));
        const mockOnSelectAll = jest.fn();

        const mockEvent = {
            target: { checked: true }
        };

        const mockState = {
            rowsData: [
                { __$index__: 0 },
                { __$index__: 1 },
                { __$index__: 2 }
            ]
        };

        handleHeaderSelectAllChange(mockEvent, mockState, mockSetState, mockOnSelectAll);

        expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
        const updatedState = mockSetState.mock.calls[0][0]({ selectedRows: new Set() });
        expect(updatedState.selectedRows.size).toBe(0);
        expect(mockOnSelectAll).toHaveBeenCalledWith(mockEvent, [], true);
    });

    it('should fallback to empty array when slice returns undefined', () => {
        const mockSetState = jest.fn(updateFn => updateFn({ selectedRows: new Set() }));
        const mockOnSelectAll = jest.fn();

        const mockEvent = {
            target: { checked: true }
        };

        const mockState = {
            firstRow: 0,
            currentPageRows: 3,
            rowsData: {
                slice: jest.fn(() => undefined)
            }
        };

        handleHeaderSelectAllChange(mockEvent, mockState, mockSetState, mockOnSelectAll);

        expect(mockState.rowsData.slice).toHaveBeenCalledWith(0, 3);
        expect(mockOnSelectAll).toHaveBeenCalledWith(mockEvent, [], true);

        const updatedState = mockSetState.mock.calls[0][0]({ selectedRows: new Set() });
        expect(updatedState.selectedRows.size).toBe(0);
    });
});
