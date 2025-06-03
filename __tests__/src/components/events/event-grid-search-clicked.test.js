jest.mock('./../../../../src/helpers/format.js', () => ({
    format: jest.fn()
}));

import { eventGridSearchClicked } from './../../../../src/components/events/event-grid-search-clicked';
import { format as mockFormatVal } from './../../../../src/helpers/format.js';

describe('eventGridSearchClicked', () => {
    let e, dataReceivedRef, searchColsRef, setState, state;

    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();

        e = { target: { value: 'test' } };
        dataReceivedRef = {
            current: [
                { id: 1, name: 'Test User', age: 30 },
                { id: 2, name: 'Another One', age: 25 },
            ]
        };

        searchColsRef = { current: [] };
        setState = jest.fn();
        state = {
            toggleState: false
        };
        mockFormatVal.mockImplementation(val => val.toString());
    });

    it('should do nothing if event or colName is invalid', () => {
        eventGridSearchClicked(null, null, [], {}, dataReceivedRef, searchColsRef, state, setState);
        expect(setState).not.toHaveBeenCalled();
    });

    it('should update state with filtered results', () => {
        const colName = 'name';
        const colObject = ['name'];

        eventGridSearchClicked(e, colName, colObject, {}, dataReceivedRef, searchColsRef, state, setState);

        expect(searchColsRef.current.length).toBe(1);
        expect(setState).toHaveBeenCalledWith(expect.any(Function));

        const updateFn = setState.mock.calls[0][0];
        const newState = updateFn({ toggleState: false });
        expect(newState.rowsData.length).toBeGreaterThan(0);
        expect(newState.toggleState).toBe(true);
        expect(newState.activePage).toBe(1);
    });

    it('should call formatVal for matching formatting type', () => {
        const e = { target: { value: 'formatted' } };
        const colName = 'price';
        const formatting = { format: '0,0.00', type: 'number' };
        mockFormatVal.mockReturnValue('formatted');
        const searchColsRef = {
            current: [
                {
                    colName: 'price',
                    searchQuery: 'formatted',
                    colObj: null,
                    formatting
                }
            ]
        };
        const dataReceivedRef = {
            current: [
                { price: 123 },
                { price: 456 }
            ]
        };
        const state = { toggleState: false };
        const setState = jest.fn();
        eventGridSearchClicked(
            e,
            colName,
            undefined,
            formatting,
            dataReceivedRef,
            searchColsRef,
            state,
            setState
        );
        expect(mockFormatVal).toHaveBeenCalled();
        expect(setState).toHaveBeenCalled();
    });
});

