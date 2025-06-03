/* eslint-disable no-undef */

jest.mock('../../../src/utils/loading-utils', () => {
    let loading = false;
    let subscribers = [];

    return {
        getLoading: jest.fn(() => loading),
        subscribe: jest.fn((cb) => {
            subscribers.push(cb);
            return jest.fn(() => {
                subscribers = subscribers.filter(fn => fn !== cb);
            });
        }),
        __triggerLoading: (value) => {
            loading = value;
            subscribers.forEach(cb => cb(value));
        },
    };
});

import { renderHook, act } from '@testing-library/react';
import useLoadingIndicator from '../../../src/hooks/use-loading-indicator';
import * as loadingUtils from '../../../src/utils/loading-utils';

afterEach(() => {
    loadingUtils.__triggerLoading(false);
    jest.clearAllMocks();
});

describe('useLoadingIndicator', () => {
    it('returns initial loading state from getLoading()', () => {
        loadingUtils.getLoading.mockReturnValue(true);
        const { result } = renderHook(() => useLoadingIndicator());
        expect(result.current).toBe(true);
    });

    it('updates loading state when trigger is called', () => {
        loadingUtils.getLoading.mockReturnValue(false);
        const { result } = renderHook(() => useLoadingIndicator());
        expect(result.current).toBe(false);

        act(() => {
            loadingUtils.__triggerLoading(true);
        });

        expect(result.current).toBe(true);
    });

    it('cleans up on unmount', () => {
        const unsubscribeMock = jest.fn();

        loadingUtils.subscribe.mockImplementation((cb) => {
            return unsubscribeMock;
        });

        const { unmount } = renderHook(() => useLoadingIndicator());
        unmount();

        expect(unsubscribeMock).toHaveBeenCalled();
    });
});

