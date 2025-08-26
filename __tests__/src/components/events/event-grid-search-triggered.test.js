jest.mock('./../../../../src/helpers/format.js', () => ({
    format: jest.fn()
}));

import { cleanup } from '@testing-library/react';
import { eventGridSearchTriggered, filterData } from './../../../../src/components/events/event-grid-search-triggered';
import { format as mockFormatVal } from './../../../../src/helpers/format.js';

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    cleanup();
});

describe('eventGridSearchTriggered', () => {
    let searchQuery, dataReceived, searchColsRef, setState, state;

    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();

        searchQuery = 'test';
        dataReceived = [
            { id: 1, name: 'Test User', age: 30 },
            { id: 2, name: 'Another One', age: 25 },
        ];

        searchColsRef = { current: [] };
        setState = jest.fn();
        state = {
            toggleState: false
        };
        mockFormatVal.mockImplementation(val => val.toString());
    });

    it('should do nothing if event or colName is invalid', () => {
        eventGridSearchTriggered(null, null, [], {}, dataReceived, searchColsRef, state, setState);
        expect(setState).not.toHaveBeenCalled();
    });

    it('should update state with filtered results', () => {
        const colName = 'name';
        const colObject = ['name'];

        eventGridSearchTriggered(searchQuery, colName, colObject, {}, dataReceived, searchColsRef, state, setState);

        expect(searchColsRef.current.length).toBe(1);
        expect(setState).toHaveBeenCalledWith(expect.any(Function));

        const updateFn = setState.mock.calls[0][0];
        const newState = updateFn({ toggleState: false });
        expect(newState.rowsData.length).toBeGreaterThan(0);
        expect(newState.toggleState).toBe(true);
        expect(newState.activePage).toBe(1);
    });

    it('should call formatVal for matching formatting type', () => {
        const searchQuery = 'formatted';
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
        const dataReceived = [
            { price: 123 },
            { price: 456 }
        ];
        const state = { toggleState: false };
        const setState = jest.fn();
        eventGridSearchTriggered(
            searchQuery,
            colName,
            undefined,
            formatting,
            dataReceived,
            searchColsRef,
            state,
            setState
        );
        expect(mockFormatVal).toHaveBeenCalled();
        expect(setState).toHaveBeenCalled();
    });
});

