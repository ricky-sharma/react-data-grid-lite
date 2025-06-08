/* eslint-disable no-undef */
import { convertViewportUnitToPixels, getContainerWidthInPixels, isNull } from './../../../src/helpers/common';

describe('isNull', () => {
    it('returns true for null, undefined, NaN', () => {
        expect(isNull(null)).toBe(true);
        expect(isNull(undefined)).toBe(true);
        expect(isNull(NaN)).toBe(true);
    });

    it('returns true for empty string or whitespace', () => {
        expect(isNull('')).toBe(true);
        expect(isNull('   ')).toBe(true);
    });

    it('returns true for empty array', () => {
        expect(isNull([])).toBe(true);
    });

    it('returns true for empty object', () => {
        expect(isNull({})).toBe(true);
    });

    it('returns false for non-empty values', () => {
        expect(isNull('abc')).toBe(false);
        expect(isNull([1])).toBe(false);
        expect(isNull({ a: 1 })).toBe(false);
        expect(isNull(0)).toBe(false);
        expect(isNull(false)).toBe(false);
    });
});

describe('getContainerWidthInPixels', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        jest.restoreAllMocks();
    });

    it('returns width using offsetWidth', () => {
        const div = document.createElement('div');
        Object.defineProperty(div, 'offsetWidth', { value: 300 });
        document.body.appendChild(div);
        expect(getContainerWidthInPixels(div)).toBe(300);
    });

    it('returns width from computedStyle if offsetWidth is 0', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
            width: '500px',
        }));
        const width = getContainerWidthInPixels(div);
        expect(width).toBe(500);
        window.getComputedStyle.mockRestore();
        document.body.removeChild(div);
    });

    it('returns fallback width if element is null', () => {
        expect(getContainerWidthInPixels(null, 100)).toBe(100);
    });
});

describe('convertViewportUnitToPixels', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1000 });
        Object.defineProperty(document.documentElement, 'clientWidth', { value: 1000 });
    });

    it('converts vw string to pixels', () => {
        expect(convertViewportUnitToPixels('50vw')).toBe(500);
        expect(convertViewportUnitToPixels('100vw')).toBe(1000);
    });

    it('falls back to fallbackVwValue if input is invalid', () => {
        expect(convertViewportUnitToPixels('invalid', '80vw')).toBe(800);
    });

    it('uses 90% of window width if both fail', () => {
        expect(convertViewportUnitToPixels('invalid', 'also-invalid')).toBe(900);
    });
});
