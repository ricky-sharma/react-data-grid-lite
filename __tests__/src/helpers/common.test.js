/* eslint-disable no-undef */
import { cleanup } from '@testing-library/react';
import { Container_Identifier, Loader_Identifier } from '../../../src/constants';
import { convertViewportUnitToPixels, getContainerWidthInPixels, hideLoader, isEqual, isNull, showLoader } from './../../../src/helpers/common';

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
        showLoader('nonExistentId');
        expect(document.querySelector(`.${Loader_Identifier}`)).toBeNull();
    });

    it('does nothing if container is not found inside parent', () => {
        // Remove grid container
        document.getElementById('testParent').innerHTML = '';
        showLoader('testParent');
        expect(document.querySelector(`.${Loader_Identifier}`)).toBeNull();
    });

    it('adds loader with dots if no message is provided', () => {
        showLoader('testParent');

        const overlay = document.querySelector(`.${Loader_Identifier}`);
        expect(overlay).toBeInTheDocument();
        expect(overlay.querySelector('.dot-loader')).toBeInTheDocument();
        expect(overlay.textContent).toBe(''); // Only dots, no text
    });

    it('adds loader with message if message is provided', () => {
        showLoader('testParent', 'Loading data...');

        const overlay = document.querySelector(`.${Loader_Identifier}`);
        expect(overlay).toBeInTheDocument();
        expect(overlay.textContent).toBe('Loading data...');
        expect(overlay.querySelector('.dot-loader')).not.toBeInTheDocument();
    });

    it('does not add loader if one already exists', () => {
        showLoader('testParent');
        showLoader('testParent'); // second call should do nothing

        const overlays = document.querySelectorAll(`.${Loader_Identifier}`);
        expect(overlays.length).toBe(1);
    });

    it('container position is set to relative if it was static', () => {
        const container = document.querySelector(Container_Identifier);
        expect(container.style.position).toBe('static');

        showLoader('testParent');

        expect(container.style.position).toBe('relative');
    });

    it('hideLoader removes the loader overlay', () => {
        showLoader('testParent');
        let overlay = document.querySelector(`.${Loader_Identifier}`);
        expect(overlay).toBeInTheDocument();

        hideLoader('testParent');
        overlay = document.querySelector(`.${Loader_Identifier}`);
        expect(overlay).toBeNull();
    });
});