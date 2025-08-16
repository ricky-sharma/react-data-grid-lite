import { act, render, waitFor } from '@testing-library/react';
import React, { useRef, useState } from 'react';
import { useProcessedData } from '../../../src/hooks/use-processed-data';

describe('useProcessedData hook', () => {
    function TestComponent(props) {
        const [state, setState] = useState({
            aiSearchOptions: { enabled: false, minRowCount: 1 },
            debug: false,
            pageRows: null,
            activePage: 1,
            noOfPages: 2,
            lastPageRows: 5,
            columns: [
                { name: 'col1', sortOrder: '' },
                { name: 'col2', sortOrder: '' },
            ],
        });

        const dataReceivedRef = useRef(null);
        const globalSearchQueryRef = useRef('');
        const aiSearchFailedRef = useRef(false);
        const searchColsRef = useRef([]);
        const sortRef = useRef({ current: { colObject: null, sortOrder: '', colKey: '' } });

        useProcessedData({
            ...props,
            state,
            setState,
            dataReceivedRef,
            globalSearchQueryRef,
            aiSearchFailedRef,
            searchColsRef,
            sortRef,
        });

        return <div data-testid="state">{JSON.stringify(state)}</div>;
    }

    const initialState = {
        aiSearchOptions: { enabled: true, minRowCount: 1 },
        debug: true,
        pageRows: null,
        activePage: 1,
        noOfPages: 1,
        lastPageRows: 1,
        columns: [{ name: 'col1', sortOrder: '' }],
    };

    jest.useFakeTimers();

    const defaultData = [{ id: 1 }, { id: 2 }];

    const runAISearchMock = jest.fn(async ({ data, query }) => data);
    const filterDataMock = jest.fn(async (_, rows) => rows);
    const sortDataMock = jest.fn(async (_, __, rows) => rows);
    const logDebugMock = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('processes data, sets state, and adds __$index__', async () => {
        const { getByTestId } = render(
            <TestComponent
                data={defaultData}
                pageSize="10"
                runAISearch={runAISearchMock}
                filterData={filterDataMock}
                sortData={sortDataMock}
                logDebug={logDebugMock}
            />
        );

        await act(async () => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            const stateDiv = getByTestId('state');
            const state = JSON.parse(stateDiv.textContent);

            expect(state.rowsData).toHaveLength(defaultData.length);
            expect(state.rowsData[0]).toHaveProperty('__$index__', 0);
            expect(state.rowsData[1]).toHaveProperty('__$index__', 1);
        });
    });

    it('runs AI search when enabled and threshold met', async () => {
        const data = Array(5).fill({ id: 1 }); // 5 rows
        const aiSearchResult = [{ id: 99 }];
        runAISearchMock.mockResolvedValueOnce(aiSearchResult);

        const TestAIComponent = (props) => {
            const [state, setState] = React.useState({
                aiSearchOptions: { enabled: true, minRowCount: 3 },
                debug: true,
                pageRows: null,
                activePage: 1,
                noOfPages: 2,
                lastPageRows: 5,
                columns: [{ name: 'col1', sortOrder: '' }],
            });
            const dataReceivedRef = React.useRef(null);
            const globalSearchQueryRef = React.useRef('query');
            const aiSearchFailedRef = React.useRef(false);
            const searchColsRef = React.useRef([]);
            const sortRef = React.useRef({ current: { colObject: null, sortOrder: '', colKey: '' } });

            useProcessedData({
                data: props.data,
                pageSize: '5',
                runAISearch: runAISearchMock,
                filterData: filterDataMock,
                sortData: sortDataMock,
                logDebug: logDebugMock,
                state,
                setState,
                dataReceivedRef,
                globalSearchQueryRef,
                aiSearchFailedRef,
                searchColsRef,
                sortRef,
            });

            return <div data-testid="state">{JSON.stringify(state)}</div>;
        };

        const { getByTestId } = render(<TestAIComponent data={data} />);

        await act(async () => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            const state = JSON.parse(getByTestId('state').textContent);
            expect(runAISearchMock).toHaveBeenCalled();
            expect(state.rowsData).toEqual(aiSearchResult);
        });
    });

    it('handles AI search failure and logs error', async () => {
        runAISearchMock.mockRejectedValueOnce(new Error('AI search error'));

        const TestComponent = () => {
            const [state, setState] = React.useState(initialState);
            const dataReceivedRef = React.useRef(null);
            const globalSearchQueryRef = React.useRef('search query');
            const aiSearchFailedRef = React.useRef(false);
            const searchColsRef = React.useRef([]);
            const sortRef = React.useRef({ current: { colObject: null, sortOrder: '', colKey: '' } });

            useProcessedData({
                data: [{ id: 1 }],
                pageSize: '5',
                runAISearch: runAISearchMock,
                filterData: filterDataMock,
                sortData: sortDataMock,
                logDebug: logDebugMock,
                state,
                setState,
                dataReceivedRef,
                globalSearchQueryRef,
                aiSearchFailedRef,
                searchColsRef,
                sortRef,
            });

            return <div data-testid="state">{JSON.stringify(state)}</div>;
        };

        const { getByTestId } = render(<TestComponent />);

        await act(async () => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(runAISearchMock).toHaveBeenCalled();
            expect(logDebugMock).toHaveBeenCalledWith(
                true,
                'error',
                'AI search failed, falling back to default local search.',
                expect.any(Error)
            );
        });
    });

    it('updates columns sortOrder based on sortRef', async () => {
        const sortCol = { name: 'col1', sortOrder: 'asc' };
        const sortRef = { current: { colObject: sortCol, sortOrder: 'asc', colKey: 'col1' } };

        const TestSortComponent = (props) => {
            const [state, setState] = React.useState({
                aiSearchOptions: { enabled: false, minRowCount: 1 },
                debug: false,
                pageRows: null,
                activePage: 1,
                noOfPages: 2,
                lastPageRows: 5,
                columns: [
                    { name: 'col1', sortOrder: '' },
                    { name: 'col2', sortOrder: '' },
                ],
            });
            const dataReceivedRef = React.useRef(null);
            const globalSearchQueryRef = React.useRef('');
            const aiSearchFailedRef = React.useRef(false);
            const searchColsRef = React.useRef([]);
            return useProcessedData({
                ...props,
                state,
                setState,
                dataReceivedRef,
                globalSearchQueryRef,
                aiSearchFailedRef,
                searchColsRef,
                sortRef,
                runAISearch: runAISearchMock,
                filterData: filterDataMock,
                sortData: sortDataMock,
                logDebug: logDebugMock,
            }) || <div data-testid="state">{JSON.stringify(state)}</div>;
        };

        const { getByTestId } = render(
            <TestSortComponent data={defaultData} pageSize="10" />
        );

        await act(async () => {
            jest.runAllTimers();
        });
    });

    it('clears timeout on unmount', () => {
        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
        const { unmount } = render(
            <TestComponent
                data={defaultData}
                pageSize="10"
                runAISearch={runAISearchMock}
                filterData={filterDataMock}
                sortData={sortDataMock}
                logDebug={logDebugMock}
            />
        );

        unmount();
        expect(clearTimeoutSpy).toHaveBeenCalled();
        clearTimeoutSpy.mockRestore();
    });
});

