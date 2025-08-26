jest.mock('./../../../src/constants', () => ({
    Button_Column_Key: 'button',
    Fallback_Column_Width: '75px',
    Default_Grid_Width_VW: '80vw'
}));

jest.mock('./../../../src/helpers/common', () => {
    const actual = jest.requireActual('./../../../src/helpers/common');
    return {
        ...actual,
        convertViewportUnitToPixels: jest.fn(() => 1000),
        getContainerWidthInPixels: jest.fn(() => 800),
    };
});


jest.mock('../../../src/helpers/format', () => ({
    format: jest.fn(x => x)
}));

import * as helpers from '../../../src/helpers/format';
import * as common from './../../../src/helpers/common';
import { calculateColumnWidth, formatRowData, getNormalizedCombinedValue, resolveColumnItems, resolveColumnType, tryParseWidth } from './../../../src/utils/component-utils';

describe('calculateColumnWidth', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        common.convertViewportUnitToPixels.mockReturnValue(1000);
        common.getContainerWidthInPixels.mockReturnValue(800);
    });

    it('returns "0%" if colWidthArray is not an array', () => {
        expect(calculateColumnWidth(null, [], 0)).toBe('100%');
        expect(calculateColumnWidth(undefined, [], 0)).toBe('100%');
    });

    it('handles all fixed columns (stretch if under container width)', () => {
        const result = calculateColumnWidth(['100', '200'], [], 0);
        expect(result).toBe('400px');
    });

    it('handles all fixed columns (keep fixed if exceeds container width)', () => {
        common.getContainerWidthInPixels.mockReturnValue(250);
        const result = calculateColumnWidth(['200', '200'], [], 0);
        expect(result).toBe('200px');
    });

    it('returns fallback width if non-fixed column width less than fallback and atleast one fixed column is present', () => {
        common.getContainerWidthInPixels.mockReturnValue(250);
        const result = calculateColumnWidth(['200', null], [], 1);
        expect(result).toBe('75px');
    });

    it('returns fallback width if non-fixed column width less than fallback and no fixed column is present', () => {
        common.getContainerWidthInPixels.mockReturnValue(100);
        const result = calculateColumnWidth([null, null], [], 0);
        expect(result).toBe('75px');
    });

    it('handles all flexible columns', () => {
        const colWidths = [null, null, null];
        const result = calculateColumnWidth(colWidths, [], 1);
        expect(result).toBe("266.6666666666667px");
    });

    it('handles mixed fixed and flexible columns', () => {
        const colWidths = ['100', null, '150', null];
        const result = calculateColumnWidth(colWidths, [], 1);
        expect(result).toBe("275px");
    });

    it('returns correct width in mobile mode (smaller total fits)', () => {
        const colWidths = ['100', null, '100', null];
        const result = calculateColumnWidth(colWidths, [], 1, false);
        expect(result).toBe('300px');
    });

    it('returns width if total mobile width exceeds container', () => {
        common.getContainerWidthInPixels.mockReturnValue(300);
        const colWidths = [null, null, null];
        const result = calculateColumnWidth(colWidths, [], 1, false);
        expect(result).toBe('100px');
    });

    it('excludes hidden columns from total count', () => {
        const colWidths = ['100px', null, '200px', null];
        const hidden = [0, null, null, 3];
        const result = calculateColumnWidth(colWidths, hidden, 1);
        expect(result).toMatch('600px');
    });

    it('returns 100% if all columns are hidden', () => {
        const result = calculateColumnWidth(['100px', '200px'], [0, 1], 0);
        expect(result).toBe('100%');
    });

    it('returns default px width in fallback scenario', () => {
        const colWidths = ['abc', 'xyz'];
        const result = calculateColumnWidth(colWidths, [], 0);
        expect(result).toBe('400px');
    });
});

