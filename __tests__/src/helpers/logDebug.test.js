// logDebug.test.js
import { logDebug } from '../../../src/helpers/logDebug';

describe('logDebug', () => {
    const originalConsole = { ...console };

    beforeEach(() => {
        console.log = jest.fn();
        console.warn = jest.fn();
        console.error = jest.fn();
        console.info = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
        Object.assign(console, originalConsole);
    });

    it('does nothing if debug is false', () => {
        logDebug(false, 'log', 'This should not log');
        expect(console.log).not.toHaveBeenCalled();
    });

    it('logs using console.log by default', () => {
        logDebug(true, 'log', 'Message');
        expect(console.log).toHaveBeenCalledWith('[react-data-grid-lite]', 'Message');
    });

    it('logs using console.warn', () => {
        logDebug(true, 'warn', 'Warning!');
        expect(console.warn).toHaveBeenCalledWith('[react-data-grid-lite]', 'Warning!');
    });

    it('logs using console.error', () => {
        logDebug(true, 'error', 'Something went wrong');
        expect(console.error).toHaveBeenCalledWith('[react-data-grid-lite]', 'Something went wrong');
    });

    it('logs using console.info', () => {
        logDebug(true, 'info', 'Just info');
        expect(console.info).toHaveBeenCalledWith('[react-data-grid-lite]', 'Just info');
    });

    it('falls back to console.log if type is invalid', () => {
        logDebug(true, 'invalid', 'Fallback log');
        expect(console.log).toHaveBeenCalledWith('[react-data-grid-lite]', 'Fallback log');
    });

    it('handles multiple args', () => {
        logDebug(true, 'log', 'First', { key: 'value' }, [1, 2, 3]);
        expect(console.log).toHaveBeenCalledWith(
            '[react-data-grid-lite]',
            'First',
            { key: 'value' },
            [1, 2, 3]
        );
    });
});