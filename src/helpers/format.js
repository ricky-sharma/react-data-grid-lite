import { formatDate } from "./date";

/**
 * Formats a given value based on type and format.
 * For `currency`, `format` is used as the currency code.
 */
export function format(value, type, format) {
    if (value == null || type == null) return value;

    const originalVal = value;
    const t = type.toLowerCase();

    if (typeof value === 'string') {
        if (t === 'boolean') {
            if (!/^(yes|no)$/i.test(value.trim())) return originalVal;
        }

        if (t === 'currency') {
            if (!/\d/.test(value)) return originalVal;
            value = value.replace(/[^\d.-]/g, '');
        }

        if (t === 'percent') {
            value = value.replace(/%/g, '');
            if (isNaN(value) || !/\d/.test(value)) return originalVal;
        }

        if (['number', 'currency', 'percent'].includes(t)) {
            value = value.replace(/,/g, '');
            if (isNaN(value)) return originalVal;
            value = Number(value);
        }
    }

    switch (t) {
        case 'number':
            return format === '0,0'
                ? new Intl.NumberFormat('en-US').format(value)
                : format === '0.00'
                    ? value.toFixed(2)
                    : originalVal;

        case 'currency':
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: (format || 'USD').toUpperCase(),
                maximumFractionDigits: 2,
            }).format(value);

        case 'date':
            return formatDate(value, format);

        case 'percent':
            return isNaN(value) ? originalVal : `${(value * 100).toFixed(0)}%`;

        case 'boolean':
            return value === true || /^yes$/i.test(value) ? 'Yes' : 'No';

        default:
            return originalVal;
    }
}