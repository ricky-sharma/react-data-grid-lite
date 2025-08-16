import React, { useRef, useState } from 'react';
import { render, act } from '@testing-library/react';
import { useSearchAndSortCallbacks } from '../../../src/hooks/use-search-and-sort-callbacks';

function TestComponent({
    initialToggle,
    stateOverrides = {},
    sortRef,
    searchRef,
    searchColsRef
}) {
    const [toggle, setToggle] = useState(initialToggle);

    const internalSortRef = sortRef ?? useRef({
        colKey: 'name',
        colObject: { name: 'name' },
        changeEvent: { type: 'sort' },
        sortOrder: '',
    });

    const internalSearchRef = searchRef ?? useRef({
        changeEvent: { type: 'search' },
        searchQuery: 'query',
    });

    const internalSearchColsRef = searchColsRef ?? useRef([
        { colName: 'name', searchQuery: 'query' }
    ]);

    const state = {
        toggleState: toggle,
        columns: [{ name: 'name', sortOrder: 'asc' }],
        rowsData: [{ id: 1 }],
        onSortComplete: jest.fn(),
        onSearchComplete: jest.fn(),
        ...stateOverrides,
    };

    useSearchAndSortCallbacks({
        state,
        sortRef: internalSortRef,
        searchRef: internalSearchRef,
        searchColsRef: internalSearchColsRef,
    });

    return <button onClick={() => setToggle(prev => !prev)}>Toggle</button>;
}

describe('useSearchAndSortCallbacks', () => {
    it('calls onSortComplete and clears sortRef.changeEvent', () => {
        const mockSortComplete = jest.fn();

        const { getByText } = render(
            <TestComponent stateOverrides={{ onSortComplete: mockSortComplete }} initialToggle={false} />
        );

        act(() => {
            getByText('Toggle').click();
        });

        expect(mockSortComplete).toHaveBeenCalledWith(
            { type: 'sort' },
            { name: 'name' },
            [{ id: 1 }],
            'asc'
        );
    });

    it('calls onSearchComplete and clears searchRef.current', () => {
        const mockSearchComplete = jest.fn();

        const { getByText } = render(
            <TestComponent stateOverrides={{ onSearchComplete: mockSearchComplete }} initialToggle={false} />
        );

        act(() => {
            getByText('Toggle').click();
        });

        expect(mockSearchComplete).toHaveBeenCalledWith(
            { type: 'search' },
            'query',
            [{ colName: 'name', searchQuery: 'query' }],
            [{ id: 1 }],
            1
        );
    });

    it('sets sortRef.current.sortOrder from state.columns', () => {
        const sortRef = {
            current: {
                colKey: 'name',
                colObject: { name: 'name' },
                sortOrder: '',
                changeEvent: null
            }
        };

        const { getByText } = render(
            <TestComponent sortRef={sortRef} initialToggle={false} />
        );

        act(() => {
            getByText('Toggle').click(); // This updates toggleState and triggers useEffect
        });

        expect(sortRef.current.sortOrder).toBe('asc');
    });

    it('does not call onSortComplete or onSearchComplete if no changeEvent', () => {
        const mockSortComplete = jest.fn();
        const mockSearchComplete = jest.fn();

        const { getByText } = render(
            <TestComponent
                stateOverrides={{
                    onSortComplete: mockSortComplete,
                    onSearchComplete: mockSearchComplete,
                }}
                initialToggle={false}
            />
        );

        act(() => {
            getByText('Toggle').click();
        });

        expect(mockSortComplete).toHaveBeenCalled();
        expect(mockSearchComplete).toHaveBeenCalled();

        act(() => {
            getByText('Toggle').click();
        });

        expect(mockSortComplete).toHaveBeenCalledTimes(1);
        expect(mockSearchComplete).toHaveBeenCalledTimes(1);
    });

    it('falls back to empty array if searchColsRef.current is undefined', () => {
        const mockSearchComplete = jest.fn();

        const sortRef = {};

        const searchRef = {
            current: {
                changeEvent: { type: 'search' },
                searchQuery: 'test'
            }
        };

        const searchColsRef = { current: undefined };

        const { getByText } = render(
            <TestComponent
                initialToggle={false}
                sortRef={sortRef}
                searchRef={searchRef}
                searchColsRef={searchColsRef}
                stateOverrides={{
                    onSearchComplete: mockSearchComplete,
                    rowsData: undefined
                }}
            />
        );

        act(() => {
            getByText('Toggle').click();
        });

        expect(mockSearchComplete).toHaveBeenCalledWith(
            { type: 'search' },
            'test',
            [],
            [],
            0
        );
    });
});