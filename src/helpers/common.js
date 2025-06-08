/**
 * Checks if a value is considered "null-like" — including:
 * - null
 * - undefined
 * - NaN
 * - empty string (after trimming)
 * - empty array
 * - empty plain object
 *
 * @param {*} value - The value to check.
 * @returns {boolean} True if value is null-like, false otherwise.
 */
export function isNull(value) {
    if (value === null || value === undefined || Number.isNaN(value)) {
        return true;
    }

    if (typeof value === 'string') {
        return value.trim() === '';
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    if (
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype
    ) {
        return Object.keys(value).length === 0;
    }

    return false;
}

export const isEqual = (a, b) => {
    if (a === b) return true;

    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
        return false;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (let key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!isEqual(a[key], b[key])) return false;
    }

    return true;
}

/**
 * Returns the pixel width of a container element, with fallbacks.
 * @param {string|HTMLElement} element - A selector string or a DOM element.
 * @param {number} [defaultWidth=0] - Optional fallback width if unable to determine.
 * @returns {number} - The width in pixels.
 */
export function getContainerWidthInPixels(element, defaultWidth = 0) {
    let el = typeof element === 'string' ? document.querySelector(element) : element;

    // If element doesn't exist
    if (isNull(el)) {
        return defaultWidth;
    }

    // Try offsetWidth first
    let width = el.offsetWidth;

    // If offsetWidth is 0 (invisible, not rendered, etc.)
    if (!width) {
        try {
            width = parseFloat(window.getComputedStyle(el).width);

            // eslint-disable-next-line no-unused-vars
        } catch (e) { /* empty */ }
    }

    // Fallback to parent element width if still invalid
    if (!width && el.parentElement) {
        width = el.parentElement.offsetWidth || parseFloat(window.getComputedStyle(el.parentElement).width);
    }

    // Final fallback
    if (!width) {
        return defaultWidth;
    }

    return width;
}

/**
 * Converts a viewport width unit string like '90vw' to pixels.
 * Falls back to another vw-based value (e.g., '90vw') if invalid.
 *
 * @param {string} viewportValue - A string like '90vw'
 * @param {string} fallbackVwValue - Fallback vw string (e.g., '90vw')
 * @returns {number} - Pixel equivalent
 */
export function convertViewportUnitToPixels(viewportValue, fallbackVwValue = '90vw') {
    const parseVw = (vwString) => {
        const match = vwString.trim().match(/^([\d.]+)vw$/);
        if (match) {
            const vw = parseFloat(match[1]);
            const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            return (vw / 100) * viewportWidth;
        }
        return null;
    };

    let result = parseVw(viewportValue);
    if (result === null) {
        result = parseVw(fallbackVwValue);
    }

    // Fallback for the fallback (just in case both fail)
    return result ?? (window.innerWidth * 0.9); // 80vw hard fallback
}