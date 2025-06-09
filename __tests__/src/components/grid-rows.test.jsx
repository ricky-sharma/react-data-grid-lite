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
import React, { useRef } from 'react';
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
            { name: 'name', fixed: true, concatColumns: ["name", "age"] },
            { name: 'age', resizable: true }
        ],
        first: 0,
        count: 2,
        hiddenColIndex: [],
        columnWidths: [null, null]
    };

    it('renders rows and cells correctly', () => {
        const Wrapper = () => {
            const ref = useRef(null);
            ref.current = [
                { name: 'name', width: '150px', leftPosition: '0px' }
                , { name: 'age', width: '150px', leftPosition: '150px' }]
            return (
                <table>
                    <tbody>
                        <GridRows {...defaultProps} computedColumnWidthsRef={ref} />
                    </tbody>
                </table>
            );
        };
        render(<Wrapper />);
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
        const Wrapper = () => {
            const ref = useRef(null);
            ref.current = [
                { name: 'name', width: '150px', leftPosition: '0px' }
                , { name: 'age', width: '150px', leftPosition: '150px' }]
            return (
                <table><tbody><GridRows {...defaultProps}
                    onRowClick={onRowClick}
                    rowClickEnabled={true}
                    computedColumnWidthsRef={ref}
                /></tbody></table>
            );
        };
        render(<Wrapper />);
        fireEvent.click(screen.getByText('Alice'));
        expect(onRowClick).toHaveBeenCalled();
    });

    it('calls edit and delete event handlers when buttons are clicked', () => {
        const editFn = jest.fn();
        const deleteFn = jest.fn();
        const Wrapper = () => {
            const ref = useRef(null);
            ref.current = [
                { name: 'name', width: '150px', leftPosition: '0px' }
                , { name: 'age', width: '150px', leftPosition: '150px' }]
            return (
                <table>
                    <tbody>
                        <GridRows
                            {...defaultProps}
                            editButtonEnabled={true}
                            deleteButtonEnabled={true}
                            editButtonEvent={editFn}
                            deleteButtonEvent={deleteFn}
                            computedColumnWidthsRef={ref}
                        />
                    </tbody>
                </table>
            );
        };

        render(
            <Wrapper />
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
        const Wrapper = () => {
            const ref = useRef(null);
            ref.current = [
                { name: 'name', width: '150px', leftPosition: '0px' }
                , { name: 'age', width: '150px', leftPosition: '150px' }]
            return (
                <table><tbody><GridRows {...props} computedColumnWidthsRef={ref} /></tbody></table>
            );
        };
        render(<Wrapper />);
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
            columnWidths: [null],
            columnClass: [],
        };
        const Wrapper = () => {
            const ref = useRef(null);
            ref.current = [{ name: 'name', width: '150px', leftPosition: '0px' }]
            return (
                <table><tbody><GridRows {...props} computedColumnWidthsRef={ref} /></tbody></table>
            );
        };
        render(<Wrapper />);
        expect(screen.getByText('Formatted(Alice)')).toBeInTheDocument();
    });

});