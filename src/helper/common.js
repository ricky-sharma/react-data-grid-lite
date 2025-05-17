export function isNull(value) {
    if (value === null || value === undefined) return true;

    if (typeof value === 'string') {
        return value.trim() === '';
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    // Only treat plain objects as null-like
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