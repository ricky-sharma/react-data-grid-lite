/* eslint-disable no-undef */
import { renderHook, act } from '@testing-library/react';
import { useWindowWidth } from './../../../src/hooks/use-window-width';

jest.useFakeTimers();

describe('useWindowWidth', () => {
    let originalInnerWidth;
    beforeEach(() => {
        originalInnerWidth = window.innerWidth;
    });

    afterEach(() => {
        window.innerWidth = originalInnerWidth;
        jest.clearAllTimers();
        jest.clearAllMocks();
    });

    it('should return current window.innerWidth on mount', () => {
        window.innerWidth = 1024;
        const { result } = renderHook(() => useWindowWidth());
        expect(result.current).toBe(1024);
    });

    it('should update width after window resize (debounced)', () => {
        window.innerWidth = 800;
        const { result } = renderHook(() => useWindowWidth(200));

        expect(result.current).toBe(800);
        act(() => {
            window.innerWidth = 1200;
            window.dispatchEvent(new Event('resize'));
        });
        expect(result.current).toBe(800);

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current).toBe(1200);
    });

    it('should clean up resize event listener on unmount', () => {
        const addSpy = jest.spyOn(window, 'addEventListener');
        const removeSpy = jest.spyOn(window, 'removeEventListener');

        const { unmount } = renderHook(() => useWindowWidth());
        expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));

        unmount();

        expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
});
