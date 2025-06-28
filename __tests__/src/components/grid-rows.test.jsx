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
import React, { useRef, useState } from 'react';
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
        firstRow: 0,
        currentPageRows: 2,
        hiddenColIndex: [],
        columnWidths: [null, null]
    };

    it('renders rows and cells correctly', () => {
        function TableComponent() {
            const [state] = useState({
                ...defaultProps
            });
            const ref = useRef(null);
            ref.current = [
                { name: 'name', width: '150px', leftPosition: '0px' }
                , { name: 'age', width: '150px', leftPosition: '150px' }]
            return (<table>
                <tbody>
                    <GridRows
                        state={state}
                        computedColumnWidthsRef={ref}
                    />
                </tbody>
            </table>);
        }
        render(<TableComponent />);
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('renders no data message when rowsData is empty', () => {
        function TableComponent() {
            const [state] = useState({
                ...defaultProps,
                rowsData: []
            });
            return (<table>
                <tbody>
                    <GridRows
                        state={state}
                    />
                </tbody>
            </table>);
        }
        const { container } = render(<TableComponent />);
        expect(container.querySelector('tbody')?.childElementCount).toBe(0);
    });

    it('calls onRowClick when a row is clicked', () => {
        const onRowClick = jest.fn();
        function TableComponent() {
            const [state] = useState({
                ...defaultProps,
                onRowClick: onRowClick,
                rowClickEnabled: true
            });
            const ref = useRef(null);
            ref.current = [
                { name: 'name', width: '150px', leftPosition: '0px' }
                , { name: 'age', width: '150px', leftPosition: '150px' }]
            return (<table>
                <tbody>
                    <GridRows
                        state={state}
                        computedColumnWidthsRef={ref}
                    />
                </tbody>
            </table>);
        }
        render(<TableComponent />);
        fireEvent.click(screen.getByText('Alice'));
        expect(onRowClick).toHaveBeenCalled();
    });

    it('calls edit and delete event handlers when buttons are clicked', () => {
        const editFn = jest.fn();
        const deleteFn = jest.fn();
        function TableComponent() {
            const [state] = useState({
                ...defaultProps,
                editButtonEnabled: true,
                deleteButtonEnabled: true,
                editButtonEvent: editFn,
                deleteButtonEvent: deleteFn
            });
            const ref = useRef(null);
            ref.current = [
                { name: 'name', width: '150px', leftPosition: '0px' }
                , { name: 'age', width: '150px', leftPosition: '150px' }]
            return (<table>
                <tbody>
                    <GridRows
                        state={state}
                        computedColumnWidthsRef={ref}
                    />
                </tbody>
            </table>);
        }
        render(<TableComponent />);

        const editIcon = screen.getAllByTitle('Edit')[0];
        const deleteIcon = screen.getAllByTitle('Delete')[0];

        fireEvent.click(editIcon);
        fireEvent.click(deleteIcon);

        expect(editFn).toHaveBeenCalled();
        expect(deleteFn).toHaveBeenCalled();
    });

    it('skips rendering hidden columns', () => {
        function TableComponent() {
            const [state] = useState({
                ...defaultProps,
                hiddenColIndex: [0]
            });
            const ref = useRef(null);
            ref.current = [
                { name: 'name', width: '150px', leftPosition: '0px' }
                , { name: 'age', width: '150px', leftPosition: '150px' }]
            return (<table>
                <tbody>
                    <GridRows
                        state={state}
                        computedColumnWidthsRef={ref}
                    />
                </tbody>
            </table>);
        }
        render(<TableComponent />);
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
        expect(screen.queryByText('25')).toBeInTheDocument();
    });

    it('applies formatted values if formatting is provided', () => {
        function TableComponent() {
            const [state] = useState({
                rowsData: [{ name: 'Alice' }],
                columns: [{ name: 'name' }],
                firstRow: 0,
                currentPageRows: 1,
                hiddenColIndex: [],
                columnWidths: [null],
            });
            const ref = useRef(null);
            ref.current = [{ name: 'name', width: '150px', leftPosition: '0px' }]
            return (<table>
                <tbody>
                    <GridRows
                        state={state}
                        computedColumnWidthsRef={ref}
                    />
                </tbody>
            </table>);
        }
        render(<TableComponent />);
        expect(screen.getByText('Formatted(Alice)')).toBeInTheDocument();
    });
});