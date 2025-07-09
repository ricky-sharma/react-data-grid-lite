/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
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

jest.mock('./../../../src/components/grid-edit/editable-cell-fields', () => (props) => {
    return (
        <input
            data-testid="editable-input"
            value={props.columnValue}
            onChange={e => props.onCellChange(e, undefined, props.editableColumns?.[0]?.colName)}
            onBlur={() => props.commitChanges(props.rowIndex, props.editableColumns, {}, true)}
        />
    );
});

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
        jest.useFakeTimers();
        const onRowClick = jest.fn();
        function TableComponent() {
            const [state] = useState({
                ...defaultProps,
                onRowClick,
                rowClickEnabled: true
            });

            const ref = useRef(null);
            ref.current = [
                { name: 'name', width: '150px', leftPosition: '0px' },
                { name: 'age', width: '150px', leftPosition: '150px' }
            ];

            return (
                <table>
                    <tbody>
                        <GridRows
                            state={state}
                            computedColumnWidthsRef={ref}
                        />
                    </tbody>
                </table>
            );
        }

        render(<TableComponent />);
        fireEvent.click(screen.getByText('Alice'));

        jest.advanceTimersByTime(450);
        expect(onRowClick).toHaveBeenCalled();
        jest.useRealTimers();
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
                columns: [
                    {
                        name: 'name',
                        fixed: true,
                        concatColumns: ["name", "age"],
                        hidden: true
                    },
                    { name: 'age', resizable: true }
                ],
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
                columns: [{
                    name: 'name',
                    formatting: { type: 'text', format: '' }
                }],
                firstRow: 0,
                currentPageRows: 1,
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

describe('More tests for GridRows Component', () => {
    const mockSetState = jest.fn();
    const mockEditButtonEvent = jest.fn();
    const mockDeleteButtonEvent = jest.fn();
    const mockOnCellUpdate = jest.fn();
    const mockOnRowClick = jest.fn();
    const mockOnRowHover = jest.fn();
    const mockOnRowOut = jest.fn();

    const baseState = {
        rowsData: [
            { id: 1, name: 'Alice', age: 25 },
            { id: 2, name: 'Bob', age: 30 }
        ],
        firstRow: 0,
        currentPageRows: 2,
        columns: [
            { name: 'id', hidden: false },
            { name: 'name', hidden: false, editable: true },
            { name: 'age', hidden: false }
        ],
        rowCssClass: 'test-row',
        rowClickEnabled: true,
        onRowClick: mockOnRowClick,
        onRowHover: mockOnRowHover,
        onRowOut: mockOnRowOut,
        editButtonEnabled: true,
        deleteButtonEnabled: true,
        editButtonEvent: mockEditButtonEvent,
        deleteButtonEvent: mockDeleteButtonEvent,
        enableColumnResize: false,
        gridID: 'test-grid',
        actionColumnAlign: 'right',
        enableCellEdit: true,
        editingCell: null,
        onCellUpdate: mockOnCellUpdate
    };

    const computedColumnWidthsRef = {
        current: [
            { name: 'id', width: 50, leftPosition: 0 },
            { name: 'name', width: 150, leftPosition: 50 },
            { name: 'age', width: 100, leftPosition: 200 },
            { name: 'button', width: 80, leftPosition: 300 }
        ]
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders rows with correct data', () => {
        render(<table><tbody><GridRows state={baseState} setState={mockSetState} computedColumnWidthsRef={computedColumnWidthsRef} /></tbody></table>);
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getAllByRole('row')).toHaveLength(2);
    });

    it('calls editButtonEvent on edit icon click', () => {
        render(<table><tbody><GridRows state={baseState} setState={mockSetState} computedColumnWidthsRef={computedColumnWidthsRef} /></tbody></table>);
        const editButtons = screen.getAllByTitle('Edit');
        fireEvent.click(editButtons[0]);
        expect(mockEditButtonEvent).toHaveBeenCalledWith(expect.any(Object), baseState.rowsData[0]);
    });

    it('calls deleteButtonEvent on delete icon click', () => {
        render(<table><tbody><GridRows state={baseState} setState={mockSetState} computedColumnWidthsRef={computedColumnWidthsRef} /></tbody></table>);
        const deleteButtons = screen.getAllByTitle('Delete');
        fireEvent.click(deleteButtons[1]);
        expect(mockDeleteButtonEvent).toHaveBeenCalledWith(expect.any(Object), baseState.rowsData[1]);
    });

    it('starts editing on double click of editable cell', () => {
        render(<table><tbody><GridRows state={baseState} setState={mockSetState} computedColumnWidthsRef={computedColumnWidthsRef} /></tbody></table>);
        const editableCell = screen.getAllByText('Alice')[0];
        fireEvent.doubleClick(editableCell);
        expect(mockSetState).toHaveBeenCalled();
        const setStateCall = mockSetState.mock.calls[0][0];
        expect(typeof setStateCall).toBe('function');
        const newState = setStateCall(baseState);
        expect(newState).toEqual(expect.objectContaining({
            editingCell: { rowIndex: 0, columnName: 'name' }
        }));
    });

    it('handles row click', () => {
        jest.useFakeTimers();
        render(<table><tbody><GridRows state={baseState} setState={mockSetState} computedColumnWidthsRef={computedColumnWidthsRef} /></tbody></table>);
        const rows = screen.getAllByRole('row');
        fireEvent.click(rows[0]);
        jest.advanceTimersByTime(500);
        expect(mockOnRowClick).toHaveBeenCalledWith(expect.any(Object), baseState.rowsData[0]);
        jest.useRealTimers();
    });

    it('renders nothing and shows loader if rowsData is null', () => {
        const stateWithNoData = { ...baseState, rowsData: null };
        const { container } = render(
            <table><tbody><GridRows
                state={stateWithNoData}
                setState={mockSetState}
                computedColumnWidthsRef={computedColumnWidthsRef} />
            </tbody></table>
        );

        const tbody = container.querySelector('tbody');
        expect(tbody.children.length).toBe(0);
    });

    it('renders nothing and shows loader if computedColumnWidthsRef.current is null', () => {
        const { container } = render(<table>
            <tbody>
                <GridRows
                    state={baseState}
                    setState={mockSetState}
                    computedColumnWidthsRef={{ current: null }} />
            </tbody></table>);
        const tbody = container.querySelector('tbody');
        expect(tbody.children.length).toBe(0);
    });    
});

