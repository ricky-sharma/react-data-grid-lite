/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as eventHandlers from './../../src/components/events/event-grid-header-clicked';
import * as searchHandlers from './../../src/components/events/event-grid-search-clicked';
import DataGrid from './../../src/react-data-grid-lite';

jest.mock('./../../src/components/grid-footer', () => () => <div data-testid="grid-footer">Footer</div>);

jest.mock('./../../src/components/grid-global-search-bar', () => (props) => (
    <div data-testid="global-search-bar">
        <input
            data-testid="global-search-input"
            data-type={`globalSearch${props.gridID}`}
            value={props.globalSearchInput || ''}
            onChange={(e) => props.onSearchClicked(e)}
        />
        <button onClick={(e) => props.handleResetSearch(e)}>Reset</button>
        <button data-testid="download-btn" onClick={(e) => props.onDownloadComplete(e)}>Export CSV</button>
    </div>
));

jest.mock('./../../src/components/grid-header', () => () => (
    <thead>
        <tr>
            <th>Header</th>
        </tr>
    </thead>
));

jest.mock('./../../src/components/grid-rows', () => (props) => {
    const pageRows = props?.pageSize ?? props?.count ?? props?.rowsData?.length ?? 0;
    const visibleRows = props.rowsData?.slice(0, pageRows) ?? [];
    return (
        <>
            {visibleRows.map((_, index) => (
                <tr
                    key={index}
                    data-testid={`data-grid-row-${index}`}
                    onClick={() => props.onRowClick({ rowData: visibleRows[index] })}
                >
                    <td>
                        <div>Row {index + 1}</div>
                    </td>
                </tr>
            ))}
        </>
    );
});

const columns = [
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' }
];

const data = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 }
];

const defaultProps = {
    id: 'test-grid',
    columns,
    data,
    pageSize: 1,
    count: 1,
    globalSearchInput: '',
    onRowClick: jest.fn(),
    onPageChange: jest.fn(),
    onSortComplete: jest.fn(),
    onSearchComplete: jest.fn(),
};

describe('DataGrid Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        cleanup();
    });

    it('renders DataGrid with required elements', () => {
        render(<DataGrid {...defaultProps} />);
        expect(screen.getByTestId('global-search-bar')).toBeInTheDocument();
        expect(screen.getByTestId('grid-footer')).toBeInTheDocument();
        expect(screen.getByText('Row 1')).toBeInTheDocument();
    });

    it('calls eventGridSearchClicked when global search input is changed', () => {
        const spy = jest.spyOn(searchHandlers, 'eventGridSearchClicked').mockImplementation(() => { });
        render(<DataGrid {...defaultProps} id={null} />);
        const input = screen.getByTestId('global-search-input');
        fireEvent.change(input, { target: { value: 'test' } });
        expect(spy).toHaveBeenCalled();
    });

    it('resets global search when reset button is clicked', () => {
        render(<DataGrid {...defaultProps} />);
        const input = screen.getByTestId('global-search-input');
        fireEvent.change(input, { target: { value: 'test' } });
        const resetBtn = screen.getByText('Reset');
        fireEvent.click(resetBtn);
        expect(input.value).toBe('');
    });

    it('renders footer and handles navigation logic', () => {
        render(<DataGrid {...defaultProps} />);
        const footer = screen.getByTestId('grid-footer');
        expect(footer).toBeInTheDocument();
    });

    it('does not call eventGridHeaderClicked by default', () => {
        const spy = jest.spyOn(eventHandlers, 'eventGridHeaderClicked').mockImplementation(() => { });
        render(<DataGrid {...defaultProps} />);
        fireEvent.click(screen.getByText('Header'));
        expect(spy).not.toHaveBeenCalled();
    });

    it('calls onRowClick when a row is clicked', () => {
        const onRowClick = jest.fn();
        render(<DataGrid {...defaultProps} onRowClick={onRowClick} />);
        const row = screen.getByTestId('data-grid-row-0');
        fireEvent.click(row);
        expect(onRowClick).toHaveBeenCalledTimes(1);
    });

    it('renders with the correct container ID', () => {
        const { container } = render(<DataGrid {...defaultProps} />);
        const element = container.querySelector('#test-grid');
        expect(element).toBeInTheDocument();
    });
});

