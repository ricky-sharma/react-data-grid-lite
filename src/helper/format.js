import { formatDate } from "./date";

/**
 * Formats a given value based on type and format. For currency type, `format` is used as the currency code.
 */
export function format(value, type, format) {
    if (value == null || type == null) return value;

    const normalizedType = type.toLowerCase();

    if (typeof value === 'string') {
        if (
            (normalizedType === 'currency' && /[€$¥£₹A-Za-z]/.test(value)) ||
            (normalizedType === 'percent' && /%$/.test(value)) ||
            (normalizedType === 'boolean' && /^(Yes|No)$/i.test(value))
        ) {
            value = value.replace(/[^\d.-]/g, '');
        }
        if (normalizedType === 'number' || normalizedType === 'currency') {
            value = value.replace(/,/g, '');
        }
    }
    switch (normalizedType) {
        case 'number':
            return format === '0,0'
                ? new Intl.NumberFormat('en-US').format(value)
                : format === '0.00'
                    ? parseFloat(value).toFixed(2)
                    : value;

        case 'currency':
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: (format || 'USD').toUpperCase(),
                maximumFractionDigits: 2,
            }).format(value);

        case 'date':
            return formatDate(value, format);

        case 'percent':
            return `${(value * 100).toFixed(0)}%`;

        case 'boolean':
            return value ? 'Yes' : 'No';

        default:
            return value;
    }
}