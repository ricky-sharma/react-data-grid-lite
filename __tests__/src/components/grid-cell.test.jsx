/* eslint-disable react/display-name */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import GridCell from '../../../src/components/grid-cell';
import { useGridConfig } from '../../../src/hooks/use-grid-config';

jest.mock('../../../src/hooks/use-grid-config', () => ({
    useGridConfig: jest.fn()
}));

jest.mock('../../../src/components/grid-edit/editable-cell-fields', () => () => (
    <div data-testid="editable-cell">EditableCellFields</div>
));

describe('GridCell', () => {
    const baseProps = {
        keyProp: 0,
        col: { name: 'name', editable: true },
        isMobile: false,
        computedColumnWidthsRef: { current: [{ name: 'name', width: 100 }] },
        lastFixedIndex: null,
        rowIndex: 0,
        baseRowIndex: 0,
        baseRow: { name: 'Original' },
        formattedRow: { name: 'Original' },
        onCellEdit: jest.fn(),
        onKeyDown: jest.fn(),
        onTouchStart: () => (fn) => fn,
        commitChanges: jest.fn(),
        onCellChange: jest.fn(),
        revertChanges: jest.fn(),
        cellChangedFocusRef: { current: null },
        clickTimerRef: { current: null },
        didDoubleClickRef: { current: false }
    };

    it('renders the cell value', () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <GridCell {...baseProps} />
                    </tr>
                </tbody>
            </table>
        );
        expect(screen.getByText('Original')).toBeInTheDocument();
    });

    it('calls onCellEdit on double click', () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <GridCell {...baseProps} />
                    </tr>
                </tbody>
            </table>
        );
        const cell = screen.getByText('Original').closest('td');
        fireEvent.doubleClick(cell);
        expect(baseProps.onCellEdit).toHaveBeenCalledWith('name', 0, 0);
    });

    it('does not allow editing when editable is false', () => {
        const nonEditableProps = {
            ...baseProps,
            col: { name: 'name', editable: false }
        };
        render(
            <table>
                <tbody>
                    <tr>
                        <GridCell {...nonEditableProps} />
                    </tr>
                </tbody>
            </table>
        );
        const cell = screen.getByText('Original').closest('td');
        fireEvent.doubleClick(cell);
        expect(baseProps.onCellEdit).not.toHaveBeenCalled();
    });
});

describe('More GridCell tests', () => {
    const baseProps = {
        keyProp: 0,
        col: { name: 'name', alias: 'Name' },
        isMobile: false,
        computedColumnWidthsRef: { current: [{ name: 'name', width: 100, leftPosition: 10 }] },
        lastFixedIndex: 0,
        rowIndex: 0,
        baseRowIndex: 0,
        baseRow: { name: 'Original' },
        formattedRow: { name: 'Formatted' },
        onCellEdit: jest.fn(),
        onKeyDown: jest.fn(),
        onTouchStart: () => jest.fn(),
        commitChanges: jest.fn(),
        onCellChange: jest.fn(),
        revertChanges: jest.fn(),
        cellChangedFocusRef: { current: null },
        clickTimerRef: { current: null },
        didDoubleClickRef: { current: false }
    };

    beforeEach(() => {
        useGridConfig.mockReturnValue({
            state: {
                columns: [{ name: 'name' }],
                enableCellEdit: false,
                enableColumnResize: false,
                editingCell: {}
            }
        });
    });

    it('renders the formatted cell value', () => {
        const { getByText } = render(
            <table><tbody><tr><GridCell {...baseProps} /></tr></tbody></table>
        );
        expect(getByText('Formatted')).toBeInTheDocument();
    });

    it('renders EditableCellFields when editingCell matches', () => {
        useGridConfig.mockReturnValue({
            state: {
                columns: [{ name: 'name' }],
                enableCellEdit: true,
                enableColumnResize: false,
                editingCell: { rowIndex: 0, columnName: 'name' }
            }
        });
        const props = {
            ...baseProps,
            col: { name: 'name', alias: 'Name', editable: true }
        };
        const { getByTestId } = render(
            <table><tbody><tr><GridCell {...props} /></tr></tbody></table>
        );
        expect(getByTestId('editable-cell')).toBeInTheDocument();
    });

    it('calls onCellEdit on double click when editable', () => {
        const onCellEdit = jest.fn();

        const props = {
            ...baseProps,
            col: { name: 'name', editable: true },
            onCellEdit
        };
        const { getByRole } = render(
            <table><tbody><tr><GridCell {...props} /></tr></tbody></table>
        );
        fireEvent.doubleClick(getByRole('cell'));
        expect(onCellEdit).toHaveBeenCalledWith('name', 0, 0);
    });

    it('calls onKeyDown with expected args', () => {
        const onKeyDown = jest.fn();

        const props = {
            ...baseProps,
            col: { name: 'name', editable: true },
            onKeyDown
        };
        const { getByRole } = render(
            <table><tbody><tr><GridCell {...props} /></tr></tbody></table>
        );
        fireEvent.keyDown(getByRole('cell'), { key: 'Enter' });
        expect(onKeyDown).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({
            editable: true,
            rowIndex: 0,
            col: expect.objectContaining({ name: 'name' }),
            baseRowIndex: 0
        }));
    });

    it('renders custom render function if provided', () => {
        const props = {
            ...baseProps,
            col: {
                name: 'name',
                render: jest.fn(() => <div>Custom Rendered</div>)
            }
        };
        const { getByText } = render(
            <table><tbody><tr><GridCell {...props} /></tr></tbody></table>
        );
        expect(getByText('Custom Rendered')).toBeInTheDocument();
    });

    it('handles non-editable mousedown correctly', () => {
        const props = {
            ...baseProps,
            col: { name: 'name', editable: false }
        };
        const { container } = render(
            <table><tbody><tr><GridCell {...props} /></tr></tbody></table>
        );
        const td = container.querySelector('td');
        const event = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(event, 'target', {
            value: td,
        });
        event.preventDefault = jest.fn();
        td.dispatchEvent(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('sets proper inline styles and classes', () => {
        const props = {
            ...baseProps,
            col: {
                name: 'name',
                class: 'custom-class',
                editable: true,
                resizable: false,
                fixed: true,
                cellStyle: { color: 'red' }
            },
            lastFixedIndex: 0
        };
        const { getByRole } = render(
            <table><tbody><tr><GridCell {...props} /></tr></tbody></table>
        );
        const td = getByRole('cell');
        expect(td.className).toContain('editable-cell');
        expect(td.className).toContain('custom-class');
        expect(td.style.color).toBe('red');
        expect(td.style.position).toBe('sticky');
    });
});