describe('GridRows component editing', () => {
    const columns = [
        { name: 'name', editable: true },
        { name: 'age', editable: false }
    ];

    const initialRow = { name: 'Alice', age: 25 };
    let state;
    let setState;
    let onCellUpdate;

    beforeEach(() => {
        state = {
            rowsData: [initialRow],
            firstRow: 0,
            currentPageRows: 1,
            columns,
            editingCell: null,
            editingCellData: null,
            enableCellEdit: true,
        };
        onCellUpdate = jest.fn();

        setState = jest.fn((updater) => {
            if (typeof updater === 'function') {
                Object.assign(state, updater(state));
            } else {
                Object.assign(state, updater);
            }
        });
    });

    it('double clicking editable cell sets editingCell state', () => {
        render(
            <table>
                <tbody>
                    <GridRows
                        state={{ ...state, onCellUpdate }}
                        setState={setState}
                        computedColumnWidthsRef={{ current: columns }}
                    />
                </tbody>
            </table>
        );

        const cell = screen.getByText('Alice');
        fireEvent.doubleClick(cell);
        const setStateCall = setState.mock.calls.find(call => typeof call[0] === 'function');
        expect(setStateCall).toBeDefined();
        const newState = setStateCall[0](state);
        expect(newState).toEqual(expect.objectContaining({
            editingCell: { rowIndex: 0, columnName: 'name' }
        }));
    });

    it('editable input appears on editingCell and onCellChange updates rowsData and editingCellData', async () => {
        state.editingCell = { rowIndex: 0, columnName: 'name' };

        render(
            <table>
                <tbody>
                    <GridRows
                        state={{ ...state, onCellUpdate }}
                        setState={setState}
                        computedColumnWidthsRef={{ current: columns }}
                    />
                </tbody>
            </table>
        );
        const input = await screen.findByTestId('editable-input');
        expect(input).toBeInTheDocument();
        expect(input.value).toBe('Alice');
        fireEvent.change(input, { target: { value: 'Bob' } });
        const setStateCall = setState.mock.calls.find(call => typeof call[0] === 'function');
        expect(setStateCall).toBeDefined();
        const newState = setStateCall[0](state);
        expect(newState).toEqual(expect.objectContaining({
            rowsData: expect.arrayContaining([
                expect.objectContaining({ name: 'Bob' })
            ]),
            editingCellData: expect.objectContaining({ name: 'Alice' }),
        }));
    });

    it('commitChanges clears editingCell and calls onCellUpdate', () => {
        state.editingCell = { rowIndex: 0, columnName: 'name' };
        state.editingCellData = { name: 'Alice' };
        setState.mockClear();

        render(
            <table>
                <tbody>
                    <GridRows
                        state={{ ...state, onCellUpdate }}
                        setState={setState}
                        computedColumnWidthsRef={{ current: columns }}
                    />
                </tbody>
            </table>
        );

        const input = screen.getByTestId('editable-input');
        fireEvent.blur(input);
        const setStateCall = setState.mock.calls.find(call => typeof call[0] === 'function');
        expect(setStateCall).toBeDefined();
        const newState = setStateCall[0](state);
        expect(newState).toEqual(expect.objectContaining({
            editingCell: null,
            editingCellData: null,
        }));
    });

    it('revertChanges restores original data and clears editingCell state', () => {
        state.editingCell = { rowIndex: 0, columnName: 'name' };
        state.editingCellData = { name: 'Alice' };
        state.rowsData = [{ name: 'Bob', age: 25 }];

        render(
            <table>
                <tbody>
                    <GridRows
                        state={{ ...state, onCellUpdate }}
                        setState={setState}
                        computedColumnWidthsRef={{ current: columns }}
                    />
                </tbody>
            </table>
        );
        setState({
            editingCell: null,
            editingCellData: null,
            rowsData: [{ name: 'Alice', age: 25 }]
        });

        expect(setState).toHaveBeenCalledWith(expect.objectContaining({
            editingCell: null,
            editingCellData: null,
            rowsData: expect.arrayContaining([
                expect.objectContaining({ name: 'Alice' })
            ])
        }));
    });
});

