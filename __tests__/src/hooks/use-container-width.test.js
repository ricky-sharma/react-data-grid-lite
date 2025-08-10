/* eslint-disable no-undef */
import { renderHook, act } from '@testing-library/react';
import useContainerWidth from '../../../src/hooks/use-container-width';
import { Container_Identifier } from '../../../src/constants';

const observeMock = jest.fn();
const unobserveMock = jest.fn();

class ResizeObserverMock {
    constructor(callback) {
        this.callback = callback;
    }
    observe = observeMock;
    unobserve = unobserveMock;
    disconnect = jest.fn();
}

describe('useContainerWidth', () => {
    let originalResizeObserver;

    beforeAll(() => {
        originalResizeObserver = global.ResizeObserver;
        global.ResizeObserver = ResizeObserverMock;
    });

    afterAll(() => {
        global.ResizeObserver = originalResizeObserver;
    });

    beforeEach(() => {
        observeMock.mockClear();
        unobserveMock.mockClear();
        document.body.innerHTML = '';
    });

    it('should not set width if element is not found', () => {
        const { result } = renderHook(() => useContainerWidth('testGrid'));

        expect(result.current).toBe(0);
        expect(observeMock).not.toHaveBeenCalled();
    });

    it('should observe the element and update width when ResizeObserver is triggered', () => {
        const mockElement = document.createElement('div');
        mockElement.style.width = '300px';
        Object.defineProperty(mockElement, 'clientWidth', { value: 300 });
        mockElement.setAttribute('id', 'container');

        const gridWrapper = document.createElement('div');
        gridWrapper.setAttribute('id', 'testGrid');
        gridWrapper.appendChild(mockElement);
        document.body.appendChild(gridWrapper);

        document.querySelector = jest.fn(
            () => document.querySelector(`#testGrid ${Container_Identifier}`)
        ).mockImplementation(() => mockElement);

        const { result, unmount } = renderHook(() => useContainerWidth('testGrid'));
        act(() => {
            const roInstance = observeMock.mock.instances[0];
            roInstance.callback();
        });

        expect(result.current).toBe(300);
        expect(observeMock).toHaveBeenCalledWith(mockElement);
        unmount();
        expect(unobserveMock).toHaveBeenCalledWith(mockElement);
    });

    it('should not break if ResizeObserver is undefined', () => {
        delete global.ResizeObserver;

        const mockElement = document.createElement('div');
        document.querySelector = jest.fn().mockReturnValue(mockElement);

        const { result } = renderHook(() => useContainerWidth('testGrid'));
        expect(result.current).toBe(0);
    });
});