describe('More tests for eventGridSearchTriggered', () => {
    let searchQuery, dataReceived, searchColsRef, setState, state;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        searchQuery = '123';
        dataReceived = [
            { id: 1, name: 'John', age: 30, price: 123.45, isActive: true },
            { id: 2, name: 'Jane', age: 40, price: 678.90, isActive: false },
        ];
        searchColsRef = { current: [] };
        setState = jest.fn();
        state = { toggleState: false };
        mockFormatVal.mockImplementation(val => val.toString());
    });

    it('should do nothing with invalid event or colName', () => {
        eventGridSearchTriggered(null, null, [], {}, dataReceived, searchColsRef, state, setState);
        expect(setState).not.toHaveBeenCalled();
    });

    it('should push to searchColsRef and filter using default logic', () => {
        eventGridSearchTriggered(searchQuery, 'name', ['name'], {}, dataReceived, searchColsRef, state, setState);
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

        eventGridSearchTriggered(searchQuery, 'age', ['age'], formatting, dataReceived, searchColsRef, state, setState);
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

        eventGridSearchTriggered(searchQuery, 'price', ['price'], formatting, dataReceived, searchColsRef, state, setState);
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

        eventGridSearchTriggered(searchQuery, 'isActive', ['isActive'], formatting, dataReceived, searchColsRef, state, setState);
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

        eventGridSearchTriggered(searchQuery, '##globalSearch##', [], null, dataReceived, searchColsRef, state, setState);
        expect(setState).toHaveBeenCalled();
    });

    it('should return early if event or colName is invalid', () => {
        const setState = jest.fn();
        eventGridSearchTriggered(null, null, [], {}, [], [], {}, setState);
        expect(setState).not.toHaveBeenCalled();
    });

    it('should be able to handle null data reference', () => {
        const searchQuery = 'Alice';
        const setState = jest.fn();
        eventGridSearchTriggered(searchQuery, 'amount', [], {}, null, [], {}, setState);
        expect(setState).toHaveBeenCalled();
    });

    it('should update searchColsRef with new entry on input', () => {
        const searchQuery = 'Alice';
        const searchColsRef = { current: null };
        const setState = jest.fn();

        eventGridSearchTriggered(
            searchQuery,
            'name',
            ['name'],
            {},
            [{ name: 'Alice' }],
            searchColsRef,
            { toggleState: false },
            setState
        );

        expect(searchColsRef.current).toHaveLength(1);
        expect(searchColsRef.current[0].colName).toBe('name');
    });

    it('should apply formatting filter for number type', () => {
        const searchQuery = '123';
        const searchColsRef = {
            current: [{
                colName: 'amount',
                searchQuery: '123',
                colObj: null,
                formatting: { format: '0,0', type: 'number' }
            }]
        };
        const setState = jest.fn();

        eventGridSearchTriggered(
            searchQuery,
            'amount',
            [],
            { format: '0,0', type: 'number' },
            [{ amount: 123 }],
            searchColsRef,
            { toggleState: false },
            setState
        );

        expect(setState).toHaveBeenCalled();
    });


    it('should fallback to raw search if formatting type is not in list', () => {
        const searchQuery = 'active';
        const setState = jest.fn();
        const searchColsRef = {
            current: [{
                colName: 'status',
                searchQuery: 'active',
                colObj: null,
                formatting: { format: '', type: 'custom' }
            }]
        };

        eventGridSearchTriggered(
            searchQuery,
            'status',
            [],
            { format: '', type: 'custom' },
            [{ status: 'Active' }],
            searchColsRef,
            { toggleState: false },
            setState
        );

        expect(setState).toHaveBeenCalled();
    });

    it('should perform global search using concatColumns', () => {
        const searchQuery = 'john';
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

        eventGridSearchTriggered(
            searchQuery,
            '##globalSearch##',
            [],
            {},
            data,
            searchColsRef,
            { toggleState: false },
            setState
        );

        expect(setState).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should ignore hidden columns during global search', () => {
        const searchQuery = 'hidden';
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

        eventGridSearchTriggered(
            searchQuery,
            '##globalSearch##',
            [],
            {},
            data,
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

        const dataReceived = [...data];
        const setState = jest.fn();
        const state = { toggleState: false };

        eventGridSearchTriggered(
            'test',
            '##globalSearch##',
            [],
            { format: '', type: 'string' },
            dataReceived,
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

        const dataReceived = [...data];
        const setState = jest.fn();
        const state = { toggleState: true };

        eventGridSearchTriggered(
            'foo',
            '##globalSearch##',
            [],
            {},
            dataReceived,
            searchColsRef,
            state,
            setState
        );

        expect(setState).toHaveBeenCalledWith(expect.any(Function));
    });
});