describe('formatRowData', () => {
    beforeEach(() => {
        helpers.format.mockReset();
    });

    it('should format simple row without concat or formatting', () => {
        const row = { name: 'Alice', age: 30 };
        const columns = [
            { name: 'name' },
            { name: 'age' }
        ];

        const result = formatRowData(row, columns);
        expect(result).toEqual({ name: 'Alice', age: 30 });
    });

    it('should concatenate columns if concatColumns is defined', () => {
        const row = { first: 'John', last: 'Doe' };
        const columns = [
            { name: 'fullName', concatColumns: { columns: ['first', 'last'], separator: ' ' } },
            { name: 'first' },
            { name: 'last' }
        ];

        const result = formatRowData(row, columns);
        expect(result.fullname).toBe('John Doe');
    });

    it('should use default separator if not defined', () => {
        const row = { first: 'Jane', last: 'Doe' };
        const columns = [
            { name: 'fullName', concatColumns: { columns: ['first', 'last'] } },
            { name: 'first' },
            { name: 'last' }
        ];

        const result = formatRowData(row, columns);
        expect(result.fullname).toBe('Jane Doe');
    });

    it('should format value if formatting is provided', () => {
        helpers.format.mockImplementation((val, type, format) => `formatted(${val})`);

        const row = { dob: '1990-01-01' };
        const columns = [
            {
                name: 'dob',
                formatting: {
                    type: 'date',
                    format: 'MM/DD/YYYY'
                }
            }
        ];

        const result = formatRowData(row, columns);
        expect(result.dob).toBe('formatted(1990-01-01)');
    });

    it('should be case-insensitive for concat column names', () => {
        helpers.format.mockImplementation(val => val);

        const row = { First: 'Alice', LAST: 'Smith' };
        const columns = [
            {
                name: 'fullName',
                concatColumns: { columns: ['first', 'last'], separator: ' ' }
            },
            { name: 'first' },
            { name: 'last' }
        ];

        const result = formatRowData(row, columns);
        expect(result.fullname).toBe('Alice Smith');
    });

    it('should skip missing concat column values gracefully', () => {
        const row = { first: 'Jane' };
        const columns = [
            { name: 'fullName', concatColumns: { columns: ['first', 'last1'], separator: '-' } },
            { name: 'first' },
            { name: 'last' }
        ];

        const result = formatRowData(row, columns);
        expect(result.fullname).toBe('Jane');
    });

    it('should skip formatting if isNull returns true', () => {
        const row = { salary: null };
        const columns = [
            {
                name: 'salary',
                formatting: { type: 'currency', format: '$0,0.00' }
            }
        ];

        const result = formatRowData(row, columns);
        expect(result.salary).toBe(null);
        expect(helpers.format).not.toHaveBeenCalled();
    });
});

describe('getNormalizedCombinedValue', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const obj = {
        a: '  valueA ',
        b: 'valueB',
        c: null,
        d: 'valueD',
    };

    it('formats values if type matches formatType', () => {
        const keys = ['a', 'b', 'd'];
        const formatType = [];
        const type = 'TEXT';
        const format = 'someFormat';

        const result = getNormalizedCombinedValue(obj, keys, formatType, type, format);
        expect(result).toBe('  valuea  valueb valued');
    });

    it('does not format values if type not in formatType', () => {
        const keys = ['a', 'b', 'd'];
        const formatType = ['number'];
        const type = 'text';
        const format = 'someFormat';

        const result = getNormalizedCombinedValue(obj, keys, formatType, type, format);
        expect(result).toBe('  valuea  valueb valued');
    });

    it('filters out null or undefined values', () => {
        const keys = ['a', 'c', 'd'];
        const formatType = [];
        const type = '';
        const format = '';

        const result = getNormalizedCombinedValue(obj, keys, formatType, type, format);

        expect(result).toContain('valuea');
        expect(result).toContain('valued');
        expect(result).not.toContain('null');
    });

    it('uses custom separator if provided', () => {
        const keys = ['a', 'b'];
        const formatType = [];
        const type = '';
        const format = '';
        const separator = ', ';

        const result = getNormalizedCombinedValue(obj, keys, formatType, type, format, separator);
        expect(result).toBe('  valuea , valueb');
    });

    it('applies formatting when type is included in formatType (integration test)', () => {
        const keys = ['a'];
        const formatType = ['number'];
        const type = 'number';
        const format = '';

        const result = getNormalizedCombinedValue({ a: 'a' }, keys, formatType, type, format);
        expect(result).toBe('');
    });
});


