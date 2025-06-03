/* eslint-disable no-undef */
import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import GridHeader from './../../../src/components/grid-header';

afterEach(() => {
    cleanup();
});

beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
});

it('renders column headers correctly', () => {
    const columns = [{ name: 'Name' }, { name: 'Age' }];
    render(
        <table>
            <GridHeader columns={columns} />
        </table>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
});

it('returns null when columns are null', () => {
    const { container } = render(
        <table>
            <GridHeader columns={null} />
        </table>
    );
    expect(container.querySelector('thead')).toBeNull();
});

it('toggles search row visibility based on enableColumnSearch', () => {
    let columns = [{ name: 'Name', alias: 'Full Name', searchEnable: true }];
    render(<table><GridHeader columns={columns} enableColumnSearch={true} /></table>);
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    cleanup();
    columns = [{ name: 'Name', searchEnable: false }, { name: 'Id', hidden: true }];
    render(<table><GridHeader columns={columns} enableColumnSearch={false} onHeaderClicked={null} /></table>);
    expect(screen.queryAllByPlaceholderText('Search')).toHaveLength(0);
});

it('calls onSearchClicked when search input changes', () => {
    const onSearchClicked = jest.fn();
    const columns = [{ name: 'Name' }];
    render(<table><GridHeader columns={columns} onSearchClicked={onSearchClicked} /></table>);
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'John' } });
    expect(onSearchClicked).toHaveBeenCalled();
});

it('renders action column when editButtonEnabled or deleteButtonEnabled is true', () => {
    cleanup();
    const columns = [{ name: 'Name' }];
    render(<table><GridHeader columns={columns} editButtonEnabled={true} /></table>);
    expect(screen.queryByTitle('Actions')).toBeInTheDocument();
    cleanup();
    render(<table><GridHeader columns={columns} deleteButtonEnabled={true} /></table>);
    expect(screen.queryByTitle('Actions')).toBeInTheDocument();
});

it('does not render action column when both editButtonEnabled and deleteButtonEnabled are false', () => {
    const columns = [{ name: 'Name' }];
    render(<table><GridHeader columns={columns} editButtonEnabled={false} deleteButtonEnabled={false} /></table>);
    expect(screen.queryByTitle('Actions')).not.toBeInTheDocument();
});

it('adjusts column widths based on isMobile screen size', () => {
    const columns = [{ name: 'Name' }];
    const columnWidths = ['100px'];
    global.innerWidth = 600;
    global.dispatchEvent(new Event('resize'));

    render(
        <table>
            <GridHeader columns={columns} columnWidths={columnWidths} />
        </table>
    );

    const headerCell = screen.getByText('Name').closest('th');
    expect(headerCell).toHaveStyle('width: 540px');
});

it('calls onHeaderClicked when a header is clicked', () => {
    const onHeaderClicked = jest.fn();
    const columns = [{ name: 'Name' }];
    render(<table><GridHeader columns={columns} onHeaderClicked={onHeaderClicked} /></table>);
    const header = screen.getByText('Name');
    fireEvent.click(header);
    expect(onHeaderClicked).toHaveBeenCalledWith(expect.any(Object), ['Name']);
});

it('renders correct CSS classes for header cells', () => {
    const columns = [{ name: 'Name', class: 'name-column' }];
    render(<table><GridHeader columns={columns} /></table>);
    const header = screen.getByText('Name');
    expect(header.parentElement).toHaveClass('name-column');
});

it('renders grouped columns based on concatColumns', () => {
    const columns = [{ name: 'First Name' }, { name: 'Last Name' }];
    const concatColumns = [{ cols: ['First Name', 'Last Name'] }];
    render(<table><GridHeader columns={columns} concatColumns={concatColumns} /></table>);
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
});