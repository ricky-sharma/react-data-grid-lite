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
        data.sort(dynamicSort('name'));
        expect(data.map(d => d.name)).toEqual(['apple', 'banana', 'cherry']);
    });

    it('sorts numbers numerically', () => {
        const data = [
            { age: 32 },
            { age: 25 },
            { age: 40 }
        ];
        data.sort(dynamicSort('age'));
        expect(data.map(d => d.age)).toEqual([25, 32, 40]);
    });

    it('sorts dates chronologically', () => {
        const data = [
            { date: '2023-12-01' },
            { date: '2021-01-15' },
            { date: '2022-06-20' }
        ];
        data.sort(dynamicSort('date'));
        expect(data.map(d => d.date)).toEqual(['2021-01-15', '2022-06-20', '2023-12-01']);
    });

    it('sorts in descending order using "-" prefix', () => {
        const data = [
            { score: 100 },
            { score: 50 },
            { score: 75 }
        ];
        data.sort(dynamicSort('-score'));
        expect(data.map(d => d.score)).toEqual([100, 75, 50]);
    });

    it('sorts by multiple fields', () => {
        const data = [
            { last: 'Smith', first: 'John' },
            { last: 'Doe', first: 'Alice' },
            { last: 'Smith', first: 'Adam' }
        ];
        data.sort(dynamicSort('last', 'first'));
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
        data.sort(dynamicSort('value'));
        expect(data.map(d => d.value)).toEqual([null, undefined, '', 'apple']);
    });

    it('sorts formatted currency strings numerically', () => {
        const data = [
            { price: '$100.00' },
            { price: '$20.00' },
            { price: '$300.50' }
        ];
        data.sort(dynamicSort('price'));
        expect(data.map(d => d.price)).toEqual(['$20.00', '$100.00', '$300.50']);
    });

    it('sorts UUID-style strings correctly', () => {
        const data = [
            { id: 'c1a1' },
            { id: 'a1c2' },
            { id: 'b1c3' }
        ];
        data.sort(dynamicSort('id'));
        expect(data.map(d => d.id)).toEqual(['a1c2', 'b1c3', 'c1a1']);
    });

    it('returns 0 for equal values', () => {
        const compare = dynamicSort('x');
        expect(compare({ x: 'test' }, { x: 'test' })).toBe(0);
    });
});