describe('resolveColumnType', () => {
    it('should return concatType when it is a string', () => {
        const result = resolveColumnType('number', { type: 'text' });
        expect(result).toBe('number');
    });

    it('should return concatType.type when concatType is object with string type', () => {
        const result = resolveColumnType({ type: 'date' }, 'text');
        expect(result).toBe('date');
    });

    it('should return baseType when concatType is invalid and baseType is a string', () => {
        const result = resolveColumnType(null, 'boolean');
        expect(result).toBe('boolean');
    });

    it('should return baseType.type when baseType is object with string type', () => {
        const result = resolveColumnType(null, { type: 'currency' });
        expect(result).toBe('currency');
    });

    it('should return "text" if neither concatType nor baseType has valid type', () => {
        const result = resolveColumnType({}, {});
        expect(result).toBe('text');
    });

    it('should return "text" if both concatType and baseType are undefined', () => {
        const result = resolveColumnType(undefined, undefined);
        expect(result).toBe('text');
    });

    it('should return "text" if type fields exist but are not strings', () => {
        const result = resolveColumnType({ type: 123 }, { type: true });
        expect(result).toBe('text');
    });

    it('should prioritize concatType over baseType', () => {
        const result = resolveColumnType('email', { type: 'url' });
        expect(result).toBe('email');
    });

    it('should prioritize concatType.type over baseType and baseType.type', () => {
        const result = resolveColumnType({ type: 'json' }, { type: 'xml' });
        expect(result).toBe('json');
    });
});

describe('resolveColumnItems', () => {
    it('should return concatType.values if it is an array', () => {
        const concatType = { values: ['a', 'b', 'c'] };
        const baseType = { values: ['x', 'y'] };

        const result = resolveColumnItems(concatType, baseType);
        expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should return baseType.values if concatType.values is not an array', () => {
        const concatType = { values: null };
        const baseType = { values: ['x', 'y'] };

        const result = resolveColumnItems(concatType, baseType);
        expect(result).toEqual(['x', 'y']);
    });

    it('should return empty array if neither concatType.values nor baseType.values is an array', () => {
        const concatType = { values: null };
        const baseType = { values: null };

        const result = resolveColumnItems(concatType, baseType);
        expect(result).toEqual([]);
    });

    it('should return empty array if both concatType and baseType are undefined', () => {
        const result = resolveColumnItems(undefined, undefined);
        expect(result).toEqual([]);
    });

    it('should return empty array if concatType is undefined and baseType.values is not an array', () => {
        const baseType = { values: 'not-an-array' };

        const result = resolveColumnItems(undefined, baseType);
        expect(result).toEqual([]);
    });

    it('should return empty array if values properties are missing', () => {
        const concatType = {};
        const baseType = {};

        const result = resolveColumnItems(concatType, baseType);
        expect(result).toEqual([]);
    });
});

describe('tryParseWidth', () => {
    it('should parse percentage width correctly', () => {
        expect(tryParseWidth('50%', 200)).toBe(100);
        expect(tryParseWidth('100%', 500)).toBe(500);
        expect(tryParseWidth('0%', 400)).toBe(0);
    });

    it('should return 0 for invalid percentage values', () => {
        expect(tryParseWidth('%', 300)).toBe(0);
        expect(tryParseWidth('abc%', 300)).toBe(0);
    });

    it('should parse pixel values correctly', () => {
        expect(tryParseWidth('150px')).toBe(150);
        expect(tryParseWidth('  75px  ')).toBe(75);
    });

    it('should return 0 for invalid px values', () => {
        expect(tryParseWidth('px')).toBe(0);
        expect(tryParseWidth('abcpx')).toBe(0);
    });

    it('should parse plain number strings', () => {
        expect(tryParseWidth('42')).toBe(42);
        expect(tryParseWidth('  88.5  ')).toBe(88.5);
    });

    it('should return 0 for invalid number strings', () => {
        expect(tryParseWidth('abc')).toBe(0);
        expect(tryParseWidth('')).toBe(0);
    });

    it('should return number as-is if input is number', () => {
        expect(tryParseWidth(100)).toBe(100);
        expect(tryParseWidth(0)).toBe(0);
    });

    it('should return 0 for non-string and non-number inputs', () => {
        expect(tryParseWidth(undefined)).toBe(0);
        expect(tryParseWidth(null)).toBe(0);
        expect(tryParseWidth({})).toBe(0);
        expect(tryParseWidth([])).toBe(0);
        expect(tryParseWidth(true)).toBe(0);
    });
});