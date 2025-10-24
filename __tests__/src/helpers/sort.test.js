/* eslint-disable no-undef */
import { dynamicSort } from './../../../src/helpers/sort';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('dynamicSort', () => {
    it('sorts strings alphabetically', () => {
        const data = [
            { name: 'banana' },
            { name: 'apple' },
            { name: 'cherry' }
        ];
        data.sort(dynamicSort({ name: 'string' }, 'name'));
        expect(data.map(d => d.name)).toEqual(['apple', 'banana', 'cherry']);
    });

    it('sorts numbers numerically', () => {
        const data = [
            { age: 32 },
            { age: 25 },
            { age: 40 }
        ];
        data.sort(dynamicSort({ age: 'number' }, 'age'));
        expect(data.map(d => d.age)).toEqual([25, 32, 40]);
    });

    it('sorts dates chronologically', () => {
        const data = [
            { date: '2023-12-01' },
            { date: '2021-01-15' },
            { date: '2022-06-20' }
        ];
        data.sort(dynamicSort({ date: 'date' }, 'date'));
        expect(data.map(d => d.date)).toEqual(['2021-01-15', '2022-06-20', '2023-12-01']);
    });

    it('sorts in descending order using "-" prefix', () => {
        const data = [
            { score: 100 },
            { score: 50 },
            { score: 75 }
        ];
        data.sort(dynamicSort({ score: 'number' }, '-score'));
        expect(data.map(d => d.score)).toEqual([100, 75, 50]);
    });

    it('sorts by multiple fields', () => {
        const data = [
            { last: 'Smith', first: 'John' },
            { last: 'Doe', first: 'Alice' },
            { last: 'Smith', first: 'Adam' }
        ];
        data.sort(dynamicSort({ first: 'string', last: 'string' }, 'last', 'first'));
        expect(data.map(d => `${d.last} ${d.first}`)).toEqual([
            'Doe Alice',
            'Smith Adam',
            'Smith John'
        ]);
    });

    it('handles null, undefined and empty strings gracefully', () => {
        const data = [
            { value: null },
            { value: undefined },
            { value: '' },
            { value: 'apple' }
        ];
        data.sort(dynamicSort({ value: 'string' }, 'value'));
        expect(data.map(d => d.value)).toEqual([null, undefined, '', 'apple']);
    });

    it('sorts formatted currency strings numerically', () => {
        const data = [
            { price: '$100.00' },
            { price: '$20.00' },
            { price: '$300.50' }
        ];
        data.sort(dynamicSort({ price: 'currency' }, 'price'));
        expect(data.map(d => d.price)).toEqual(['$20.00', '$100.00', '$300.50']);
    });

    it('sorts UUID-style strings correctly', () => {
        const data = [
            { id: 'c1a1' },
            { id: 'a1c2' },
            { id: 'b1c3' }
        ];
        data.sort(dynamicSort({ id: 'string' }, 'id'));
        expect(data.map(d => d.id)).toEqual(['a1c2', 'b1c3', 'c1a1']);
    });

    it('returns 0 for equal values', () => {
        const compare = dynamicSort({ x: 'string' }, 'x');
        expect(compare({ x: 'test' }, { x: 'test' })).toBe(0);
    });
});