describe('useProcessedData hook more tests', () => {
    const TestComponent = ({ data }) => {
        const [state, setState] = React.useState({
            activePage: 1,
            noOfPages: 1,
            lastPageRows: 2,
            pageRows: null,
            columns: [{ name: 'id', sortOrder: '' }],
        });
        const dataReceivedRef = React.useRef(null);
        const globalSearchQueryRef = React.useRef('');
        const aiSearchFailedRef = React.useRef(false);
        const searchColsRef = React.useRef([]);
        const sortRef = React.useRef({
            colObject: { name: 'id' },
            sortOrder: 'asc',
            colKey: 'id',
        });

        useProcessedData({
            data,
            pageSize: '10',
            runAISearch: runAISearchMock,
            filterData: filterDataMock,
            sortData: sortDataMock,
            logDebug: logDebugMock,
            state,
            setState,
            dataReceivedRef,
            globalSearchQueryRef,
            aiSearchFailedRef,
            searchColsRef,
            sortRef,
        });

        return <div data-testid="state">{JSON.stringify(state)}</div>;
    };

    const initialState = {
        aiSearchOptions: { enabled: true, minRowCount: 1 },
        debug: true,
        pageRows: null,
        activePage: 1,
        noOfPages: 1,
        lastPageRows: 1,
        columns: [{ name: 'col1', sortOrder: '' }],
    };

    jest.useFakeTimers();

    const sortedData = [
        { id: 3, __$index__: 0 },
        { id: 4, __$index__: 1 }
    ];

    const sortDataMock = jest.fn(async (_, __, rows) => rows);
    const runAISearchMock = jest.fn(async ({ data, query }) => data);
    const filterDataMock = jest.fn(async (_, rows) => rows);
    const logDebugMock = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('calls sortData when sortRef.current.colObject and sortOrder are provided', async () => {
        jest.useFakeTimers();

        const { getByTestId, rerender } = render(<TestComponent data={[{ id: 1 }, { id: 2 }]} />);

        rerender(<TestComponent data={[{ id: 3 }, { id: 4 }]} />);

        await act(async () => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(sortDataMock).toHaveBeenCalledWith(
                { name: 'id' },
                'asc',
                expect.any(Array)
            );
            const state = JSON.parse(getByTestId('state').textContent);
            expect(state.rowsData).toEqual(sortedData);
        });
    });

});