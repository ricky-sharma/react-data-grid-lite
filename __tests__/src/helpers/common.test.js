/* eslint-disable no-undef */
import { capitalize, convertViewportUnitToPixels, getContainerWidthInPixels, isEqual, isNull, normalize } from './../../../src/helpers/common';

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

    it('returns width using clientWidth', () => {
        const div = document.createElement('div');
        Object.defineProperty(div, 'clientWidth', { value: 300 });
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

describe('isEqual', () => {
    it('returns true for primitive equality', () => {
        expect(isEqual(1, 1)).toBe(true);
        expect(isEqual('hello', 'hello')).toBe(true);
        expect(isEqual(null, null)).toBe(true);
    });

    it('returns false for different types', () => {
        expect(isEqual(1, '1')).toBe(false);
        expect(isEqual(null, {})).toBe(false);
        expect(isEqual([], {})).toBe(false);
    });

    it('compares flat objects', () => {
        expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
        expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
        expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it('compares nested objects', () => {
        expect(isEqual({ a: { b: 2 } }, { a: { b: 2 } })).toBe(true);
        expect(isEqual({ a: { b: 2 } }, { a: { b: 3 } })).toBe(false);
    });

    it('compares arrays', () => {
        expect(isEqual([1, 2], [1, 2])).toBe(true);
        expect(isEqual([1, 2], [2, 1])).toBe(false);
        expect(isEqual([1, { a: 2 }], [1, { a: 2 }])).toBe(true);
        expect(isEqual([1, { a: 2 }], [1, { a: 3 }])).toBe(false);
    });

    it('handles deeply nested structures', () => {
        const obj1 = { a: { b: { c: { d: [1, 2, 3] } } } };
        const obj2 = { a: { b: { c: { d: [1, 2, 3] } } } };
        const obj3 = { a: { b: { c: { d: [1, 2, 4] } } } };
        expect(isEqual(obj1, obj2)).toBe(true);
        expect(isEqual(obj1, obj3)).toBe(false);
    });

    it('returns false if keys mismatch', () => {
        expect(isEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
    });
});

describe('capitalize', () => {
    it('should capitalize the first letter of a lowercase word', () => {
        expect(capitalize('hello')).toBe('Hello');
    });

    it('should return the same string if the first letter is already capitalized', () => {
        expect(capitalize('Hello')).toBe('Hello');
    });

    it('should capitalize a single character string', () => {
        expect(capitalize('a')).toBe('A');
    });

    it('should return an empty string if input is an empty string', () => {
        expect(capitalize('')).toBe('');
    });

    it('should return an empty string if input is null', () => {
        expect(capitalize(null)).toBe('');
    });

    it('should return an empty string if input is undefined', () => {
        expect(capitalize(undefined)).toBe('');
    });

    it('should return an empty string if input is a number', () => {
        expect(capitalize(123)).toBe('');
    });

    it('should not modify strings starting with a number', () => {
        expect(capitalize('123abc')).toBe('123abc');
    });

    it('should preserve the rest of the string', () => {
        expect(capitalize('testCase')).toBe('TestCase');
    });

    it('should return an empty string for non-string objects', () => {
        expect(capitalize({})).toBe('');
        expect(capitalize([])).toBe('');
        expect(capitalize(() => { })).toBe('');
    });
});

describe('normalize', () => {
    it('should normalize accented characters', () => {
        const result = normalize('Café');
        expect(result).toBe('cafe');
    });

    it('should convert to lowercase', () => {
        const result = normalize('HELLO');
        expect(result).toBe('hello');
    });

    it('should normalize a string with multiple accents', () => {
        const result = normalize('àéîõü');
        expect(result).toBe('aeiou');
    });

    it('should handle a mix of normal and accented characters', () => {
        const result = normalize('JoSé ÁlVàRéz');
        expect(result).toBe('jose alvarez');
    });

    it('should return empty string for empty input', () => {
        expect(normalize('')).toBe('');
    });

    it('should handle numbers and symbols', () => {
        const result = normalize('1234-+=!@#');
        expect(result).toBe('1234-+=!@#');
    });

    it('should return undefined for undefined input', () => {
        expect(normalize(undefined)).toBeUndefined();
    });

    it('should convert non-string input to string before processing', () => {
        expect(normalize(123)).toBe('123');
        expect(normalize(null)).toBe(undefined);
        expect(normalize(true)).toBe('true');
    });

    it('should strip diacritics and normalize combined characters', () => {
        const result = normalize('e\u0301');
        expect(result).toBe('e');
    });
});


describe('More getContainerWidthInPixels tests', () => {
    let container;

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('returns default width if element is null', () => {
        expect(getContainerWidthInPixels(null, 123)).toBe(123);
    });

    it('returns default width if element is not in DOM', () => {
        const dummy = {};
        expect(getContainerWidthInPixels(dummy, 456)).toBe(456);
    });

    it('returns width minus padding for valid HTMLElement', () => {
        container = document.createElement('div');
        container.style.width = '200px';
        container.style.paddingLeft = '10px';
        container.style.paddingRight = '10px';
        container.style.boxSizing = 'border-box';

        document.body.appendChild(container);

        Object.defineProperty(container, 'clientWidth', { value: 200 });

        const result = getContainerWidthInPixels(container);
        expect(result).toBe(180);
    });

    it('works with selector string if element exists', () => {
        const el = document.createElement('div');
        el.id = 'my-test-container';
        el.style.width = '300px';
        el.style.paddingLeft = '20px';
        el.style.paddingRight = '10px';
        document.body.appendChild(el);

        Object.defineProperty(el, 'clientWidth', { value: 300 });

        const result = getContainerWidthInPixels('#my-test-container');
        expect(result).toBe(270);
    });

    it('falls back to computed style width if clientWidth is 0', () => {
        const el = document.createElement('div');
        el.style.width = '250px';
        el.style.paddingLeft = '0px';
        el.style.paddingRight = '0px';
        document.body.appendChild(el);

        Object.defineProperty(el, 'clientWidth', { value: 0 });

        const result = getContainerWidthInPixels(el);
        expect(result).toBe(250);
    });

    it('falls back to parentElement width if own width is 0', () => {
        const parent = document.createElement('div');
        const child = document.createElement('div');

        parent.style.width = '400px';
        Object.defineProperty(parent, 'clientWidth', { value: 400 });

        parent.appendChild(child);
        document.body.appendChild(parent);

        Object.defineProperty(child, 'clientWidth', { value: 0 });

        const result = getContainerWidthInPixels(child);
        expect(result).toBe(400);
    });

    it('returns default if no width available even in parent', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);

        Object.defineProperty(el, 'clientWidth', { value: 0 });

        const result = getContainerWidthInPixels(el, 999);
        expect(result).toBe(999);
    });

    it('falls back to defaultWidth when cs.width throws in parseFloat', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);

        Object.defineProperty(el, 'clientWidth', { value: 0 });

        const mockComputedStyle = {
            paddingLeft: '10px',
            paddingRight: '10px',
            get width() {
                throw new Error('Simulated width error');
            }
        };

        const originalGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = jest.fn(() => mockComputedStyle);

        const defaultWidth = 456;
        const result = getContainerWidthInPixels(el, defaultWidth);

        expect(result).toBe(defaultWidth);

        window.getComputedStyle = originalGetComputedStyle;
    });
});