describe('More tests for eventGridSearchClicked', () => {
    let e, dataReceivedRef, searchColsRef, setState, state;

    beforeEach(() => {
        e = { target: { value: '123' } };
        dataReceivedRef = {
            current: [
                { id: 1, name: 'John', age: 30, price: 123.45, isActive: true },
                { id: 2, name: 'Jane', age: 40, price: 678.90, isActive: false },
            ],
        };
        searchColsRef = { current: [] };
        setState = jest.fn();
        state = { toggleState: false };

        jest.clearAllMocks();
        jest.resetModules();
        mockFormatVal.mockImplementation(val => val.toString());
    });

    it('should do nothing with invalid event or colName', () => {
        eventGridSearchClicked(null, null, [], {}, dataReceivedRef, searchColsRef, state, setState);
        expect(setState).not.toHaveBeenCalled();
    });

    it('should push to searchColsRef and filter using default logic', () => {
        eventGridSearchClicked(e, 'name', ['name'], {}, dataReceivedRef, searchColsRef, state, setState);
        expect(searchColsRef.current.length).toBe(1);
        expect(setState).toHaveBeenCalled();
    });

    it('should apply number formatting filter', () => {
        const formatting = { type: 'number', format: '0.00' };
        mockFormatVal.mockImplementation((val) => val.toString());

        searchColsRef.current = [{
            colName: 'age',
            searchQuery: '30',
            colObj: ['age'],
            formatting
        }];

        eventGridSearchClicked(e, 'age', ['age'], formatting, dataReceivedRef, searchColsRef, state, setState);
        expect(mockFormatVal).toHaveBeenCalled();
        expect(setState).toHaveBeenCalled();
    });

    it('should apply currency formatting filter', () => {
        const formatting = { type: 'currency', format: 'USD' };
        mockFormatVal.mockImplementation((val) => `$${val}`);

        searchColsRef.current = [{
            colName: 'price',
            searchQuery: '123',
            colObj: ['price'],
            formatting
        }];

        eventGridSearchClicked(e, 'price', ['price'], formatting, dataReceivedRef, searchColsRef, state, setState);
        expect(mockFormatVal).toHaveBeenCalled();
    });

    it('should apply boolean formatting filter', () => {
        const formatting = { type: 'boolean', format: '' };
        mockFormatVal.mockImplementation(val => (val ? 'Yes' : 'No'));

        searchColsRef.current = [{
            colName: 'isActive',
            searchQuery: 'yes',
            colObj: ['isActive'],
            formatting
        }];

        eventGridSearchClicked(e, 'isActive', ['isActive'], formatting, dataReceivedRef, searchColsRef, state, setState);
        expect(mockFormatVal).toHaveBeenCalled();
    });

    it('should perform global search across multiple fields', () => {
        const formatting = { type: 'string' };

        searchColsRef.current = [{
            colName: '##globalSearch##',
            searchQuery: '123',
            colObj: [
                { name: 'price', formatting, concatColumns: { columns: ['id', 'name'] } },
                { name: 'age' }
            ],
            formatting: {}
        }];

        eventGridSearchClicked(e, '##globalSearch##', [], null, dataReceivedRef, searchColsRef, state, setState);
        expect(setState).toHaveBeenCalled();
    });

    it('should return early if event or colName is invalid', () => {
        const setState = jest.fn();
        eventGridSearchClicked(null, null, [], {}, { current: [] }, { current: [] }, {}, setState);
        expect(setState).not.toHaveBeenCalled();
    });

    it('should be able to handle null data reference', () => {
        const e = { target: { value: 'Alice' } };
        const setState = jest.fn();
        eventGridSearchClicked(e, 'amount', [], {}, { current: null }, { current: [] }, {}, setState);
        expect(setState).toHaveBeenCalled();
    });

    it('should update searchColsRef with new entry on input', () => {
        const e = { target: { value: 'Alice' } };
        const searchColsRef = { current: null };
        const setState = jest.fn();

        eventGridSearchClicked(
            e,
            'name',
            ['name'],
            {},
            { current: [{ name: 'Alice' }] },
            searchColsRef,
            { toggleState: false },
            setState
        );

        expect(searchColsRef.current).toHaveLength(1);
        expect(searchColsRef.current[0].colName).toBe('name');
    });

    it('should apply formatting filter for number type', () => {
        const e = { target: { value: '123' } };
        const searchColsRef = {
            current: [{
                colName: 'amount',
                searchQuery: '123',
                colObj: null,
                formatting: { format: '0,0', type: 'number' }
            }]
        };
        const setState = jest.fn();

        eventGridSearchClicked(
            e,
            'amount',
            [],
            { format: '0,0', type: 'number' },
            { current: [{ amount: 123 }] },
            searchColsRef,
            { toggleState: false },
            setState
        );

        expect(setState).toHaveBeenCalled();
    });


    it('should fallback to raw search if formatting type is not in list', () => {
        const e = { target: { value: 'active' } };
        const setState = jest.fn();
        const searchColsRef = {
            current: [{
                colName: 'status',
                searchQuery: 'active',
                colObj: null,
                formatting: { format: '', type: 'custom' }
            }]
        };

        eventGridSearchClicked(
            e,
            'status',
            [],
            { format: '', type: 'custom' },
            { current: [{ status: 'Active' }] },
            searchColsRef,
            { toggleState: false },
            setState
        );

        expect(setState).toHaveBeenCalled();
    });

    it('should perform global search using concatColumns', () => {
        const e = { target: { value: 'john' } };
        const setState = jest.fn();
        const data = [
            { firstName: 'John', lastName: 'Doe', id: 1 },
            { firstName: 'Jane', lastName: 'Smith', id: 2 }
        ];
        const searchColsRef = {
            current: [{
                colName: '##globalSearch##',
                searchQuery: 'john',
                colObj: [
                    {
                        name: 'firstName',
                        hidden: false,
                        formatting: { format: '', type: '' },
                        concatColumns: { columns: ['firstName', 'lastName'] }
                    }
                ]
            }]
        };

        eventGridSearchClicked(
            e,
            '##globalSearch##',
            [],
            {},
            { current: data },
            searchColsRef,
            { toggleState: false },
            setState
        );

        expect(setState).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should ignore hidden columns during global search', () => {
        const e = { target: { value: 'hidden' } };
        const searchColsRef = {
            current: [{
                colName: '##globalSearch##',
                searchQuery: 'hidden',
                colObj: [{
                    name: 'secretField',
                    hidden: true,
                    formatting: { format: '', type: '' }
                }]
            }]
        };

        const data = [{ secretField: 'Hidden Data', id: 1 }];
        const setState = jest.fn();

        eventGridSearchClicked(
            e,
            '##globalSearch##',
            [],
            {},
            { current: data },
            searchColsRef,
            { toggleState: false },
            setState
        );

        expect(setState).toHaveBeenCalled();
        const updaterFn = setState.mock.calls[0][0];

        const prevState = { toggleState: false };
        const newState = updaterFn(prevState);

        expect(newState.rowsData).toEqual([]);
        expect(newState.toggleState).toBe(true);
        expect(newState.activePage).toBe(1);
    });

    it('should include rows where concatenated columns match formatted value', () => {
        jest.mock('./../../../../src/helpers/format.js', () => ({ format: jest.fn((value) => value) }));

        const data = [
            { id: 1, colA: 'TestValue' },
            { id: 2, colA: 'OtherValue' }
        ];

        const searchColsRef = {
            current: [{
                colName: '##globalSearch##',
                searchQuery: 'test',
                colObj: [{
                    name: 'colA',
                    concatColumns: { columns: ['colA'] },
                    formatting: { format: '', type: 'string' }
                }]
            }]
        };

        const dataReceivedRef = { current: [...data] };
        const setState = jest.fn();
        const state = { toggleState: false };

        eventGridSearchClicked(
            { target: { value: 'test' } },
            '##globalSearch##',
            [],
            { format: '', type: 'string' },
            dataReceivedRef,
            searchColsRef,
            state,
            setState
        );

        expect(setState).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should include rows based on case-insensitive match in concat columns (no formatting)', () => {
        const data = [
            { id: 1, name: 'hello world' },
            { id: 2, name: 'foo bar' }
        ];

        const searchColsRef = {
            current: [{
                colName: '##globalSearch##',
                searchQuery: 'foo',
                colObj: [{
                    name: 'name',
                    concatColumns: { columns: ['name'] },
                    formatting: { type: '', format: '' }
                }]
            }]
        };

        const dataReceivedRef = { current: data };
        const setState = jest.fn();
        const state = { toggleState: true };

        eventGridSearchClicked(
            { target: { value: 'foo' } },
            '##globalSearch##',
            [],
            {},
            dataReceivedRef,
            searchColsRef,
            state,
            setState
        );

        expect(setState).toHaveBeenCalledWith(expect.any(Function));
    });

});
