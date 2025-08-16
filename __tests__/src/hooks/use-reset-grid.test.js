import { act, render } from '@testing-library/react';
import React, { useRef, useState } from 'react';
import { logDebug } from '../../../src/helpers/logDebug';
import { useResetGrid } from '../../../src/hooks/use-reset-grid';

jest.mock('../../../src/helpers/common', () => ({
    isNull: jest.fn(value => value === null || isNaN(value)),
}));

jest.mock('../../../src/helpers/logDebug', () => ({
    logDebug: jest.fn(),
}));

describe('useResetGrid hook', () => {
    const initialState = {
        debug: true,
        columns: [{ name: 'col1', sortOrder: 'asc' }, { name: 'col2', sortOrder: 'desc' }],
        selectedRows: new Set([1, 2]),
        rowsData: [{ id: 1 }, { id: 2 }],
        globalSearchInput: '',
        activePage: 1,
        pageRows: 10,
    };

    function TestComponent({ pageSize, logDebug }) {
        const [state, setState] = useState(initialState);
        const searchColsRef = useRef(['search']);
        const globalSearchQueryRef = useRef('query');
        const sortRef = useRef({ col: 'id', sortOrder: 'asc' });
        const dataReceivedRef = useRef([{ id: 1 }, { id: 2 }, { id: 3 }]);

        const resetGrid = useResetGrid({
            state,
            setState,
            pageSize,
            searchColsRef,
            globalSearchQueryRef,
            sortRef,
            dataReceivedRef
        });

        return (
            <div>
                <button onClick={resetGrid}>Reset</button>
                <pre data-testid="state">{JSON.stringify(state)}</pre>
            </div>
        );
    }

    it('resets state and refs properly', () => {
        const { getByText, getByTestId } = render(<TestComponent pageSize="2" logDebug={logDebug} />);
        act(() => {
            getByText('Reset').click();
        });

        const stateRaw = getByTestId('state').textContent;
        const state = JSON.parse(stateRaw);
        expect(state.selectedRows).toEqual({});
        expect(state.selectedRows == null || Object.keys(state.selectedRows).length === 0).toBe(true);
        expect(state.globalSearchInput).toBe('');
        expect(state.activePage).toBe(1);
        expect(state.pageRows).toBe(2);
        expect(state.rowsData).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
        expect(state.columns.every(col => col.sortOrder === '')).toBe(true);
        expect(logDebug).not.toHaveBeenCalled();
    });

    it('calls logDebug on error', () => {
        function ErrorComponent() {
            const [state, setState] = useState({ ...initialState, columns: null });
            const searchColsRef = undefined;
            const globalSearchQueryRef = undefined;
            const sortRef = undefined;
            const dataReceivedRef = undefined;

            const resetGrid = useResetGrid({
                state,
                setState,
                pageSize: '2',
                searchColsRef,
                globalSearchQueryRef,
                sortRef,
                dataReceivedRef
            });

            return <button onClick={resetGrid}>Reset</button>;
        }

        const { getByText } = render(<ErrorComponent />);

        act(() => {
            getByText('Reset').click();
        });

        expect(logDebug).toHaveBeenCalledWith(
            true,
            'error',
            'Reset Grid:',
            expect.any(Error)
        );
    });

    it('does not crash', () => {
        function ErrorComponent() {
            const [state, setState] = React.useState({ ...initialState, columns: null });
            const searchColsRef = React.useRef([]);
            const globalSearchQueryRef = React.useRef('');
            const sortRef = React.useRef(null);
            const dataReceivedRef = React.useRef(null);

            const resetGrid = useResetGrid({
                state,
                setState,
                searchColsRef,
                globalSearchQueryRef,
                sortRef,
                dataReceivedRef
            });

            return <button onClick={resetGrid}>Reset</button>;
        }

        const { getByText } = render(<ErrorComponent />);

        expect(() => {
            act(() => {
                getByText('Reset').click();
            });
        }).not.toThrow();
    });
});