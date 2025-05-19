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

// Helper function to match key case-insensitively
export const objectKeyMatch = (obj, keyName) =>
    Object.keys(obj).some(k => k.toLowerCase() === keyName.toLowerCase());

// Helper function to compare two objects
export const objectsEqual = (o1, o2) =>
    (isNull(o1) && isNull(o2)) ||
    (!isNull(o1) &&
        !isNull(o2) &&
        typeof o1 === 'object' &&
        typeof o2 === 'object' &&
        Object.keys(o1).length === Object.keys(o2).length &&
        Object.keys(o1).every(key => o1[key] === o2[key]));