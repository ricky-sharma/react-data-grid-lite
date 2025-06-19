import { cleanup } from '@testing-library/react';
import { eventGridHeaderClicked } from './../../../../src/components/events/event-grid-header-clicked';
import { dynamicSort } from './../../../../src/helpers/sort';

jest.mock('./../../../../src/helpers/sort', () => ({
    dynamicSort: jest.fn(),
}));

describe('eventGridHeaderClicked', () => {
    let mockSetState;
    let mockState;

    beforeEach(() => {
        jest.clearAllMocks();
        cleanup();
        mockSetState = jest.fn((updater) => {
            mockState = updater(mockState);
        });

        mockState = {
            gridID: 'test-grid',
            rowsData: [
                { name: 'Zebra', age: 10 },
                { name: 'Apple', age: 5 },
            ],
            toggleState: false,
        };

        dynamicSort.mockImplementation(() => (data) => {
            if (!data || !Array.isArray(data)) return data;
            return [...data].reverse();
        });
    });

    it('should handle multiple sort columns', () => {
        mockState.columns = [{ name: 'name' }, { name: 'age' }]
        eventGridHeaderClicked(['name', 'age'], mockState, mockSetState, 'name');
        expect(dynamicSort).toHaveBeenCalledWith('-name', '-age');
        expect(mockState.columns[0].sortOrder).toBe('desc');
    });

    it('should not sort if rowsData is null', () => {
        mockState.rowsData = undefined;
        mockState.columns = [{ name: 'name' }]
        eventGridHeaderClicked(['name'], mockState, mockSetState, 'name');
        expect(dynamicSort).not.toHaveBeenCalled();
        expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
        expect(mockState).toMatchObject({
            rowsData: undefined,
            columns: [{ name: 'name', sortOrder: '' }],
            toggleState: true
        });
    });
});

describe('More tests for eventGridHeaderClicked', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        cleanup();

        jest.mock('./../../../../src/helpers/sort', () => ({
            dynamicSort: (...fields) => (a, b) => {
                const field = fields[0].replace('-', '');
                const dir = fields[0].startsWith('-') ? -1 : 1;
                if (a[field] < b[field]) return -1 * dir;
                if (a[field] > b[field]) return 1 * dir;
                return 0;
            }
        }));
    });

    it('sorts data descending on first click', () => {
        const colObject = ['name'];
        const state = {
            rowsData: [
                { name: 'Zack' },
                { name: 'Alice' },
            ],
            columns: [{ name: 'name', sortOrder: '' }],
        };
        const setState = jest.fn();
        const isResizingRef = { current: false };

        eventGridHeaderClicked(colObject, state, setState, 'name', isResizingRef);

        expect(setState).toHaveBeenCalledWith(expect.any(Function));

        const updaterFn = setState.mock.calls[0][0];
        const newState = updaterFn(state);
        expect(newState.columns[0].sortOrder).toBe('desc');
    });

    it('sorts data ascending on second click', () => {
        const colObject = ['name'];
        const state = {
            rowsData: [
                { name: 'Alice' },
                { name: 'Zack' }
            ],
            columns: [{ name: 'name', sortOrder: 'desc' }],
        };
        const setState = jest.fn();
        const isResizingRef = { current: false };

        eventGridHeaderClicked(colObject, state, setState, 'name', isResizingRef);
        const updaterFn = setState.mock.calls[0][0];
        const newState = updaterFn(state);
        expect(newState.columns[0].sortOrder).toBe('asc');
    });

    it('does not sort when isResizingRef.current is true', () => {
        const setState = jest.fn();
        const isResizingRef = { current: true };
        eventGridHeaderClicked(['name'], {}, setState, 'name', isResizingRef);
        expect(setState).not.toHaveBeenCalled();
    });

    it('does not sort when colObject is not an array', () => {
        const setState = jest.fn();
        eventGridHeaderClicked(null, {}, setState, 'name', { current: false });
        expect(setState).not.toHaveBeenCalled();
    });

    it('toggles toggleState value on each sort', () => {
        const colObject = ['name'];
        const state = {
            rowsData: [
                { name: 'Zack' },
                { name: 'Alice' },
            ],
            columns: [{ name: 'name', sortOrder: '' }],
            toggleState: false,
        };
        const setState = jest.fn();
        eventGridHeaderClicked(colObject, state, setState, 'name', { current: false });
        const newState = setState.mock.calls[0][0](state);
        expect(newState.toggleState).toBe(true);
    });
});