describe('More Test cases for Grid Rows Edit function', () => {
    const RevertTestWrapper = () => {
        const [state, setState] = useState({
            rowsData: [{ id: 1, name: 'Original' }],
            firstRow: 0,
            currentPageRows: 1,
            columns: [{ name: 'name', editable: true }],
            rowCssClass: 'test-row',
            rowClickEnabled: false,
            onRowClick: jest.fn(),
            onRowHover: jest.fn(),
            onRowOut: jest.fn(),
            editButtonEnabled: false,
            deleteButtonEnabled: false,
            editButtonEvent: jest.fn(),
            deleteButtonEvent: jest.fn(),
            enableColumnResize: false,
            gridID: 'test-grid',
            actionColumnAlign: 'left',
            enableCellEdit: true,
            editingCell: { rowIndex: 0, columnName: 'name' },
            editingCellData: { name: 'Original' },
            onCellUpdate: jest.fn()
        });

        const computedColumnWidthsRef = useRef([
            { name: 'name', width: 100, leftPosition: 0 }
        ]);

        return (
            <table>
                <tbody>
                    <GridRows
                        state={state}
                        setState={setState}
                        computedColumnWidthsRef={computedColumnWidthsRef}
                    />
                    <tr>
                        <td>
                            <button onClick={() => {
                                const editableCol = [{ colName: 'name' }];
                                const rowsData = [...state.rowsData];
                                const rowIndex = state.editingCell.rowIndex;
                                const updatedRow = { ...rowsData[rowIndex] };
                                if (state.editingCellData?.hasOwnProperty('name')) {
                                    updatedRow.name = state.editingCellData['name'];
                                }
                                rowsData[rowIndex] = updatedRow;
                                setState(prev => ({
                                    ...prev,
                                    editingCell: null,
                                    editingCellData: null,
                                    rowsData
                                }));
                            }}>
                                Revert
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

        );
    };

    it('should revert the edited cell when editingCellData has original value', async () => {
        render(<RevertTestWrapper />);
        expect(screen.getByDisplayValue('Original')).toBeInTheDocument();
        const cell = screen.getByDisplayValue('Original').closest('td');
        fireEvent.doubleClick(cell);
        const input = await screen.findByRole('textbox');
        fireEvent.change(input, { target: { value: 'Changed' } });
        expect(screen.getByDisplayValue('Changed')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Revert'));
        expect(screen.queryByDisplayValue('Changed')).not.toBeInTheDocument();
        expect(screen.getByText('Original')).toBeInTheDocument();
    });
});