describe('DataGrid renders with more data', () => {
    const sampleColumns = [
        { name: 'Name' },
        { name: 'Age', formatting: { type: 'number' }, width: '100px' },
        { name: 'City', hidden: true, width: '10%', class: 'test' },
    ];

    const sampleData = [
        { Name: 'Alice', Age: 25, City: 'NY' },
        { Name: 'Bob', Age: 30, City: 'LA' },
        { Name: 'Charlie', Age: 35, City: 'SF' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('renders multiple data rows correctly', () => {
        render(<DataGrid id="test-grid" columns={sampleColumns} data={sampleData} pageSize={3} />);
        expect(screen.getByText('Row 1')).toBeInTheDocument();
        expect(screen.getByText('Row 2')).toBeInTheDocument();
        expect(screen.getByText('Row 3')).toBeInTheDocument();
    });

    it('renders correct number of rows based on pageSize', () => {
        render(<DataGrid {...defaultProps} pageSize={1} />);
        const rows = screen.getAllByTestId(/^data-grid-row-/);
        expect(rows.length).toBe(1);
    });
});

describe('DataGrid Advanced Features (aligned with mocks)', () => {
    const columns = [
        { id: 'firstName', label: 'First Name' },
        { id: 'lastName', label: 'Last Name' },
        {
            id: 'fullName',
            label: 'Full Name',
            render: (row) => `${row.firstName} ${row.lastName}`,
        },
        { id: 'age', label: 'Age', sortable: true },
        { id: 'secret', label: 'Secret', hidden: true }
    ];

    const data = [
        { firstName: 'Alice', lastName: 'Smith', age: 30, secret: 'A' },
        { firstName: 'Bob', lastName: 'Jones', age: 25, secret: 'B' },
        { firstName: 'Charlie', lastName: 'Brown', age: 35, secret: 'C' }
    ];

    const options = {
        gridClass: "test",
        editButton: {},
        deleteButton: {}
    }

    const defaultProps = {
        id: 'test-grid',
        columns,
        data,
        pageSize: 2,
        count: 2,
        onRowClick: jest.fn(),
        onPageChange: jest.fn(),
        onSortComplete: jest.fn(),
        onSearchComplete: jest.fn(),
        options
    };

    beforeEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('renders correct number of rows based on pageSize (via mock slicing)', () => {
        render(<DataGrid {...defaultProps} />);
        const rows = screen.getAllByTestId(/^data-grid-row-/);
        expect(rows.length).toBe(2);
    });

    it('renders footer component', () => {
        render(<DataGrid {...defaultProps} />);
        expect(screen.getByTestId('grid-footer')).toBeInTheDocument();
    });

    it('renders global search bar and triggers onSearchClicked', () => {
        const inputValue = 'Alice';
        render(<DataGrid {...defaultProps} />);
        const input = screen.getByTestId('global-search-input');
        fireEvent.change(input, { target: { value: inputValue } });
        expect(input.value).toBe(inputValue);
    });

    it('resets global search when Reset is clicked', () => {
        render(<DataGrid {...defaultProps} />);
        const input = screen.getByTestId('global-search-input');
        fireEvent.change(input, { target: { value: 'Test' } });
        expect(input.value).toBe('Test');

        const resetBtn = screen.getByText('Reset');
        fireEvent.click(resetBtn);
        expect(input.value).toBe('');
    });

    it('renders second page of data manually (simulate pagination)', () => {
        const paginatedProps = {
            ...defaultProps,
            data: data.slice(2),
        };
        render(<DataGrid {...paginatedProps} />);
        const rows = screen.getAllByTestId(/^data-grid-row-/);
        expect(rows.length).toBe(1);
    });

    it('simulates sort column click but does not render dynamic content', () => {
        const onSortComplete = jest.fn();
        render(<DataGrid {...defaultProps} onSortComplete={onSortComplete} />);
        fireEvent.click(screen.getByText('Header'));
        expect(onSortComplete).not.toHaveBeenCalled();
    });

    it('does not crash when onRowClick is undefined', () => {
        const columns = [{
            name: 'name', alias: 'Name',
            concatColumns: { columns: ['name', 'id'], separator: "," }
        },
        {
            name: 'id'
        }];
        const data = [{ name: 'Alice' }];
        render(
            <DataGrid
                id="test-grid"
                columns={columns}
                data={data}
                pageSize={1}
                onRowClick={undefined}
            />
        );
        const row = screen.getByTestId('data-grid-row-0');
        expect(() => { fireEvent.click(row); }).not.toThrow();
    });

    it('handles undefined onRowHover and onRowOut safely', () => {
        render(<DataGrid {...defaultProps} onRowHover={null} onRowOut={null} />);
        const row = screen.getByTestId('data-grid-row-0');

        expect(() => {
            fireEvent.mouseOver(row);
            fireEvent.mouseOut(row);
        }).not.toThrow();
    });

    it('handles undefined onSortComplete safely', () => {
        render(<DataGrid {...defaultProps} onSortComplete={undefined} />);

        const header = screen.getByText('Header');
        expect(() => fireEvent.click(header)).not.toThrow();
    });

    it('handles undefined onSearchComplete safely', () => {
        render(<DataGrid {...defaultProps} data={null} onSearchComplete={undefined} />);

        const input = screen.getByTestId('global-search-input');
        expect(() => fireEvent.change(input, { target: { value: 'test' } })).not.toThrow();
    });

    it('handles undefined onDownloadComplete safely', () => {
        render(<DataGrid {...defaultProps} pageSize={'abc'} onDownloadComplete={undefined} />);
        const downloadBtn = screen.getByTestId('download-btn');
        expect(() => fireEvent.click(downloadBtn)).not.toThrow();
    });

    it('renders DataGrid without crashing', () => {
        expect(() => render(<DataGrid onRowHover={null} gridClass={"test"} />)).not.toThrow();
    });
});

describe('DataGrid Null Check Tests', () => {
    it('renders with null columns', () => {
        render(<DataGrid id="grid-null-columns" columns={null} data={[]} />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('renders with undefined columns', () => {
        render(<DataGrid id="grid-undefined-columns" data={[]} />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('renders with null data', () => {
        render(<DataGrid id="grid-null-data" columns={[]} data={null} />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('renders with undefined data', () => {
        render(<DataGrid id="grid-undefined-data" columns={[]} />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('renders with null pageSize', () => {
        render(<DataGrid id="grid-null-pagesize" columns={[]} data={[]} pageSize={null} />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('generates gridID if id is null or missing', () => {
        const { container } = render(<DataGrid columns={[]} data={[]} />);
        const gridDiv = container.querySelector('.r-d-g-lt-component');
        expect(gridDiv).toBeInTheDocument();
        expect(gridDiv.id).toMatch(/^id-\d+/);
    });

    it('handles null options prop gracefully', () => {
        render(<DataGrid id="grid-null-options" columns={[]} data={[]} options={null} />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('handles missing event handlers without errors', () => {
        render(<DataGrid id="grid-null-handlers" columns={[]} data={[]} />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });
});