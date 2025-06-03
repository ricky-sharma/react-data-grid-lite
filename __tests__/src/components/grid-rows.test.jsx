jest.mock('./../../../src/hooks/use-window-width', () => ({
    useWindowWidth: () => 1024,
}));

jest.mock('./../../../src/hooks/use-loading-indicator', () => ({
    __esModule: true,
    default: () => false,
}));

jest.mock('./../../../src/helpers/format', () => ({
    format: jest.fn((value) => `Formatted(${value})`)
}));

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import GridRows from './../../../src/components/grid-rows';

beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
});

describe('GridRows', () => {
    const defaultProps = {
        rowsData: [
            { name: 'Alice', age: 25 },
            { name: 'Bob', age: 30 }
        ],
        columns: [
            { name: 'name' },
            { name: 'age' }
        ],
        first: 0,
        count: 2,
        hiddenColIndex: [],
        columnWidths: [null, null]
    };

    it('renders rows and cells correctly', () => {
        render(<table><tbody><GridRows {...defaultProps} /></tbody></table>);
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('renders no data message when rowsData is empty', () => {
        render(<table><tbody><GridRows {...defaultProps} rowsData={[]} /></tbody></table>);
        expect(screen.getByText(/No Data/i)).toBeInTheDocument();
    });

    it('calls onRowClick when a row is clicked', () => {
        const onRowClick = jest.fn();
        render(<table><tbody><GridRows {...defaultProps} onRowClick={onRowClick} rowClickEnabled={true} /></tbody></table>);
        fireEvent.click(screen.getByText('Alice'));
        expect(onRowClick).toHaveBeenCalled();
    });

    it('calls edit and delete event handlers when buttons are clicked', () => {
        const editFn = jest.fn();
        const deleteFn = jest.fn();

        render(
            <table>
                <tbody>
                    <GridRows
                        {...defaultProps}
                        editButtonEnabled={true}
                        deleteButtonEnabled={true}
                        editButtonEvent={editFn}
                        deleteButtonEvent={deleteFn}
                    />
                </tbody>
            </table>
        );

        const editIcon = screen.getAllByTitle('Edit')[0];
        const deleteIcon = screen.getAllByTitle('Delete')[0];

        fireEvent.click(editIcon);
        fireEvent.click(deleteIcon);

        expect(editFn).toHaveBeenCalled();
        expect(deleteFn).toHaveBeenCalled();
    });

    it('skips rendering hidden columns', () => {
        const props = {
            ...defaultProps,
            hiddenColIndex: [0]
        };
        render(<table><tbody><GridRows {...props} /></tbody></table>);
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
        expect(screen.queryByText('25')).toBeInTheDocument();
    });

    it('applies formatted values if formatting is provided', () => {
        const props = {
            rowsData: [{ name: 'Alice' }],
            columns: [{ name: 'name' }],
            columnFormatting: [{ type: 'text', format: '' }],
            first: 0,
            count: 1,
            hiddenColIndex: [],
            columnWidths: [null, null],
            cssClassColumns: []
        };
        render(<table><tbody><GridRows {...props} /></tbody></table>);
        expect(screen.getByText('Formatted(Alice)')).toBeInTheDocument();
    });

});