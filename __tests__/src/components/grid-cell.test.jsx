/* eslint-disable react/display-name */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import GridCell from '../../../src/components/grid-cell';

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

describe('GridCell', () => {
    it('renders the cell value', () => {
        render(<GridCell {...baseProps} />);
        expect(screen.getByText('Original')).toBeInTheDocument();
    });

    it('calls onCellEdit on double click', () => {
        render(<GridCell {...baseProps} />);
        const cell = screen.getByText('Original').closest('td');
        fireEvent.doubleClick(cell);
        expect(baseProps.onCellEdit).toHaveBeenCalledWith('name', 0, 0);
    });

    it('does not allow editing when editable is false', () => {
        const nonEditableProps = {
            ...baseProps,
            col: { name: 'name', editable: false }
        };
        render(<GridCell {...nonEditableProps} />);
        const cell = screen.getByText('Original').closest('td');
        fireEvent.doubleClick(cell);
        expect(baseProps.onCellEdit).not.toHaveBeenCalled();
    });
});
