/* eslint-disable no-undef */
class ResizeObserver {
    constructor(callback) {
        this.callback = callback;
        this.elements = new Set();
    }

    observe(element) {
        this.elements.add(element);
        this.trigger(element);
    }

    unobserve(element) {
        this.elements.delete(element);
    }

    disconnect() {
        this.elements.clear();
    }

    trigger(element, height = 100) {
        const entry = {
            target: element,
            contentRect: { height },
        };
        this.callback([entry]);
    }
}

global.ResizeObserver = ResizeObserver;

import React, { useRef } from 'react';
import { render, act } from '@testing-library/react';
import { useElementHeight } from '../../../src/hooks/use-element-height';

describe('useElementHeight', () => {
    it('updates height when element resizes', () => {
        let resizeObserverInstance;

        global.ResizeObserver = class {
            constructor(callback) {
                this.callback = callback;
                this.elements = new Set();
                resizeObserverInstance = this;
            }

            observe(element) {
                this.elements.add(element);
                this.callback([{ target: element, contentRect: { height: 50 } }]);
            }

            disconnect() {
                this.elements.clear();
            }

            trigger(element, height) {
                this.callback([{ target: element, contentRect: { height } }]);
            }
        };

        const TestComponent = () => {
            const ref = useRef(null);
            const height = useElementHeight(ref);

            return (
                <div>
                    <div data-testid="target" ref={ref}>Test</div>
                    <div data-testid="height">{height}</div>
                </div>
            );
        };

        const { getByTestId } = render(<TestComponent />);
        const heightDisplay = getByTestId('height');
        const target = getByTestId('target');

        expect(heightDisplay.textContent).toBe('50');

        act(() => {
            resizeObserverInstance.trigger(target, 120);
        });

        expect(heightDisplay.textContent).toBe('120');
    });

    it('cleans up on unmount', () => {
        const disconnectMock = jest.fn();

        global.ResizeObserver = class {
            constructor() { }
            observe() { }
            disconnect = disconnectMock;
        };

        const TestComponent = () => {
            const ref = useRef(null);
            useElementHeight(ref);
            return <div ref={ref}>Hello</div>;
        };

        const { unmount } = render(<TestComponent />);
        unmount();

        expect(disconnectMock).toHaveBeenCalled();
    });

    it('should not create ResizeObserver when ref.current is null', () => {
        const observeMock = jest.fn();
        const disconnectMock = jest.fn();

        global.ResizeObserver = class {
            constructor() { }
            observe = observeMock;
            disconnect = disconnectMock;
        };

        const TestComponent = () => {
            const ref = useRef(null);
            useElementHeight(ref);
            return <div>Nothing to observe</div>;
        };

        render(<TestComponent />);

        expect(observeMock).not.toHaveBeenCalled();
        expect(disconnectMock).not.toHaveBeenCalled();
    });

    it('should not update height if entry.target !== element', () => {
        let resizeObserverInstance;

        global.ResizeObserver = class {
            constructor(callback) {
                this.callback = callback;
                resizeObserverInstance = this;
            }

            observe(element) {
                this.element = element;
                this.callback([{ target: element, contentRect: { height: 100 } }]);
            }

            disconnect() { }
            triggerWrongElement(fakeElement, height) {
                this.callback([{ target: fakeElement, contentRect: { height } }]);
            }
        };

        const TestComponent = () => {
            const ref = useRef(null);
            const height = useElementHeight(ref);
            return (
                <div>
                    <div data-testid="target" ref={ref}>Hello</div>
                    <div data-testid="height">{height}</div>
                </div>
            );
        };

        const { getByTestId } = render(<TestComponent />);
        const heightDisplay = getByTestId('height');
        expect(heightDisplay.textContent).toBe('100');
        act(() => {
            const fakeElement = document.createElement('div');
            resizeObserverInstance.triggerWrongElement(fakeElement, 300);
        });
        expect(heightDisplay.textContent).toBe('100');
    });
});
