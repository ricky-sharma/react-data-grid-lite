import { act, cleanup, render } from '@testing-library/react';
import React, { forwardRef, useRef, useState } from 'react';
import { useGridApi } from '../../../src/hooks/use-grid-api';

describe('useGridApi', () => {
    const TestComponent = forwardRef((props, ref) => {
        const [state, setState] = useState({
            rowsData: [
                { __$index__: 0, name: 'Alice' },
                { __$index__: 1, name: 'Bob' },
            ],
            selectedRows: new Set([1]),
            activePage: 2
        });

        const dataReceivedRef = useRef([
            { __$index__: 0, name: 'Alice' },
            { __$index__: 1, name: 'Bob' },
        ]);

        const handleResetGrid = jest.fn();

        useGridApi(ref, {
            state,
            dataReceivedRef,
            setState,
            handleResetGrid
        });

        return <div data-testid="grid">{JSON.stringify(state)}</div>;
    });

    const setup = () => {
        const ref = React.createRef();
        render(<TestComponent ref={ref} />);
        return ref;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        cleanup();
    });

    it('returns filtered rows from state', () => {
        const ref = setup();
        expect(ref.current.getFilteredRows()).toEqual([
            { __$index__: 0, name: 'Alice' },
            { __$index__: 1, name: 'Bob' },
        ]);
    });

    it('returns filtered selected rows from state', () => {
        const ref = setup();
        expect(ref.current.getFilteredSelectedRows()).toEqual([
            { __$index__: 1, name: 'Bob' }
        ]);
    });

    it('returns all selected rows from dataReceivedRef', () => {
        const ref = setup();
        expect(ref.current.getAllSelectedRows()).toEqual([
            { __$index__: 1, name: 'Bob' }
        ]);
    });

    it('returns current page from state', () => {
        const ref = setup();
        expect(ref.current.getCurrentPage()).toBe(2);
    });

    it('calls resetGrid handler', () => {
        const ref = setup();
        ref.current.resetGrid();
        expect(ref.current.resetGrid).toBeCalled();
    });

    it('clears selected rows in state', async () => {
        const ref = setup();
        await act(async () => {
            ref.current.clearSelectedRows();
        });
        const newState = ref.current.getFilteredRows();
        expect(newState).toEqual([
            { __$index__: 0, name: 'Alice' },
            { __$index__: 1, name: 'Bob' }
        ]);
        expect(ref.current.getFilteredSelectedRows()).toEqual([]);
    });
});

describe('useGridApi - selectedRows undefined', () => {
    it('should not throw and return empty array when selectedRows is undefined', () => {
        const ref = React.createRef();

        const TestComponent = () => {
            const [state, setState] = React.useState({
            });

            const dataReceivedRef = React.useRef(null);

            const handleResetGrid = jest.fn();

            useGridApi(ref, {
                state,
                setState,
                dataReceivedRef,
                handleResetGrid
            });

            return <div data-testid="test">OK</div>;
        };

        render(<TestComponent />);
        expect(ref.current.getFilteredSelectedRows()).toEqual([]);
        expect(ref.current.getAllSelectedRows()).toEqual([]);
        expect(ref.current.getFilteredRows()).toEqual([]);
        expect(ref.current.getCurrentPage()).toEqual(1);
    });
});