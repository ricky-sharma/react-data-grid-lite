import { act, renderHook } from '@testing-library/react';
import { useDoubleTap } from '../../../src/hooks/use-double-tap';

describe('useDoubleTap', () => {
    let mockNow = 0;

    beforeAll(() => {
        jest.useFakeTimers();
        jest.spyOn(Date, 'now').mockImplementation(() => mockNow);
    });

    afterAll(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        mockNow = 1000;
    });

    it('should not trigger callback on single tap', () => {
        const callback = jest.fn();
        const { result } = renderHook(() => useDoubleTap());

        act(() => {
            result.current.onTouchStart(callback)();
        });

        expect(callback).not.toHaveBeenCalled();
    });

    it('should trigger callback on double tap within delay', () => {
        const callback = jest.fn();
        const { result } = renderHook(() => useDoubleTap());

        act(() => {
            result.current.onTouchStart(callback)();
        });

        mockNow = 1200;
        act(() => {
            result.current.onTouchStart(callback)();
        });

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not trigger callback if second tap is outside delay', () => {
        const callback = jest.fn();
        const { result } = renderHook(() => useDoubleTap());

        act(() => {
            result.current.onTouchStart(callback)();
        });

        mockNow = 1401;
        act(() => {
            result.current.onTouchStart(callback)();
        });

        expect(callback).not.toHaveBeenCalled();
    });

    it('respects custom delay', () => {
        const callback = jest.fn();
        const { result } = renderHook(() => useDoubleTap(500));

        act(() => {
            result.current.onTouchStart(callback)();
        });

        mockNow = 1400;
        act(() => {
            result.current.onTouchStart(callback)();
        });

        expect(callback).toHaveBeenCalledTimes(1);
    });
});