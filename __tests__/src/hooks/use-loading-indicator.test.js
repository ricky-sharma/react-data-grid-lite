/* eslint-disable no-undef */

jest.mock('../../../src/utils/loading-utils', () => {
    let loading = false;
    let subscribers = [];
    const actual = jest.requireActual('../../../src/utils/loading-utils');
    return {
        ...actual,
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

import { act, cleanup, renderHook } from '@testing-library/react';
import { Container_Identifier, Loader_Identifier } from '../../../src/constants';
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

describe('showLoader and hideLoader', () => {
    beforeAll(() => {
        window.getComputedStyle = (el) => ({
            getPropertyValue: () => '',
            position: el.style.position || 'static',
        });
    });

    beforeEach(() => {
        cleanup();
        jest.clearAllMocks();
        document.body.innerHTML = `
        <div id="testParent">
            <div class="react-data-grid-lite" style="position: static;"></div>
        </div>
    `;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('does nothing if parent ID is not found', () => {
        loadingUtils.showLoader('nonExistentId');
        expect(document.querySelector(`.${Loader_Identifier}`)).toBeNull();
    });

    it('does nothing if container is not found inside parent', () => {
        // Remove grid container
        document.getElementById('testParent').innerHTML = '';
        loadingUtils.showLoader('testParent');
        expect(document.querySelector(`.${Loader_Identifier}`)).toBeNull();
    });

    it('adds loader with dots if no message is provided', () => {
        loadingUtils.showLoader('testParent');

        const overlay = document.querySelector(`.${Loader_Identifier}`);
        expect(overlay).toBeInTheDocument();
        expect(overlay.querySelector('.dot-loader')).toBeInTheDocument();
        expect(overlay.textContent).toBe(''); // Only dots, no text
    });

    it('adds loader with message if message is provided', () => {
        loadingUtils.showLoader('testParent', 'Loading data...');

        const overlay = document.querySelector(`.${Loader_Identifier}`);
        expect(overlay).toBeInTheDocument();
        expect(overlay.textContent).toBe('Loading data...');
        expect(overlay.querySelector('.dot-loader')).not.toBeInTheDocument();
    });

    it('does not add loader if one already exists', () => {
        loadingUtils.showLoader('testParent');
        loadingUtils.showLoader('testParent'); // second call should do nothing

        const overlays = document.querySelectorAll(`.${Loader_Identifier}`);
        expect(overlays.length).toBe(1);
    });

    it('container position is set to relative if it was static', () => {
        const container = document.querySelector(Container_Identifier);
        expect(container.style.position).toBe('static');

        loadingUtils.showLoader('testParent');

        expect(container.style.position).toBe('relative');
    });

    it('hideLoader removes the loader overlay', () => {
        loadingUtils.showLoader('testParent');
        let overlay = document.querySelector(`.${Loader_Identifier}`);
        expect(overlay).toBeInTheDocument();

        loadingUtils.hideLoader('testParent');
        overlay = document.querySelector(`.${Loader_Identifier}`);
        expect(overlay).toBeNull();
    });
});