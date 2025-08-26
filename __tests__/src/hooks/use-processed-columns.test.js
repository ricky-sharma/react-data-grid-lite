import { act, render, renderHook } from '@testing-library/react';
import React from 'react';
import { assignDisplayIndexes, getColumnOrder, useProcessedColumns } from '../../../src/hooks/use-processed-columns';

const isNull = (val) => val === null || val === undefined;

jest.mock('../../../src/helpers/common', () => ({
    isNull: jest.fn((val) => val === null || val === undefined)
}));

describe('useProcessedColumns', () => {
    let setStateMock;
    let computedColumnWidthsRef;

    const TestComponent = ({ columns }) => {
        useProcessedColumns(columns, setStateMock, computedColumnWidthsRef);
        return null;
    };

    beforeEach(() => {
        setStateMock = jest.fn();
        computedColumnWidthsRef = { current: ['placeholder'] };
    });

    it('should reset computedColumnWidthsRef on mount', () => {
        render(<TestComponent columns={[]} />);
        expect(computedColumnWidthsRef.current).toEqual([]);
    });

    it('should not call setState if columns is null', () => {
        render(<TestComponent columns={null} />);
        expect(setStateMock).not.toHaveBeenCalled();
    });

    it('should set empty columns if input is not valid objects', () => {
        act(() => {
            render(<TestComponent columns={['invalid']} />);
        });

        expect(setStateMock).toHaveBeenCalledWith(expect.any(Function));
        const updater = setStateMock.mock.calls[0][0];
        const result = updater({ columns: [] });

        expect(result.columns).toEqual([]);
    });

    it('should preserve existing column width and order', () => {
        const columns = [
            { name: 'name', width: '200px', order: 4 },
            { name: 'id', width: '100px', order: 1, fixed: true }
        ];

        const prevState = {
            columns: [{ name: 'name', width: '250px', displayIndex: 5 }]
        };

        act(() => {
            render(<TestComponent columns={columns} />);
        });

        expect(setStateMock).toHaveBeenCalled();
        const result = setStateMock.mock.calls[0][0](prevState);

        expect(result.columns).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: 'id', displayIndex: 1, order: 1 }),
                expect.objectContaining({ name: 'name', displayIndex: 4, order: 4, width: '250px' }),
            ])
        );
    });

    it('should assign displayIndex only to visible columns', () => {
        const columns = [
            { name: 'visible', order: 1, hidden: false },
            { name: 'hidden', order: 2, hidden: true }
        ];

        act(() => {
            render(<TestComponent columns={columns} />);
        });

        const updater = setStateMock.mock.calls[0][0];
        const result = updater({ columns: [] });

        expect(result.columns.find(c => c && c.name === 'visible').displayIndex).toBe(1);
        expect(result.columns.find(c => c && c.name === 'hidden')).toBeUndefined();
    });

    it('should sort by order and name correctly', () => {
        const columns = [
            { name: 'b', order: 2 },
            { name: 'a', order: 2 },
            { name: 'c', order: 1 }
        ];

        act(() => {
            render(<TestComponent columns={columns} />);
        });

        const result = setStateMock.mock.calls[0][0]({ columns: [] });

        expect(result.columns.map(c => c.name)).toEqual(['c', 'a', 'b']);
        expect(result.columns.map(c => c.displayIndex)).toEqual([1, 2, 3]);
    });

    it('inserts columns at next available index when conflicts exist', () => {
        const columns = [
            { name: 'a', order: 1 },
            { name: 'b', order: 1 },
            { name: 'c' }
        ];

        act(() => {
            render(<TestComponent columns={columns} />);
        });

        const updater = setStateMock.mock.calls[0][0];
        const result = updater({ columns: [] });

        const columnNames = result.columns.map(c => c.name);
        expect(columnNames).toEqual(['a', 'b', 'c']);
        const displayIndices = result.columns.map(c => c.displayIndex);
        expect(displayIndices).toEqual([1, 2, 3]);
    });

    it('applies globalStartIndex = 0 correctly for fixed columns', () => {
        const columns = [
            { name: 'fixed1', fixed: true, order: 2 },
            { name: 'fixed2', fixed: true, order: 1 },
            { name: 'nonFixed', fixed: false, order: 3 }
        ];

        act(() => {
            render(<TestComponent columns={columns} />);
        });

        const updater = setStateMock.mock.calls[0][0];
        const result = updater({ columns: [] });

        const colNames = result.columns.map(col => col.name);
        expect(colNames).toEqual(['fixed2', 'fixed1', 'nonFixed']);

        const displayIndices = result.columns.map(col => col.displayIndex);
        expect(displayIndices).toEqual([1, 2, 3]);
    });
});

