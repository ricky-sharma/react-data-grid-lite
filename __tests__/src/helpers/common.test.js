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