import { act, cleanup, fireEvent, render } from '@testing-library/react';
import React, { useState } from 'react';
import { Movement_Threshold } from '../../../src/constants';
import { useDraggableColumns } from '../../../src/hooks/use-draggable-columns';

describe('useDraggableColumns (via test component)', () => {
    let onColumnDragEndMock;

    const TestComponent = ({ initialColumns }) => {
        const [state, setState] = useState({ columns: initialColumns });

        const { getColumnProps } = useDraggableColumns(state.columns,
            setState, onColumnDragEndMock);

        return (
            <table data-testid="container" id="table-container">
                <thead>
                    <tr>
                        {state.columns.map((col) => (
                            <th
                                key={col.name}
                                data-testid={`col-${col.name}`}
                                data-column-name={col.name}
                                {...getColumnProps(col.displayIndex)}
                            >
                                {col.name}
                            </th>
                        ))}
                    </tr>
                </thead>
            </table>
        );
    };

    function TestComponent2({ columns, onColumnDragEnd }) {
        const [state, setState] = useState({ columns });
        const { getColumnProps } = useDraggableColumns(state.columns, setState, onColumnDragEnd);

        return (
            <table data-testid="container" style={{ touchAction: 'none' }}>
                <thead>
                    <tr>
                        {state.columns.map(col => (
                            <th
                                key={col.name}
                                data-column-name={col.name}
                                {...getColumnProps(col.displayIndex)}
                                data-testid={`col-${col.name}`}
                            >
                                {col.name}
                            </th>
                        ))}
                    </tr>
                </thead>
            </table>
        );
    }

    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
        cleanup();
        onColumnDragEndMock = jest.fn();
        document.querySelector = jest.fn(() => ({
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        }));

        document.elementFromPoint = jest.fn(() => ({
            getAttribute: () => 'C',
        }));
    });

    afterAll(() => {
        delete global.Touch;
        jest.resetAllMocks();
        jest.clearAllMocks();
        cleanup();
    });

    const columns = [
        { name: 'A', displayIndex: 1 },
        { name: 'B', displayIndex: 2 },
        { name: 'C', displayIndex: 3 },
    ];

    it('reorders columns via drag-and-drop', () => {
        const { getByTestId } = render(<TestComponent initialColumns={columns} />);

        const colA = getByTestId('col-A');
        const colC = getByTestId('col-C');

        fireEvent.dragStart(colA);
        fireEvent.dragOver(colC);
        fireEvent.drop(colC);

        expect(onColumnDragEndMock).toHaveBeenCalledWith(
            'A',
            expect.arrayContaining([
                expect.objectContaining({ name: 'A', order: 3 }),
                expect.objectContaining({ name: 'C', order: 2 }),
            ])
        );
    });

    it('does not reorder if dragging between fixed and non-fixed', () => {
        const fixedColumns = [
            { name: 'A', displayIndex: 1, fixed: true },
            { name: 'B', displayIndex: 2 },
        ];

        const { getByTestId } = render(<TestComponent initialColumns={fixedColumns} />);

        const colA = getByTestId('col-A');
        const colB = getByTestId('col-B');

        fireEvent.dragStart(colA);
        fireEvent.drop(colB);

        expect(onColumnDragEndMock).not.toHaveBeenCalled();
    });

    it('handles touch drag and reorder', () => {
        const { getByTestId } = render(<TestComponent initialColumns={columns} />);

        const colA = getByTestId('col-A');

        const touchStartEvent = {
            touches: [{ clientX: 100, clientY: 100 }],
        };
        const touchMoveEvent = {
            touches: [{ clientX: 140, clientY: 105 }],
        };

        fireEvent.touchStart(colA, touchStartEvent);
        fireEvent.touchMove(colA, touchMoveEvent);
        fireEvent.touchEnd(colA);

        expect(onColumnDragEndMock).toHaveBeenCalledWith(
            'A',
            expect.arrayContaining([
                expect.objectContaining({ name: 'A' }),
                expect.objectContaining({ name: 'C' }),
            ])
        );
    });

    it('activates drag and calls preventDefault when movement exceeds threshold and is mostly horizontal', () => {
        const listeners = {};
        document.querySelector = jest.fn(() => ({
            addEventListener: jest.fn((event, cb) => {
                listeners[event] = cb;
            }),
            removeEventListener: jest.fn(),
        }));

        document.elementFromPoint = jest.fn(() => ({
            getAttribute: () => 'C',
        }));

        const { getByTestId } = render(<TestComponent initialColumns={columns} />);
        const colA = getByTestId('col-A');
        fireEvent.touchStart(colA, {
            touches: [{ clientX: 50, clientY: 50 }],
        });
        const preventDefault = jest.fn();
        act(() => {
            listeners['touchmove']({
                touches: [{ clientX: 120, clientY: 55 }],
                cancelable: true,
                preventDefault,
            });
        });

        fireEvent.touchEnd(colA);
        expect(preventDefault).toHaveBeenCalled();
        expect(onColumnDragEndMock).toHaveBeenCalledWith(
            'A',
            expect.arrayContaining([
                expect.objectContaining({ name: 'A' }),
                expect.objectContaining({ name: 'C' }),
            ])
        );
    });

    it('returns empty getColumnProps when inputs are invalid', () => {
        const InvalidHookUsage = () => {
            const { getColumnProps } = useDraggableColumns(null, null);
            const props = getColumnProps(1);
            return (
                <div data-testid="invalid-col" {...props}>
                    Invalid Column
                </div>
            );
        };

        const { getByTestId } = render(<InvalidHookUsage />);
        const el = getByTestId('invalid-col');
        expect(el.getAttribute('draggable')).toBe(null);
    });

    it('does not reorder when dragging to the same index (fromIndex === toIndex)', () => {
        const { getByTestId } = render(<TestComponent initialColumns={columns} />);
        const colA = getByTestId('col-A');
        fireEvent.dragStart(colA);
        fireEvent.drop(colA);
        expect(onColumnDragEndMock).not.toHaveBeenCalled();
    });

    it('calls onColumnDragEnd with correct newColumnOrder, excluding hidden and including alias', () => {
        const columnsWithAliasAndHidden = [
            { name: 'A', displayIndex: 1, alias: 'Alpha' },
            { name: 'B', displayIndex: 2, hidden: true },
            { name: 'C', displayIndex: 3 },
        ];

        const { getByTestId } = render(<TestComponent initialColumns={columnsWithAliasAndHidden} />);
        const colA = getByTestId('col-A');
        const colC = getByTestId('col-C');

        fireEvent.dragStart(colA);
        fireEvent.drop(colC);

        expect(onColumnDragEndMock).toHaveBeenCalledTimes(1);

        const [sourceColName, newOrder] = onColumnDragEndMock.mock.calls[0];

        expect(sourceColName).toBe('A');
        expect(newOrder).toEqual([
            { name: 'C', order: 1 },
            { name: 'A', order: 2, alias: 'Alpha' }
        ]);
    });

    it('does not throw or call onColumnDragEnd when it is not a function', () => {
        const columns = [
            { name: 'A', displayIndex: 1 },
            { name: 'B', displayIndex: 2 },
        ];

        const TestComponentWithInvalidCallback = () => {
            const [state, setState] = React.useState({ columns });

            const { getColumnProps } = useDraggableColumns(state.columns, setState, 'not-a-function');

            return (
                <div>
                    {state.columns.map(col => (
                        <div
                            key={col.name}
                            data-testid={`col-${col.name}`}
                            data-column-name={col.name}
                            {...getColumnProps(col.displayIndex)}
                        >
                            {col.name}
                        </div>
                    ))}
                </div>
            );
        };

        const { getByTestId } = render(<TestComponentWithInvalidCallback />);
        const colA = getByTestId('col-A');
        const colB = getByTestId('col-B');

        expect(() => {
            fireEvent.dragStart(colA);
            fireEvent.drop(colB);
        }).not.toThrow();
    });

    it('ignores touchMove if touchStartRef is not set (no prior touchStart)', () => {
        const { getByTestId } = render(<TestComponent initialColumns={columns} />);
        const colA = getByTestId('col-A');
        fireEvent.touchMove(colA, {
            touches: [{ clientX: 120, clientY: 120 }],
        });
        fireEvent.touchEnd(colA);
        expect(onColumnDragEndMock).not.toHaveBeenCalled();
    });
    it('ignores touchMove if document.elementFromPoint returns null', () => {
        document.elementFromPoint = jest.fn(() => null);

        const { getByTestId } = render(<TestComponent initialColumns={columns} />);
        const colA = getByTestId('col-A');

        fireEvent.touchStart(colA, {
            touches: [{ clientX: 50, clientY: 50 }],
        });

        fireEvent.touchMove(colA, {
            touches: [{ clientX: 100, clientY: 50 }],
        });

        fireEvent.touchEnd(colA);
        expect(onColumnDragEndMock).not.toHaveBeenCalled();
    });
    it('ignores touchMove if elementFromPoint returns unknown column name', () => {
        document.elementFromPoint = jest.fn(() => ({
            getAttribute: () => 'Z'
        }));

        const { getByTestId } = render(<TestComponent initialColumns={columns} />);
        const colA = getByTestId('col-A');

        fireEvent.touchStart(colA, {
            touches: [{ clientX: 50, clientY: 50 }],
        });

        fireEvent.touchMove(colA, {
            touches: [{ clientX: 100, clientY: 50 }],
        });
        fireEvent.touchEnd(colA);
        expect(onColumnDragEndMock).not.toHaveBeenCalled();
    });
    it('does not allow reordering between fixed and non-fixed columns', () => {
        const fixedAndNonFixedColumns = [
            { name: 'A', displayIndex: 1, fixed: true },
            { name: 'B', displayIndex: 2, fixed: false },
            { name: 'C', displayIndex: 3, fixed: false },
        ];
        document.elementFromPoint = jest.fn(() => ({
            getAttribute: () => 'B',
        }));

        const { getByTestId } = render(<TestComponent initialColumns={fixedAndNonFixedColumns} />);
        const colA = getByTestId('col-A');

        fireEvent.touchStart(colA, {
            touches: [{ clientX: 50, clientY: 50 }],
        });

        fireEvent.touchMove(colA, {
            touches: [{ clientX: 100, clientY: 50 }],
        });

        fireEvent.touchEnd(colA);
        expect(onColumnDragEndMock).not.toHaveBeenCalled();
    });

    it('does not attach touchmove listener if container is not found', () => {
        const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(null);
        const addEventListenerSpy = jest.fn();
        const container = {
            addEventListener: addEventListenerSpy,
            removeEventListener: jest.fn()
        };
        render(<TestComponent initialColumns={columns} />);
        expect(addEventListenerSpy).not.toHaveBeenCalled();
        querySelectorSpy.mockRestore();
    });
    it('ignores native touchmove if touchStartRef is not set', () => {
        const listeners = {};
        const containerMock = {
            addEventListener: jest.fn((event, cb) => {
                listeners[event] = cb;
            }),
            removeEventListener: jest.fn(),
        };
        jest.spyOn(document, 'querySelector').mockReturnValue(containerMock);
        document.elementFromPoint = jest.fn(() => ({
            getAttribute: () => 'C',
        }));

        render(<TestComponent initialColumns={columns} />);
        const preventDefault = jest.fn();
        act(() => {
            listeners['touchmove']({
                touches: [{ clientX: 100, clientY: 50 }],
                cancelable: true,
                preventDefault,
            });
        });
        expect(preventDefault).not.toHaveBeenCalled();
        expect(onColumnDragEndMock).not.toHaveBeenCalled();
    });

    it('calls preventDefault on touchmove if event is cancelable and movement exceeds threshold', () => {
        const listeners = {};
        const containerMock = {
            addEventListener: jest.fn((event, cb) => {
                listeners[event] = cb;
            }),
            removeEventListener: jest.fn(),
        };

        jest.spyOn(document, 'querySelector').mockReturnValue(containerMock);

        const elementMock = {
            getAttribute: () => 'B',
        };
        document.elementFromPoint = jest.fn(() => elementMock);

        const { getByTestId } = render(<TestComponent initialColumns={columns} />);
        const colA = getByTestId('col-A');
        fireEvent.touchStart(colA, {
            touches: [{ clientX: 50, clientY: 50 }],
        });

        const preventDefault = jest.fn();
        act(() => {
            listeners['touchmove']({
                touches: [{ clientX: 100, clientY: 55 }],
                cancelable: true,
                preventDefault,
            });
        });

        expect(preventDefault).toHaveBeenCalled();
    });

    it('activates drag only when distance exceeds threshold and movement is mostly horizontal', () => {
        const listeners = {};

        const containerMock = {
            addEventListener: jest.fn((event, cb) => {
                listeners[event] = cb;
            }),
            removeEventListener: jest.fn(),
        };

        jest.spyOn(document, 'querySelector').mockReturnValue(containerMock);
        document.elementFromPoint = jest.fn(() => ({
            getAttribute: () => 'B',
        }));

        const { getByTestId } = render(<TestComponent initialColumns={columns} />);
        const colA = getByTestId('col-A');
        fireEvent.touchStart(colA, {
            touches: [{ clientX: 0, clientY: 0 }],
        });
        const preventDefault = jest.fn();
        act(() => {
            listeners['touchmove']({
                touches: [{ clientX: 50, clientY: 10 }],
                cancelable: true,
                preventDefault,
            });
        });
        fireEvent.touchEnd(colA);

        expect(preventDefault).toHaveBeenCalled();
        expect(onColumnDragEndMock).toHaveBeenCalled();
    });

    it('does not activate drag if movement is mostly vertical', () => {
        const listeners = {};

        const containerMock = {
            addEventListener: jest.fn((event, cb) => {
                listeners[event] = cb;
            }),
            removeEventListener: jest.fn(),
        };

        jest.spyOn(document, 'querySelector').mockReturnValue(containerMock);

        document.elementFromPoint = jest.fn(() => ({
            getAttribute: () => 'B',
        }));

        const { getByTestId } = render(<TestComponent initialColumns={columns} />);
        const colA = getByTestId('col-A');

        fireEvent.touchStart(colA, {
            touches: [{ clientX: 0, clientY: 0 }],
        });

        const preventDefault = jest.fn();
        act(() => {
            listeners['touchmove']({
                touches: [{ clientX: 10, clientY: 60 }], // dx = 10, dy = 60 (vertical)
                cancelable: true,
                preventDefault,
            });
        });

        fireEvent.touchEnd(colA);

        expect(preventDefault).not.toHaveBeenCalled();
        expect(onColumnDragEndMock).not.toHaveBeenCalled();
    });

    it('applies correct styles based on dragActiveRef state', () => {
        const { getByTestId } = render(<TestComponent initialColumns={columns} />);
        const colA = getByTestId('col-A');
        expect(colA).toHaveStyle({
            opacity: '1',
            transform: 'none',
        });
        fireEvent.touchStart(colA, {
            touches: [{ clientX: 0, clientY: 0 }],
        });

        fireEvent.touchMove(colA, {
            touches: [{ clientX: 100, clientY: 5 }],
        });
        expect(colA).toHaveStyle({
            opacity: '0.6',
            transform: 'scale(1.03)',
        });
        fireEvent.touchEnd(colA);

        expect(colA).toHaveStyle({
            opacity: '1',
            transform: 'none',
        });
    });

    it('activates drag when horizontal movement exceeds threshold', () => {
        const columns = [
            { name: 'A', displayIndex: 1 },
            { name: 'B', displayIndex: 2 },
        ];
        const onColumnDragEnd = jest.fn();

        const { getByTestId } = render(<TestComponent2 columns={columns}
            onColumnDragEnd={onColumnDragEnd} />);

        const colA = getByTestId('col-A');
        fireEvent.touchStart(colA, {
            touches: [{ clientX: 0, clientY: 0 }],
        });
        fireEvent.touchMove(colA, {
            touches: [{ clientX: Movement_Threshold + 10, clientY: 1 }],
            cancelable: true,
            preventDefault: jest.fn(),
        });
        expect(colA).toHaveStyle({
            opacity: '0.6',
            transform: 'scale(1.03)',
        });
    });
});