describe('useProcessedColumns - fallback globalStartIndex = 0', () => {
    it('uses globalStartIndex = 0 when orderedFixed is empty', () => {
        const computedColumnWidthsRef = { current: ['temp'] };
        const setState = jest.fn();

        const columns = [
            { name: 'colA', fixed: false, order: 1 },
            { name: 'colB', fixed: false, order: 2 }
        ];

        renderHook(() =>
            useProcessedColumns(columns, setState, computedColumnWidthsRef)
        );

        expect(setState).toHaveBeenCalledTimes(1);

        const stateUpdater = setState.mock.calls[0][0];
        const newState = stateUpdater({ columns: [] });

        const columnNames = newState.columns.map(c => c.name);
        expect(columnNames).toEqual(['colA', 'colB']);

        const displayIndices = newState.columns.map(c => c.displayIndex);
        expect(displayIndices).toEqual([1, 2]);
    });
});

describe('useProcessedColumns - globalStartIndex default behavior', () => {
    it('defaults globalStartIndex to 0 for fixed columns', () => {
        const computedColumnWidthsRef = { current: ['temp'] };
        const setState = jest.fn();

        const columns = [
            { name: 'fixedB', fixed: true, order: 1 },
            { name: 'fixedA', fixed: true, order: 2 },
            { name: 'nonFixed', fixed: false, order: 3 }
        ];

        renderHook(() =>
            useProcessedColumns(columns, setState, computedColumnWidthsRef)
        );

        expect(computedColumnWidthsRef.current).toEqual([]);

        expect(setState).toHaveBeenCalledTimes(1);
        const stateUpdater = setState.mock.calls[0][0];

        const result = stateUpdater({ columns: [] });

        const orderedNames = result.columns.map(col => col.name);
        expect(orderedNames).toEqual(['fixedB', 'fixedA', 'nonFixed']);

        const displayIndices = result.columns.map(col => col.displayIndex);
        expect(displayIndices).toEqual([1, 2, 3]);
    });
});

describe('assignDisplayIndexes', () => {
    it('assigns displayIndex = order and fills gaps', () => {
        const columns = [
            { name: 'a', order: 1, hidden: false },
            { name: 'b', order: 3, hidden: false },
            { name: 'c', order: 3, hidden: false },
            { name: 'd', order: undefined, hidden: false },
            { name: 'e', order: 5, hidden: true },
        ];

        const result = assignDisplayIndexes(columns);

        expect(result.find(c => c.name === 'a').displayIndex).toBe(1);
        expect(result.find(c => c.name === 'b').displayIndex).toBe(3);
        expect(result.find(c => c.name === 'c').displayIndex).toBe(2);
        expect(result.find(c => c.name === 'd').displayIndex).toBe(4);
        expect(result.find(c => c.name === 'e').displayIndex).toBeUndefined();
    });
});


describe('getColumnOrder - globalStartIndex fallback', () => {
    it('uses globalStartIndex = 0 when not provided', () => {
        const group = [
            { name: 'a', order: 1 },
            { name: 'b', order: 2 }
        ];

        const result = getColumnOrder(group);
        expect(result.map(col => col.name)).toEqual(['a', 'b']);
    });

    it('respects provided globalStartIndex', () => {
        const group = [
            { name: 'a', order: 1 },
            { name: 'b', order: 2 }
        ];

        const result = getColumnOrder(group, 5);
        expect(result.map(col => col.name)).toEqual(['a', 'b']);
    });

    it('handles gaps and uses fallback when indexes clash', () => {
        const group = [
            { name: 'a', order: 1 },
            { name: 'b' },
            { name: 'c', order: 1 }
        ];

        const result = getColumnOrder(group, 0);
        expect(result.map(col => col.name).sort()).toEqual(['a', 'b', 'c'].sort());
    });
});