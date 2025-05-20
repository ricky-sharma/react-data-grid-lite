import { formatDate } from "./date";

/**
 * Formats a given value based on the specified type, format, and optional currency code.
 * This function supports various types including 'number', 'currency', 'date', 'percent', and 'boolean'.
 * It uses locale-sensitive formatting for different types and currencies, leveraging JavaScript's 
 * `Intl.NumberFormat` and `Intl.DateTimeFormat` APIs.
 *
 * @param {any} value - The value to be formatted. This can be a number, string (for dates), or boolean, among others.
 * @param {string} type - The type of the value. Valid options are:
 *    - 'number' for numeric values.
 *    - 'currency' for formatting as currency.
 *    - 'date' for formatting as a date string.
 *    - 'percent' for formatting decimal values as percentages.
 *    - 'boolean' for formatting boolean values as 'Yes'/'No'.
 * @param {string} [format] - The format to be applied to the value. For example:
 *    - For 'number': '0,0' for adding commas as thousands separators or '0.00' for fixing decimal places.
 *    - For 'currency': Currency symbol and decimal formatting (e.g., 'USD').
 *    - For 'date': The desired date format (e.g., 'MM/DD/YYYY').
 * @param {string} [currencyCode='USD'] - The currency code for 'currency' formatting.
 *  Default is 'USD'. Valid options are any valid ISO currency codes like 'EUR', 'AUD', 'GBP', etc.
 *
 * @returns {string|number} The formatted value based on the provided type and format.
 *    - If 'number', returns the number formatted with thousands separators or fixed decimals.
 *    - If 'currency', returns the number formatted as a currency with the specified currency symbol.
 *    - If 'date', returns the formatted date string.
 *    - If 'percent', returns the decimal value as a percentage (e.g., '50%').
 *    - If 'boolean', returns 'Yes' for true and 'No' for false.
 */
export function format(value, type, format, currencyCode = 'USD') {
    if (value == null || type == null) return value;

    // Normalize type and currencyCode to lower case for case-insensitivity
    const normalizedType = type.toLowerCase();
    const normalizedCurrencyCode = currencyCode.toUpperCase();

    // Check if the value is already formatted (basic check for currency symbol, commas, or percentage sign)
    if (typeof value === 'string') {
        // Skip if the value is already formatted as currency (e.g., "$83,000" or "€1,234.56")
        if (
            (normalizedType === 'currency' && /[€$¥£₹A-Za-z]/.test(value)) ||
            (normalizedType === 'percent' && /%$/.test(value)) ||
            (normalizedType === 'boolean' && /^(Yes|No)$/i.test(value))
        ) {
            // If value is already formatted (currency, percent, boolean), continue with reformatting
            // Remove non-numeric characters (commas, currency symbols)
            value = value.replace(/[^\d.-]/g, ''); // Strip out any characters except digits, decimals, and minus signs
        }

        // Remove commas for currency or number formatting
        if (normalizedType === 'number' || normalizedType === 'currency') {
            value = value.replace(/,/g, '');  // Remove commas
        }
    }

    switch (normalizedType) {
        case 'number':
            if (format === '0,0') {
                return new Intl.NumberFormat('en-US').format(value);
            } else if (format === '0.00') {
                return value.toFixed(2);
            }
            return value;

        case 'currency':
            // Always reformat currency with the symbol and add .00 if needed
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: normalizedCurrencyCode,  // Normalize to uppercase
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