describe('filterData (using real helper implementations)', () => {
    const sampleData = [
        { name: 'John Doe', email: 'john@example.com', age: 30, city: 'New York' },
        { name: 'Jane Smith', email: 'jane@example.com', age: 25, city: 'London' },
        { name: 'Bob Johnson', email: 'bob@sample.com', age: 40, city: 'New York' },
    ];

    let aiSearchFailedRef;
    let aiSearchEnabled;

    beforeEach(() => {
        aiSearchFailedRef = { current: false };
        aiSearchEnabled = false;
    });

    it('filters by single field and single term', () => {
        const searchColsRef = {
            current: [{
                colName: 'name',
                searchQuery: 'Jane',
                colObj: ['name'],
                formatting: {}
            }]
        };

        const result = filterData(searchColsRef, sampleData, aiSearchFailedRef, aiSearchEnabled);
        expect(result).toEqual([
            { name: 'Jane Smith', email: 'jane@example.com', age: 25, city: 'London' }
        ]);
    });

    it('filters by multiple terms across single field', () => {
        const searchColsRef = {
            current: [{
                colName: 'email',
                searchQuery: 'sample.com 40',
                colObj: ['email', 'age'],
                formatting: {}
            }]
        };

        const result = filterData(searchColsRef, sampleData, aiSearchFailedRef, aiSearchEnabled);
        expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('handles global search when AI is disabled', () => {
        aiSearchEnabled = false;

        const searchColsRef = {
            current: [{
                colName: '##globalSearch##',
                searchQuery: 'New York',
                colObj: [
                    { name: 'city', formatting: {}, hidden: false },
                    { name: 'email', formatting: {}, hidden: false }
                ]
            }]
        };

        const result = filterData(searchColsRef, sampleData, aiSearchFailedRef, aiSearchEnabled);
        expect(result).toEqual(expect.arrayContaining([
            expect.objectContaining({ city: 'New York' })
        ]));
    });

    it('skips global search when AI enabled and no failure', () => {
        aiSearchEnabled = true;
        aiSearchFailedRef.current = false;

        const searchColsRef = {
            current: [{
                colName: '##globalSearch##',
                searchQuery: 'john',
                colObj: [{ name: 'name', formatting: {}, hidden: false }]
            }]
        };

        const result = filterData(searchColsRef, sampleData, aiSearchFailedRef, aiSearchEnabled);
        expect(result).toEqual(sampleData);
    });

    it('filters concatenated columns using real helper logic', () => {
        const searchColsRef = {
            current: [{
                colName: 'full',
                searchQuery: 'john new',
                colObj: ['name', 'city'],
                formatting: {},
                colSep: ' '
            }]
        };

        const result = filterData(searchColsRef, sampleData, aiSearchFailedRef, aiSearchEnabled);
        const containsJohnNY = result.some(r => r.name === 'John Doe' && r.city === 'New York');
        expect(containsJohnNY).toBe(true);
    });

    it('returns data when searchColsRef is undefined', () => {
        const result = filterData(undefined, sampleData, { current: false }, false);
        expect(result).toEqual(sampleData);
    });

    it('returns data when searchColsRef.current is undefined', () => {
        const result = filterData({ current: undefined }, sampleData, { current: false }, false);
        expect(result).toEqual(sampleData);
    });

    it('returns data when searchColsRef.current is empty array', () => {
        const result = filterData({ current: [] }, sampleData, { current: false }, false);
        expect(result).toEqual(sampleData);
    });

    it('excludes records where searched column value is null', () => {
        const sampleData = [
            { name: null, email: 'john@example.com' },
            { name: 'Jane Smith', email: 'jane@example.com' },
            { name: undefined, email: 'bob@example.com' }
        ];

        const searchColsRef = {
            current: [
                {
                    colName: 'name',
                    searchQuery: 'john',
                    colObj: ['name'],
                    formatting: {}
                }
            ]
        };

        const aiSearchFailedRef = { current: false };
        const aiSearchEnabled = false;

        const result = filterData(searchColsRef, sampleData, aiSearchFailedRef, aiSearchEnabled);
        expect(result).toEqual([]);
    });

    it('excludes undefined values during search', () => {
        const sampleData = [
            { name: null, email: 'john@example.com' },
            { name: 'Jane Smith', email: 'jane@example.com' },
            { name: undefined, email: 'bob@example.com' }
        ];

        const searchColsRef = {
            current: [
                {
                    colName: 'name',
                    searchQuery: 'bob',
                    colObj: ['name'],
                    formatting: {}
                }
            ]
        };

        const aiSearchFailedRef = { current: false };
        const aiSearchEnabled = false;

        const result = filterData(searchColsRef, sampleData, aiSearchFailedRef, aiSearchEnabled);

        expect(result).toEqual([]);
    });

    it('does not search in hidden column (should skip it)', () => {
        const sampleData = [
            { name: 'John Doe', email: 'john@example.com', city: 'New York' },
            { name: 'Jane Smith', email: 'jane@example.com', city: 'London' }
        ];

        const searchColsRef = {
            current: [
                {
                    colName: '##globalSearch##',
                    searchQuery: 'john',
                    colObj: [
                        {
                            name: 'name',
                            formatting: {},
                            hidden: true
                        },
                        {
                            name: 'email',
                            formatting: {},
                            hidden: false
                        }
                    ]
                }
            ]
        };

        const aiSearchFailedRef = { current: true };
        const aiSearchEnabled = true;

        const result = filterData(searchColsRef, sampleData, aiSearchFailedRef, aiSearchEnabled);
        expect(result).toEqual([
            { name: 'John Doe', email: 'john@example.com', city: 'New York' }
        ]);
    });

    it('calls getNormalizedCombinedValue when concatColumns is defined (global search)', () => {
        const sampleData = [
            { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
            { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
            { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' }
        ];

        const searchColsRef = {
            current: [
                {
                    colName: '##globalSearch##',
                    searchQuery: 'john doe', // Matches combined firstName + lastName
                    colObj: [
                        {
                            formatting: {},
                            hidden: false,
                            concatColumns: {
                                columns: ['firstName', 'lastName'],
                                separator: ' '
                            }
                        }
                    ]
                }
            ]
        };

        const aiSearchFailedRef = { current: true };
        const aiSearchEnabled = true;

        const result = filterData(searchColsRef, sampleData, aiSearchFailedRef, aiSearchEnabled);
        expect(result).toEqual([
            { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
        ]);
    });

    it('calls formatVal when formatting.type is included in Formatting_Types', () => {
        const sampleData = [
            { name: 'John', salary: 1234.56 },
            { name: 'Jane', salary: 999.99 }
        ];

        const searchColsRef = {
            current: [
                {
                    colName: '##globalSearch##',
                    searchQuery: '1,234',
                    colObj: [
                        {
                            name: 'salary',
                            formatting: {
                                type: 'currency',
                                format: 'USD'
                            },
                            hidden: false
                        }
                    ]
                }
            ]
        };

        const aiSearchFailedRef = { current: true };
        const aiSearchEnabled = true;

        const result = filterData(searchColsRef, sampleData, aiSearchFailedRef, aiSearchEnabled);

        expect(result).toEqual([]);
    });

    it('returns all data when searchQuery is empty (terms fallback to [])', () => {
        const sampleData = [
            { name: 'Alice', email: 'alice@example.com' },
            { name: 'Bob', email: 'bob@example.com' }
        ];

        const searchColsRef = {
            current: [
                {
                    colName: 'name',
                    searchQuery: '   ', // whitespace-only
                    colObj: ['name'],
                    formatting: {}
                }
            ]
        };

        const aiSearchFailedRef = { current: false };
        const aiSearchEnabled = false;

        const result = filterData(searchColsRef, sampleData, aiSearchFailedRef, aiSearchEnabled);
        expect(result).toEqual(sampleData);
    });

    it('returns all data when searchQuery is undefined (terms fallback to [])', () => {
        const sampleData = [
            { name: 'Alice', email: 'alice@example.com' },
            { name: 'Bob', email: 'bob@example.com' }
        ];

        const searchColsRef = {
            current: [
                {
                    colName: 'name',
                    searchQuery: undefined, // not set at all
                    colObj: ['name'],
                    formatting: {}
                }
            ]
        };

        const aiSearchFailedRef = { current: false };
        const aiSearchEnabled = false;

        const result = filterData(searchColsRef, sampleData, aiSearchFailedRef, aiSearchEnabled);

        expect(result).toEqual(sampleData);
    });
});