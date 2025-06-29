jest.mock('./../../../src/constants', () => ({
    Button_Column_Key: 'button',
    Button_Column_Width: '60px',
    Default_Grid_Width_VW: '80vw',
    Mobile_Column_Width: '100px',
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
    ...jest.requireActual('../../../src/helpers/format'),
    format: jest.fn(),
}));

import * as helpers from '../../../src/helpers/format';
import * as common from './../../../src/helpers/common';
import { calculateColumnWidth, formatRowData } from './../../../src/utils/component-utils';

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

    it('returns Button_Column_Width if currentColKey is button column', () => {
        expect(calculateColumnWidth(['100px', '50px'], [], 'button')).toBe('60px');
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
        const result = calculateColumnWidth(colWidths, [], 1, false, true);
        expect(result).toBe('200px');
    });

    it('returns Mobile_Column_Width if total mobile width exceeds container', () => {
        common.getContainerWidthInPixels.mockReturnValue(300);
        const colWidths = [null, null, null];
        const result = calculateColumnWidth(colWidths, [], 1, false, true);
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
            { name: 'fullName', concatColumns: { columns: ['first', 'last'], separator: '-' } },
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

