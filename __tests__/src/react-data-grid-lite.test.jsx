/* eslint-disable no-undef */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import * as eventHandlers from './../../src/components/events/event-grid-header-clicked';
import * as searchHandlers from './../../src/components/events/event-grid-search-clicked';
import DataGrid from './../../src/react-data-grid-lite';

const flushPromises = () => act(() => new Promise(resolve => setTimeout(resolve, 0)));

const waitForReactUpdate = async () => {
    await flushPromises();
    await waitFor(() => { });
};

jest.mock('./../../src/components/grid-global-search-bar', () => {
    const React = require('react');
    const { useState } = React;

    return function MockedGridGlobalSearchBar(props) {
        const [value, setValue] = useState(props?.globalSearchInput || '');

        return (
            <div data-testid="global-search-bar">
                <input
                    data-testid="global-search-input"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        props?.onSearchClicked(e);
                    }}
                />
                <button onClick={() => {
                    setValue('');
                    props?.handleResetGrid();
                }}>Reset</button>
                <button
                    data-testid="download-btn"
                    onClick={() => jest.fn()}
                >Export CSV</button>
            </div>
        );
    };
});

jest.mock('./../../src/components/grid-rows', () => (props) => {
    const pageRows = props?.state?.pageSize ??
        props?.state?.currentPageRows ?? props?.state?.rowsData?.length ?? 0;
    const visibleRows = props?.state?.rowsData?.slice(0, pageRows) ?? [];
    return (
        <>
            {visibleRows.map((_, index) => (
                <tr
                    key={index}
                    data-testid={`data-grid-row-${index}`}
                    onClick={() => props?.state?.onRowClick({ rowData: visibleRows?.[index] })}
                    onMouseOver={() => props?.state?.onRowHover({ rowData: visibleRows?.[index] })}
                    onMouseOut={() => props?.state?.onRowOut({ rowData: visibleRows?.[index] })}
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
    { name: 'name', alias: 'Name' },
    { name: 'age', alias: 'Age' }
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

    it('renders DataGrid with required elements', async () => {
        let container;
        await act(async () => {
            const renderResult = render(<DataGrid {...defaultProps} />);
            container = renderResult.container;
        });
        await waitForReactUpdate();
        await waitFor(() => {
            expect(screen.getByTestId('global-search-bar')).toBeInTheDocument();
            expect(container.querySelector('.grid-footer')).toBeInTheDocument();
            expect(screen.getByText('Row 1')).toBeInTheDocument();
        });
    });


    it('calls eventGridSearchClicked when global search input is changed', async () => {
        await act(() => { render(<DataGrid {...defaultProps} id={null} onSearchComplete={null} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            const spy = jest.spyOn(searchHandlers, 'eventGridSearchClicked').mockImplementation(() => { });
            const input = screen.getByTestId('global-search-input');
            fireEvent.change(input, { target: { value: 'test' } });
            expect(spy).toHaveBeenCalled();
        });
    });

    it('resets global search when reset button is clicked', async () => {
        await act(() => { render(<DataGrid {...defaultProps} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            const input = screen.getByTestId('global-search-input');
            fireEvent.change(input, { target: { value: 'test' } });
            const resetBtn = screen.getByText('Reset');
            fireEvent.click(resetBtn);
            expect(input.value).toBe('');
        });
    });

    it('renders footer and handles navigation logic', async () => {
        let container;
        await act(async () => {
            const renderResult = render(<DataGrid {...defaultProps} />);
            container = renderResult.container;
        });
        await waitForReactUpdate();
        await waitFor(() => {
            const footer = container.querySelector('.grid-footer');
            expect(footer).toBeInTheDocument();
        });
    });

    it('Call eventGridHeaderClicked by default', async () => {

        await act(() => { render(<DataGrid {...defaultProps} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            const spy = jest.spyOn(eventHandlers, 'eventGridHeaderClicked').mockImplementation(() => { });
            fireEvent.click(screen.getByLabelText('Name'));
            expect(spy).toHaveBeenCalled();
        });
    });

    it('calls onRowClick when a row is clicked', async () => {
        const onRowClick = jest.fn();
        await act(() => { render(<DataGrid {...defaultProps} onRowClick={onRowClick} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            const row = screen.getByTestId('data-grid-row-0');
            fireEvent.click(row);
            expect(onRowClick).toHaveBeenCalledTimes(1);
        });
    });

    it('renders with the correct container ID', async () => {
        let container;
        await act(async () => {
            const renderResult = render(<DataGrid {...defaultProps} />);
            container = renderResult.container;
        });
        await waitForReactUpdate();
        await waitFor(() => {
            const element = container.querySelector('#test-grid');

            expect(element).toBeInTheDocument();
        });
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

    it('renders multiple data rows correctly', async () => {
        await act(() => {
            render(<DataGrid id="test-grid" columns={sampleColumns} data={sampleData} pageSize={3} />);
        });
        await waitForReactUpdate();
        await waitFor(() => {
            expect(screen.getByText('Row 1')).toBeInTheDocument();
            expect(screen.getByText('Row 2')).toBeInTheDocument();
            expect(screen.getByText('Row 3')).toBeInTheDocument();
        });
    });

    it('renders correct number of rows based on pageSize', async () => {
        await act(() => { render(<DataGrid {...defaultProps} pageSize={1} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            const rows = screen.getAllByTestId(/^data-grid-row-/);

            expect(rows.length).toBe(1);
        });
    });
});

describe('DataGrid Advanced Features (aligned with mocks)', () => {
    const columns = [
        { name: 'firstName', alias: 'First Name' },
        { name: 'lastName', alias: 'Last Name' },
        { name: 'age', alias: 'Age', fixed: true },
        { name: 'secret', alias: 'Secret', hidden: true }
    ];

    const data = [
        { firstName: 'Alice', lastName: 'Smith', age: 30, secret: 'A' },
        { firstName: 'Bob', lastName: 'Jones', age: 25, secret: 'B' },
        { firstName: 'Charlie', lastName: 'Brown', age: 35, secret: 'C' }
    ];

    const options = {
        gridClass: "test",
        editButton: {},
        deleteButton: {},
        enableColumnSearch: true,
        enableGlobalSearch: true,
        enableColumnResize: false,
        enableColumnDrag: false,
        enableCellEdit: false,
        enableDownload: true
    }

    const defaultProps = {
        id: 'test-grid',
        columns,
        data,
        pageSize: 2,
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

    it('renders correct number of rows based on pageSize (via mock slicing)', async () => {
        await act(() => {
            render(<DataGrid
                {...defaultProps}
                options={{
                    ...defaultProps.options,
                    showToolbar: false,
                    showResetButton: false,
                    showFooter: false,
                    showNumberPagination: false,
                    showSelectPagination: false,
                    showPageSizeSelector: false,
                    showPageInfo: false,
                    rowHeight: '100px',
                    debug: true
                }}
            />);
        });
        await waitForReactUpdate();
        await waitFor(() => {
            const rows = screen.getAllByTestId(/^data-grid-row-/);
            expect(rows.length).toBe(2);
        });
    });

    it('renders global search bar and triggers onSearchClicked', async () => {
        const inputValue = 'Alice';
        await act(() => { render(<DataGrid {...defaultProps} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            const input = screen.getByTestId('global-search-input');
            fireEvent.change(input, { target: { value: inputValue } });

            expect(input.value).toBe(inputValue);
        });
    });

    it('resets global search when Reset is clicked', async () => {
        await act(() => { render(<DataGrid {...defaultProps} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            const input = screen.getByTestId('global-search-input');
            fireEvent.change(input, { target: { value: 'Test' } });
            expect(input.value).toBe('Test');

            const resetBtn = screen.getByText('Reset');
            fireEvent.click(resetBtn);
            expect(input.value).toBe('');
        });
    });

    it('renders second page of data manually (simulate pagination)', async () => {
        const paginatedProps = {
            ...defaultProps,
            data: data.slice(2),
        };
        await act(() => { render(<DataGrid {...paginatedProps} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            const rows = screen.getAllByTestId(/^data-grid-row-/);

            expect(rows.length).toBe(1);
        });
    });

    it('simulates sort column click but does not render dynamic content', async () => {
        const onSortComplete = jest.fn();
        await act(() => { render(<DataGrid {...defaultProps} onSortComplete={onSortComplete} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            fireEvent.click(screen.getByLabelText('Age'));
            expect(onSortComplete).not.toHaveBeenCalled();
        });
    });

    it('does not crash when onRowClick is undefined', async () => {
        const columns = [{
            name: 'name', alias: 'Name',
            concatColumns: { columns: ['name', 'id'], separator: "," }
        },
        {
            name: 'id'
        }];
        const data = [{ name: 'Alice' }];
        await act(() => {
            render(
                <DataGrid
                    id="test-grid"
                    columns={columns}
                    data={data}
                    pageSize={1}
                    onRowClick={undefined}
                />
            );
        });
        await waitForReactUpdate();
        await waitFor(() => {
            const row = screen.getByTestId('data-grid-row-0');
            expect(() => { fireEvent.click(row); }).not.toThrow();
        });
    });

    it('handles undefined onRowHover and onRowOut safely', async () => {
        await act(() => { render(<DataGrid {...defaultProps} onRowHover={null} onRowOut={null} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            const row = screen.getByTestId('data-grid-row-0');

            expect(() => {
                fireEvent.mouseOver(row);
                fireEvent.mouseOut(row);
            }).not.toThrow();
        })
    });

    it('handles undefined onSortComplete safely', async () => {
        await act(() => { render(<DataGrid {...defaultProps} onSortComplete={undefined} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            const header = screen.getByLabelText('Age');
            expect(() => fireEvent.click(header)).not.toThrow();
        });
    });

    it('handles undefined onSearchComplete safely', async () => {
        await act(() => { render(<DataGrid {...defaultProps} data={null} onSearchComplete={undefined} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            const input = screen.getByTestId('global-search-input');
            expect(() => fireEvent.change(input, { target: { value: 'test' } })).not.toThrow();
        });
    });

    it('handles undefined onDownloadComplete safely', async () => {
        await act(() => { render(<DataGrid {...defaultProps} pageSize={'abc'} onDownloadComplete={undefined} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            const downloadBtn = screen.getByTestId('download-btn');
            expect(() => fireEvent.click(downloadBtn)).not.toThrow();
        });
    });

    it('renders DataGrid without crashing', async () => {
        expect(async () => await act(() => {
            render(<DataGrid onRowHover={null} gridClass={"test"} />)
        })).not.toThrow();
    });

    it('columns are ordered based on "order" property', async () => {
        const columns = [
            { name: 'B', alias: 'Column B', order: 2 },
            { name: 'A', alias: 'Column A', order: 1 },
            { name: 'C', alias: 'Column C' }
        ];

        const data = [
            { A: 'a1', B: 'b1', C: 'c1' },
            { A: 'a2', B: 'b2', C: 'c2' }
        ];
        await act(() => { render(<DataGrid data={data} columns={columns} pageSize={10} currentPage={1} />); });
        await waitForReactUpdate();
        await waitFor(() => {
            const headerCells = screen.getAllByRole('columnheader');
            const headerText = headerCells
                .map(cell => cell.textContent?.trim()).filter(Boolean);
            expect(headerText).toEqual(['Column A', 'Column B', 'Column C']);
        });
    });
});

describe('DataGrid Null Check Tests', () => {
    it('renders with null columns', async () => {
        await act(() => { render(<DataGrid id="grid-null-columns" columns={null} data={[]} />); });
        await waitForReactUpdate();
        await waitFor(() => { expect(screen.getByRole('table')).toBeInTheDocument(); });
    });

    it('renders with undefined columns', async () => {
        await act(() => { render(<DataGrid id="grid-undefined-columns" data={[]} />); });
        await waitForReactUpdate();
        await waitFor(() => { expect(screen.getByRole('table')).toBeInTheDocument(); });
    });

    it('renders with null data', async () => {
        await act(() => { render(<DataGrid id="grid-null-data" columns={[]} data={null} />); });
        await waitForReactUpdate();
        await waitFor(() => { expect(screen.getByRole('table')).toBeInTheDocument(); });
    });

    it('renders with undefined data', async () => {
        await act(() => { render(<DataGrid id="grid-undefined-data" columns={[]} />); });
        await waitForReactUpdate();
        await waitFor(() => { expect(screen.getByRole('table')).toBeInTheDocument(); });
    });

    it('renders with null pageSize', async () => {
        await act(() => { render(<DataGrid id="grid-null-pagesize" columns={[]} data={[]} pageSize={null} />); });
        await waitForReactUpdate();
        await waitFor(() => { expect(screen.getByRole('table')).toBeInTheDocument(); });
    });

    it('generates gridID if id is null or missing', async () => {
        let container;
        await act(async () => {
            const renderResult = render(<DataGrid columns={[]} data={[]} />);
            container = renderResult.container;
        });
        await waitForReactUpdate();
        await waitFor(() => {
            const gridDiv = container.querySelector('.r-d-g-lt-comp');
            expect(gridDiv).toBeInTheDocument();
            expect(gridDiv.id).toMatch(/^id-\d+/);
        });
    });

    it('handles null options prop gracefully', async () => {
        await act(() => { render(<DataGrid id="grid-null-options" columns={[]} data={[]} options={null} />); });
        await waitForReactUpdate();
        await waitFor(() => { expect(screen.getByRole('table')).toBeInTheDocument(); });
    });

    it('handles missing event handlers without errors', async () => {
        await act(() => { render(<DataGrid id="grid-null-handlers" columns={[]} data={[]} />); });
        await waitForReactUpdate();
        await waitFor(() => { expect(screen.getByRole('table')).toBeInTheDocument(); });
    });
});

describe('handleForwardPage and handleBackwardPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        cleanup();
    });

    it('increments activePage when clicking Next button if not on last page', async () => {
        const columns = [{ name: 'id' }];
        const data = [{ id: 1 }, { id: 2 }];

        const onPageChange = jest.fn();

        await act(() => {
            render(
                <DataGrid
                    columns={columns}
                    data={data}
                    pageSize={1}
                    currentPage={1}
                    onPageChange={onPageChange}
                />
            );
        });
        await waitForReactUpdate();
        await waitFor(() => {
            const nextButton = screen.getByLabelText('Next Page');
            fireEvent.click(nextButton);
            expect(onPageChange).toHaveBeenCalled();
            const callArgs = onPageChange.mock.calls[0];
            expect(callArgs[1]).toBe(2);
        });
    });

    it('does not increment activePage when clicking Next button on last page', async () => {
        const columns = [{ name: 'id' }];
        const data = [{ id: 1 }];

        const onPageChange = jest.fn();

        await act(() => {
            render(
                <DataGrid
                    columns={columns}
                    data={data}
                    pageSize={1}
                    currentPage={1}
                    onPageChange={onPageChange}
                />
            );
        });
        await waitForReactUpdate();
        await waitFor(() => {
            const nextButton = screen.getByLabelText('Next Page');

            fireEvent.click(nextButton);
            expect(onPageChange).not.toHaveBeenCalled();
        });
    });

    it('increments activePage when clicking Previous button if not on first page', async () => {
        const columns = [{ name: 'id' }];
        const data = [{ id: 1 }, { id: 2 }];

        const onPageChange = jest.fn();

        await act(() => {
            render(
                <DataGrid
                    columns={columns}
                    data={data}
                    pageSize={1}
                    currentPage={2}
                    onPageChange={onPageChange}
                />
            );
        });
        await waitForReactUpdate();
        await waitFor(() => {
            const previousButton = screen.getByLabelText('Previous Page');
            fireEvent.click(previousButton);
            expect(onPageChange).toHaveBeenCalled();
            const callArgs = onPageChange.mock.calls[0];
            expect(callArgs[1]).toBe(1);
        });
    });
});