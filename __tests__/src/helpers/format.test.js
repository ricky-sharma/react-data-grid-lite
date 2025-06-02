/* eslint-disable no-undef */
jest.mock('../../../src/helpers/date', () => ({
    formatDate: jest.fn(() => 'formatted-date')
}));


import { formatDate } from '../../../src/helpers/date';
import { format } from '../../../src/helpers/format';

describe('format()', () => {
    describe('early returns', () => {
        it('returns original value if value is null or undefined', () => {
            expect(format(null, 'number')).toBe(null);
            expect(format(undefined, 'currency')).toBe(undefined);
        });

        it('returns original value if type is null or undefined', () => {
            expect(format(123, null)).toBe(123);
            expect(format(123, undefined)).toBe(123);
        });
    });

    describe('number formatting', () => {
        it('formats number with 0,0 format', () => {
            expect(format(1234567, 'number', '0,0')).toBe('1,234,567');
            expect(format('1234567', 'number', '0,0')).toBe('1,234,567');
        });

        it('formats number with 0.00 format', () => {
            expect(format(1234.567, 'number', '0.00')).toBe('1234.57');
            expect(format('1234.567', 'number', '0.00')).toBe('1234.57');
        });

        it('returns original value for unsupported number format', () => {
            expect(format(1234.567, 'number', 'xyz')).toBe(1234.567);
        });

        it('returns original value for invalid number input', () => {
            expect(format('abc123', 'number', '0,0')).toBe('abc123');
        });
    });

    describe('currency formatting', () => {
        it('formats currency string with $ symbol', () => {
            expect(format('$1,234.56', 'currency', 'USD')).toBe('$1,234.56');
        });

        it('formats number as currency', () => {
            expect(format(1234.56, 'currency', 'USD')).toBe('$1,234.56');
        });

        it('defaults to USD if no currency code provided', () => {
            expect(format(1000, 'currency')).toBe('$1,000.00');
        });

        it('returns original value for invalid currency input', () => {
            expect(format('abc', 'currency', 'USD')).toBe('abc');
        });
    });

    describe('percent formatting', () => {
        it('formats number as percent', () => {
            expect(format(0.45, 'percent')).toBe('45%');
            expect(format('0.25', 'percent')).toBe('25%');
        });

        it('strips % sign and formats correctly', () => {
            expect(format('50%', 'percent')).toBe('5000%');
        });

        it('returns original value if percent is not a number', () => {
            expect(format('abc%', 'percent')).toBe('abc%');
        });
    });

    describe('boolean formatting', () => {
        it('formats true/false values', () => {
            expect(format(true, 'boolean')).toBe('Yes');
            expect(format(false, 'boolean')).toBe('No');
        });

        it('handles string input "Yes"/"No"', () => {
            expect(format('Yes', 'boolean')).toBe('Yes');
            expect(format('No', 'boolean')).toBe('No');
        });

        it('returns original value for invalid boolean input', () => {
            expect(format('maybe', 'boolean')).toBe('maybe');
        });
    });

    describe('date formatting', () => {
        it('calls formatDate with correct arguments', () => {
            const result = format('2024-05-01', 'date', 'dd/MM/yyyy');
            expect(result).toBe('formatted-date');
            expect(formatDate).toHaveBeenCalledWith('2024-05-01', 'dd/MM/yyyy');
        });
    });

    describe('default case', () => {
        it('returns original value for unknown type', () => {
            expect(format('test', 'unknownType')).toBe('test');
        });
    });
});