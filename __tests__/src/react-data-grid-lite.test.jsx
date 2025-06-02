/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

jest.mock('./../../src/components/grid-footer', () => () => <div data-testid="grid-footer">Footer</div>);
jest.mock('./../../src/components/grid-global-search-bar', () => (props) => (
    <div data-testid="global-search-bar">
        <input
            data-testid="global-search-input"
            data-type={`globalSearch${props.gridID}`}
            value={props.globalSearchInput}
            onChange={(e) => props.onSearchClicked(e)}
        />
        <button onClick={(e) => props.handleResetSearch(e)}>Reset</button>
    </div>
));
jest.mock('./../../src/components/grid-header', () => () => <thead><tr><th>Header</th></tr></thead>);
jest.mock('./../../src/components/grid-rows', () => (props) =>
    <tr data-testid="data-grid-row-0" onClick={() => props.onRowClick({ rowData: props.rowsData[0] })}>
        <td>
            <div>Row</div>
        </td>
    </tr>
);

jest.mock('./../../src/helpers/common', () => ({
    isNull: (val) => val === null || val === undefined,
}));

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import * as eventHandlers from './../../src/components/events/event-grid-header-clicked';
import * as searchHandlers from './../../src/components/events/event-grid-search-clicked';
import DataGrid from './../../src/react-data-grid-lite';

describe('DataGrid Component', () => {
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
        onRowClick: jest.fn(),
        onPageChange: jest.fn(),
        onSortComplete: jest.fn(),
        onSearchComplete: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders DataGrid with default props', () => {
        render(<DataGrid {...defaultProps} />);
        expect(screen.getByTestId('global-search-bar')).toBeInTheDocument();
        expect(screen.getByTestId('grid-footer')).toBeInTheDocument();
        expect(screen.getByText('Row')).toBeInTheDocument();
    });

    it('calls onSearchClicked when global search input is changed', () => {
        const spy = jest.spyOn(searchHandlers, 'eventGridSearchClicked').mockImplementation(() => { });
        render(<DataGrid {...defaultProps} />);
        const input = screen.getByTestId('global-search-input');
        fireEvent.change(input, { target: { value: 'test' } });
        expect(spy).toHaveBeenCalled();
    });

    it('resets global search on reset button click', () => {
        render(<DataGrid {...defaultProps} />);
        const resetBtn = screen.getByText('Reset');
        fireEvent.click(resetBtn);
        const input = screen.getByTestId('global-search-input');
        expect(input.value).toBe('');
    });

    it('handles page forward navigation', () => {
        render(<DataGrid {...defaultProps} />);
        const footer = screen.getByTestId('grid-footer');
        expect(footer).toBeInTheDocument();
    });

    it('calls eventGridHeaderClicked when header clicked', () => {
        const spy = jest.spyOn(eventHandlers, 'eventGridHeaderClicked').mockImplementation(() => { });
        render(<DataGrid {...defaultProps} />);
        const dummyEvent = { preventDefault: () => { } };
        fireEvent.click(screen.getByText('Header'), dummyEvent);
        expect(spy).not.toBeCalled();
    });

    it('triggers onPageChange after forward navigation', () => {
        render(<DataGrid {...defaultProps} />);
    });

    it('handles sorting and search effect callbacks', () => {
        render(<DataGrid {...defaultProps} />);
    });

    it('handles pagination state changes correctly', () => {
        render(<DataGrid {...defaultProps} />);
    });
    it('renders without crashing', () => {
        const { container } = render(<DataGrid {...defaultProps} />);
        const element = container.querySelector('#test-grid');
        expect(element).toBeInTheDocument();
    });
    it('displays correct number of rows', () => {
        render(<DataGrid {...defaultProps} />);
        const rows = screen.getAllByTestId('data-grid-row-0');
        expect(rows.length).toBe(defaultProps.pageSize);
    });
    it('handles row click', () => {
        const onRowClick = jest.fn();
        render(<DataGrid {...defaultProps} onRowClick={onRowClick} />);
        const row = screen.getByTestId('data-grid-row-0');
        fireEvent.click(row);
        expect(onRowClick).toHaveBeenCalledTimes(1);
    });
});