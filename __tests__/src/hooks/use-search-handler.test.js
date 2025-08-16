/* eslint-disable no-undef */
import { act, cleanup, render, renderHook } from '@testing-library/react';
import React, { useRef, useState } from 'react';
import { eventGridSearchTriggered } from '../../../src/components/events/event-grid-search-triggered';
import { logDebug } from '../../../src/helpers/logDebug';
import { useSearchHandler } from '../../../src/hooks/use-search-handler';

jest.mock('../../../src/components/events/event-grid-search-triggered', () => ({
    eventGridSearchTriggered: jest.fn()
}));
jest.mock('../../../src/helpers/logDebug', () => ({
    logDebug: jest.fn()
}));

jest.useFakeTimers();

const mockRunAISearch = jest.fn();

describe('useSearchHandler', () => {
    let state;
    let setState;

    let refs;

    beforeEach(() => {
        jest.clearAllTimers();
        jest.clearAllMocks();
        cleanup();

        state = {
            aiSearchOptions: { enabled: true, minRowCount: 1 },
            globalSearchInput: 'test query',
            debug: true
        };

        setState = jest.fn();

        refs = {
            dataReceivedRef: { current: [{ id: 1 }, { id: 2 }] },
            searchTimeoutRef: { current: null },
            searchRef: { current: null },
            searchColsRef: { current: [] },
            globalSearchQueryRef: { current: '' },
            aiSearchFailedRef: { current: false },
            sortRef: { current: {} }
        };
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.clearAllMocks();
        cleanup();
    });

    const setup = () =>
        renderHook(() =>
            useSearchHandler({
                state,
                setState,
                runAISearch: mockRunAISearch,
                ...refs
            })
        );

    it('triggers AI search when global search is clicked and AI is enabled', async () => {
        mockRunAISearch.mockResolvedValue([{ id: 99 }]);

        const { result } = setup();

        const fakeEvent = {
            nativeEvent: true,
            target: { value: 'ai search test' }
        };

        await act(() => {
            result.current(fakeEvent, '##globalSearch##', { someCol: 'meta' }, 'formatting', true);
            jest.runAllTimers();
        });

        expect(mockRunAISearch).toHaveBeenCalledWith({
            data: refs.dataReceivedRef.current,
            query: 'ai search test'
        });

        expect(eventGridSearchTriggered).toHaveBeenCalledWith(
            'ai search test',
            '##globalSearch##',
            { someCol: 'meta' },
            'formatting',
            [{ id: 99 }],
            refs.searchColsRef,
            state,
            setState,
            refs.sortRef,
            refs.aiSearchFailedRef,
            true
        );
    });

    it('falls back to local search on AI error and logs debug', async () => {
        mockRunAISearch.mockRejectedValue(new Error('AI error'));

        const { result } = setup();

        const fakeEvent = {
            nativeEvent: true,
            target: { value: 'error test' }
        };

        await act(() => {
            result.current(fakeEvent, '##globalSearch##', {}, null, true);
            jest.runAllTimers();
        });

        expect(logDebug).toHaveBeenCalledWith(
            state.debug,
            'error',
            'AI search failed, falling back to default local search.',
            expect.any(Error)
        );

        expect(refs.aiSearchFailedRef.current).toBe(true);

        expect(eventGridSearchTriggered).toHaveBeenCalledWith(
            'error test',
            '##globalSearch##',
            {},
            null,
            refs.dataReceivedRef.current,
            refs.searchColsRef,
            state,
            setState,
            refs.sortRef,
            refs.aiSearchFailedRef,
            true
        );
    });

    it('sets timeout and updates refs correctly', async () => {
        const { result } = setup();

        const fakeEvent = {
            nativeEvent: true,
            target: { value: 'timeout test' }
        };

        act(() => {
            result.current(fakeEvent, '##globalSearch##', {}, null);
        });

        expect(refs.searchTimeoutRef.current).not.toBeNull();

        act(() => {
            jest.runAllTimers();
        });

        expect(refs.searchRef.current).toEqual({
            changeEvent: fakeEvent,
            searchQuery: 'timeout test'
        });

        expect(refs.globalSearchQueryRef.current).toEqual('timeout test');
    });

    it('handles non-global column search without AI', async () => {
        state.aiSearchOptions.enabled = false;

        const { result } = setup();

        const fakeEvent = {
            nativeEvent: true,
            target: { value: 'column search' }
        };

        await act(() => {
            result.current(fakeEvent, 'someCol', {}, null);
            jest.runAllTimers();
        });

        expect(mockRunAISearch).not.toHaveBeenCalled();

        expect(eventGridSearchTriggered).toHaveBeenCalledWith(
            'column search',
            'someCol',
            {},
            null,
            refs.dataReceivedRef.current,
            refs.searchColsRef,
            state,
            setState,
            refs.sortRef,
            refs.aiSearchFailedRef,
            false
        );
    });

    it('uses trimmed state.globalSearchInput when onChange is false and search is global', async () => {
        state.globalSearchInput = '   trimmed input';

        const { result } = setup();

        const fakeEvent = {
            nativeEvent: true,
            target: { value: 'should be ignored' }
        };

        await act(() => {
            result.current(fakeEvent, '##globalSearch##', {}, null, false);
            jest.runAllTimers();
        });

        expect(mockRunAISearch).toHaveBeenCalledWith({
            data: refs.dataReceivedRef.current,
            query: 'trimmed input'
        });
    });

    it('does not call AI search if globalSearchInput is undefined (query is empty)', async () => {
        state.globalSearchInput = undefined;

        const { result } = setup();

        const fakeEvent = {
            nativeEvent: true,
            target: { value: 'should be ignored' }
        };

        await act(() => {
            result.current(fakeEvent, '##globalSearch##', {}, null, false);
            jest.runAllTimers();
        });

        expect(mockRunAISearch).not.toHaveBeenCalled();
    });

    it('uses event value when onChange is true', async () => {
        state.globalSearchInput = '   ignored';

        const { result } = setup();

        const fakeEvent = {
            nativeEvent: true,
            target: { value: '   event value  ' }
        };

        await act(() => {
            result.current(fakeEvent, '##globalSearch##', {}, null, true);
            jest.runAllTimers();
        });

        expect(mockRunAISearch).toHaveBeenCalledWith({
            data: refs.dataReceivedRef.current,
            query: 'event value  '
        });
    });

    it('updates existing globalSearch column searchQuery when global search is clicked', () => {
        refs.searchColsRef.current = [
            { colName: '##globalSearch##', searchQuery: 'old query', colObj: {} }
        ];

        const { result } = setup();

        const fakeEvent = {
            nativeEvent: true,
            target: { value: 'new query' }
        };

        act(() => {
            result.current(fakeEvent, '##globalSearch##', {}, null, true);
        });

        act(() => {
            jest.runAllTimers();
        });

        expect(refs.searchColsRef.current).toHaveLength(1);
        expect(refs.searchColsRef.current[0].searchQuery).toBe('new query');
    });

    it('clears previous timeout if searchTimeoutRef.current exists', () => {
        const fakeTimeoutId = 123;
        refs.searchTimeoutRef.current = fakeTimeoutId;

        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

        const { result } = setup();

        const fakeEvent = {
            nativeEvent: true,
            target: { value: 'some query' }
        };

        act(() => {
            result.current(fakeEvent, '##globalSearch##', {}, null, true);
        });

        expect(clearTimeoutSpy).toHaveBeenCalledWith(fakeTimeoutId);
        clearTimeoutSpy.mockRestore();
    });

    it('does not clone the event when nativeEvent does not exists (shallow clone)', () => {
        const { result } = setup();

        const fakeEvent = {
            nativeEvent: false
        };

        act(() => {
            result.current(fakeEvent, '##globalSearch##', {}, null, true);
        });

        act(() => {
            jest.runAllTimers();
        });

        expect(refs.searchRef.current.changeEvent).toBe(fakeEvent);
        expect(refs.searchRef.current.searchQuery).toBe('');
    });


});