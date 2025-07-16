/* eslint-disable no-unused-vars */
import '@testing-library/jest-dom';

class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

global.ResizeObserver = ResizeObserver;