/* eslint-disable no-undef */
import { formatDate } from './../../../src/helpers/date'; 

describe('formatDate', () => {
    const date = new Date('2024-06-02T14:30:45.123');

    it('returns empty string for null or undefined date', () => {
        expect(formatDate(null, 'yyyy-MM-dd')).toBe('');
        expect(formatDate(undefined, 'yyyy-MM-dd')).toBe('');
    });

    it('returns empty string for invalid date', () => {
        expect(formatDate('invalid-date', 'yyyy-MM-dd')).toBe('');
    });

    it('uses default format if format string is missing or invalid', () => {
        expect(formatDate(date, '')).toBe('2024-06-02');
        expect(formatDate(date, null)).toBe('2024-06-02');
        expect(formatDate(date)).toBe('2024-06-02');
    });

    it('formats basic date components correctly', () => {
        expect(formatDate(date, 'yyyy-MM-dd')).toBe('2024-06-02');
        expect(formatDate(date, 'HH:mm:ss')).toBe('14:30:45');
        expect(formatDate(date, 'hh:mm a')).toBe('02:30 PM');
    });

    it('formats weekday and month names correctly', () => {
        expect(formatDate(date, 'EEEE')).toMatch(/Sunday/);
        expect(formatDate(date, 'EEE')).toMatch(/Sun/);
        expect(formatDate(date, 'MMMM')).toBe('June');
        expect(formatDate(date, 'MMM')).toBe('Jun');
    });

    it('formats ordinal day correctly with "do"', () => {
        expect(formatDate(new Date('2024-06-01T00:00:00Z'), 'do')).toBe('1st');
        expect(formatDate(new Date('2024-06-02T00:00:00Z'), 'do')).toBe('2nd');
        expect(formatDate(new Date('2024-06-03T00:00:00Z'), 'do')).toBe('3rd');
        expect(formatDate(new Date('2024-06-04T00:00:00Z'), 'do')).toBe('4th');
        expect(formatDate(new Date('2024-06-11T00:00:00Z'), 'do')).toBe('11th');
    });

    it('returns full time zone name with "ZZZZ"', () => {
        const formatted = formatDate(date, 'ZZZZ', 'en-US', 'UTC');
        expect(formatted).toMatch(/Coordinated Universal Time|UTC/);
    });

    it('handles different locales', () => {
        const french = formatDate(date, 'EEEE', 'fr-FR', 'UTC');
        expect(french).toMatch(/dimanche/i);
    });

    it('returns milliseconds with "S"', () => {
        expect(formatDate(date, 'S')).toBe('123');
    });

    it('handles compound format strings', () => {
        const output = formatDate(date, 'yyyy-MM-dd HH:mm:ss a do EEEE');
        expect(output).toMatch(/2024-06-02 14:30:45 PM 2nd Sunday/);
    });

    it('returns either "DST" or "Non-DST"', () => {
        const July = new Date('2024-07-01T12:00:00');
        const January = new Date('2024-01-01T12:00:00');

        let result = formatDate(July, 'DST');
        expect(['DST', 'Non-DST']).toContain(result);
        result = formatDate(January, 'DST');
        expect(['DST', 'Non-DST']).toContain(result);
    });

    it('includes time zone offset using "Z"', () => {
        const offset = -new Date().getTimezoneOffset();
        const sign = offset >= 0 ? '+' : '-';
        const absOffset = Math.abs(offset);
        const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
        const minutes = String(absOffset % 60).padStart(2, '0');
        const localTimeZone =  `${sign}${hours}${minutes}`;
        const formatted = formatDate(date, 'Z', 'en-US', 'UTC');
        expect(formatted).toBe(localTimeZone);
    });
});