describe('More dynamicSort tests', () => {
    const data = [
        { name: 'Alice', age: 30, salary: '$3,000', date: '2021-01-01', uuid: 'b123' },
        { name: 'bob', age: 25, salary: '$2,500', date: '2020-01-01', uuid: 'a123' },
        { name: 'Charlie', age: 35, salary: '$4,000', date: '2022-01-01', uuid: 'c123' },
        { name: 'david', age: null, salary: null, date: null, uuid: null },
    ];

    it('sorts by string field (case-insensitive)', () => {
        const sorted = [...data].sort(dynamicSort({ name: 'string' }, 'name'));
        expect(sorted.map(d => d.name)).toEqual(['Alice', 'bob', 'Charlie', 'david']);
    });

    it('sorts by string field descending', () => {
        const sorted = [...data].sort(dynamicSort({ name: 'string' }, '-name'));
        expect(sorted.map(d => d.name)).toEqual(['david', 'Charlie', 'bob', 'Alice']);
    });

    it('sorts by number field', () => {
        const sorted = [...data].sort(dynamicSort({ age: 'number' }, 'age'));
        expect(sorted.map(d => d.age)).toEqual([null, 25, 30, 35]);
    });

    it('sorts by number field descending', () => {
        const sorted = [...data].sort(dynamicSort({ age: 'number' }, '-age'));
        expect(sorted.map(d => d.age)).toEqual([35, 30, 25, null]);
    });

    it('sorts by currency field', () => {
        const sorted = [...data].sort(dynamicSort({ salary: 'string' }, 'salary'));
        expect(sorted.map(d => d.salary)).toEqual([null, '$2,500', '$3,000', '$4,000']);
    });

    it('sorts by date string field', () => {
        const sorted = [...data].sort(dynamicSort({ date: 'date' }, 'date'));
        expect(sorted.map(d => d.date)).toEqual([null, '2020-01-01', '2021-01-01', '2022-01-01']);
    });

    it('sorts by UUID (fallback to lowercase string)', () => {
        const sorted = [...data].sort(dynamicSort({ uuid: 'string' }, 'uuid'));
        expect(sorted.map(d => d.uuid)).toEqual([null, 'a123', 'b123', 'c123']);
    });

    it('sorts by multiple fields', () => {
        const multi = [
            { name: 'John', age: 30 },
            { name: 'John', age: 25 },
            { name: 'Alice', age: 40 },
        ];
        const sorted = [...multi].sort(dynamicSort({ name: 'string', age: 'number' }, 'name', 'age'));
        expect(sorted).toEqual([
            { name: 'Alice', age: 40 },
            { name: 'John', age: 25 },
            { name: 'John', age: 30 },
        ]);
    });

    it('handles null and undefined values gracefully', () => {
        const mixed = [
            { val: null },
            { val: undefined },
            { val: 'B' },
            { val: 'a' },
        ];
        const sorted = [...mixed].sort(dynamicSort({ val: 'string' }, 'val'));
        expect(sorted.map(i => i.val)).toEqual([null, undefined, 'a', 'B']);
    });

    it('sorts by Date object field', () => {
        const date1 = new Date('2020-01-01');
        const date2 = new Date('2021-01-01');
        const date3 = new Date('2022-01-01');

        const items = [
            { createdAt: date2 },
            { createdAt: date1 },
            { createdAt: date3 },
        ];

        const sorted = [...items].sort(dynamicSort({ createdAt: 'date' }, 'createdAt'));
        expect(sorted.map(i => i.createdAt)).toEqual([date1, date2, date3]);
    });

    it('sorts by Date object field descending', () => {
        const date1 = new Date('2020-01-01');
        const date2 = new Date('2021-01-01');
        const date3 = new Date('2022-01-01');

        const items = [
            { createdAt: date2 },
            { createdAt: date1 },
            { createdAt: date3 },
        ];

        const sorted = [...items].sort(dynamicSort({ createdAt: 'date' }, '-createdAt'));
        expect(sorted.map(i => i.createdAt)).toEqual([date3, date2, date1]);
    });

    it('forces fallback string normalization (not date, not numeric, not currency)', () => {
        const items = [
            { key: '  Zebra!@#  ' },
            { key: ['alpha'] },
            { key: 'MIDDLE' },
        ];

        const sorted = [...items].sort(dynamicSort({ key: 'string' }, 'key'));

        expect(sorted.map(i => i.key)).toEqual([['alpha'], 'MIDDLE', '  Zebra!@#  ']);
    });

    it('sorts mixed types (number, string, null) with type "number"', () => {
        const data = [
            { value: 100 },
            { value: '50' },
            { value: null },
            { value: 'banana' }
        ];
        const sorted = [...data].sort(dynamicSort({ value: 'number' }, 'value'));
        expect(sorted.map(d => d.value)).toEqual([null, '50', 100, 'banana']);
    });

    it('sorts using fallback normalization when columnTypes is missing field', () => {
        const data = [
            { mystery: 'B' },
            { mystery: 'a' },
            { mystery: null }
        ];
        const sorted = [...data].sort(dynamicSort({}, 'mystery'));
        expect(sorted.map(d => d.mystery)).toEqual([null, 'a', 'B']);
    });

    it('handles missing fields in some objects', () => {
        const data = [
            { name: 'Alice' },
            { name: 'Bob', age: 30 },
            { age: 25 }
        ];
        const sorted = [...data].sort(dynamicSort({ age: 'number' }, 'age'));
        expect(sorted.map(d => d.age)).toEqual([undefined, 25, 30]);
    });

    it('sorts strings with accents correctly', () => {
        const data = [
            { name: 'Émile' },
            { name: 'André' },
            { name: 'Zoë' },
        ];
        const sorted = [...data].sort(dynamicSort({ name: 'string' }, 'name'));
        expect(sorted.map(d => d.name)).toEqual(['André', 'Émile', 'Zoë']);
    });

    it('sorts mixed-format currency strings correctly', () => {
        const data = [
            { price: '€2.000,50' },
            { price: '$1,000.75' },
            { price: '£1.000,25' },
            { price: '₹3000.00' }
        ];
        const sorted = [...data].sort(dynamicSort({ price: 'currency' }, 'price'));
        expect(sorted.map(d => d.price)).toContain('₹3000.00');
    });

    it('sorts large datasets quickly', () => {
        const largeArray = Array.from({ length: 10000 }, (_, i) => ({
            value: Math.floor(Math.random() * 10000).toString()
        }));
        const start = Date.now();
        largeArray.sort(dynamicSort({ value: 'number' }, 'value'));
        const duration = Date.now() - start;
        expect(duration).toBeLessThan(1500);
    });

    it('returns number directly when type is "number" and value is a number', () => {
        const data = [
            { value: 42 },
            { value: 7 },
            { value: 100 }
        ];
        const sorter = dynamicSort({ value: 'number1' }, 'value');
        const result = [...data].sort(sorter);

        expect(result.map(d => d.value)).toEqual([7, 42, 100]);
    });

    it('returns timestamp directly when type is "date" and value is a Date object', () => {
        const date1 = new Date('2020-01-01');
        const date2 = new Date('2021-01-01');
        const date3 = new Date('2022-01-01');

        const data = [
            { createdAt: date2 },
            { createdAt: date1 },
            { createdAt: date3 },
        ];

        const sorted = [...data].sort(dynamicSort({ createdAt: 'date1' }, 'createdAt'));

        expect(sorted.map(d => d.createdAt)).toEqual([date1, date2, date3]);
    });

    it('falls back to localeCompare when Intl.Collator is not available', () => {
        const originalCollator = Intl.Collator;
        Intl.Collator = undefined;

        const data = [
            { name: 'zebra' },
            { name: 'apple' },
        ];

        const sorted = [...data].sort(dynamicSort({ name: 'string' }, 'name'));

        expect(sorted.map(d => d.name)).toEqual(['apple', 'zebra']);

        Intl.Collator = originalCollator;
    });

    it('returns original value for invalid date strings', () => {
        const data = [
            { date: 'not-a-date' },
            { date: 'also invalid' },
            { date: '2021-13-01' }, // Invalid month
        ];

        const sorted = [...data].sort(dynamicSort({ date: 'date' }, 'date'));

        expect(sorted.map(d => d.date)).toEqual([
            '2021-13-01',
            'also invalid',
            'not-a-date',
        ]);
    });

    it('returns original string for unparseable date', () => {
        const columnTypes = { val: 'date' };
        const sortFn = dynamicSort(columnTypes, 'val');

        const a = { val: 'not-a-date' };
        const b = { val: '2020-01-01' };

        expect(sortFn(a, b)).toBeGreaterThan(0);
    });

    it('uses default columnTypes when not provided', () => {
        const data = [
            { name: 'Banana' },
            { name: 'apple' },
            { name: 'cherry' },
        ];

        const sorted = [...data].sort(dynamicSort(undefined, 'name'));
        expect(sorted.map(d => d.name)).toEqual(['apple', 'Banana', 'cherry']);
    });

    it('defaults to empty columnTypes when omitted', () => {
        const data = [
            { value: 'B' },
            { value: 'a' },
        ];
        const sorted = [...data].sort(dynamicSort(undefined, 'value'));
        expect(sorted.map(d => d.value)).toEqual(['a', 'B']);
    });
});