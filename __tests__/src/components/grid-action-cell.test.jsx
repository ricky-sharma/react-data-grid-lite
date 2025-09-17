import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GridActionCell from '../../../src/components/grid-action-cell';
import { useGridConfig } from '../../../src/hooks/use-grid-config';

jest.mock('../../../src/icons/edit-icon', () => () => <svg data-testid="edit-icon" />);
jest.mock('../../../src/icons/delete-icon', () => () => <svg data-testid="delete-icon" />);
jest.mock('../../../src/hooks/use-grid-config', () => ({
    useGridConfig: jest.fn(),
}));

describe('GridActionCell', () => {
    const baseRow = { id: 123, name: 'Row 1' };
    const defaultProps = {
        buttonColWidth: 120,
        isActionColumnLeft: false,
        isActionColumnRight: false,
        isMobile: false,
        baseRow
    };

    const renderCell = (props = {}) =>
        render(
            <table>
                <tbody>
                    <tr>
                        <GridActionCell {...defaultProps} {...props} />
                    </tr>
                </tbody>
            </table>
        );

    beforeEach(() => {
        jest.clearAllMocks();
        useGridConfig.mockReturnValue({
            state: {
                editButtonEnabled: false,
                deleteButtonEnabled: false,
                editButtonEvent: jest.fn(),
                deleteButtonEvent: jest.fn()
            }
        });
    });

    it('renders td with correct width styles', () => {
        renderCell({ buttonColWidth: 150 });

        const td = screen.getByRole('cell');
        expect(td).toHaveStyle({
            width: '150px',
            maxWidth: '150px',
            minWidth: '150px',
            backgroundColor: 'inherit',
            contain: 'layout paint',
        });
    });

    it('applies correct styles when isActionColumnLeft is true and not mobile', () => {
        renderCell({ isActionColumnLeft: true, buttonColWidth: 100, isMobile: false });

        const td = screen.getByRole('cell');
        expect(td).toHaveStyle({
            left: '0',
            position: 'sticky',
            zIndex: '6',
            boxShadow: '#e0e0e0 -0.6px 0 0 0 inset',
        });
    });

    it('applies correct styles when isActionColumnRight is true and not mobile', () => {
        renderCell({ isActionColumnRight: true, buttonColWidth: 100, isMobile: false });

        const td = screen.getByRole('cell');
        expect(td).toHaveStyle({
            right: '-0.5px',
            position: 'sticky',
            zIndex: '6',
            boxShadow: '#e0e0e0 0.6px 0 0 0 inset',
        });
    });

    it('does not apply sticky styles when isMobile is true', () => {
        renderCell({ isActionColumnLeft: true, isActionColumnRight: true, isMobile: true });

        const td = screen.getByRole('cell');
        expect(td).toHaveStyle({
            left: '',
            right: '',
            position: '',
            zIndex: '',
            boxShadow: '',
        });
    });

    it('renders edit button when editButtonEnabled is true', () => {
        useGridConfig.mockReturnValue({
            state: {
                editButtonEnabled: true,
                deleteButtonEnabled: false,
                editButtonEvent: jest.fn(),
                deleteButtonEvent: jest.fn()
            }
        });
        renderCell();

        expect(screen.getByTitle('Edit')).toBeInTheDocument();
        expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    });

    it('renders delete button when deleteButtonEnabled is true', () => {
        useGridConfig.mockReturnValue({
            state: {
                editButtonEnabled: false,
                deleteButtonEnabled: true,
                editButtonEvent: jest.fn(),
                deleteButtonEvent: jest.fn()
            }
        });
        renderCell();

        expect(screen.getByTitle('Delete')).toBeInTheDocument();
        expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
    });

    it('calls editButtonEvent on edit button click', () => {
        const editButtonEvent = jest.fn();
        useGridConfig.mockReturnValue({
            state: {
                editButtonEnabled: true,
                deleteButtonEnabled: false,
                editButtonEvent,
                deleteButtonEvent: jest.fn()
            }
        });
        renderCell();

        const editBtn = screen.getByTitle('Edit');
        fireEvent.click(editBtn);
        expect(editButtonEvent).toHaveBeenCalledTimes(1);
        expect(editButtonEvent).toHaveBeenCalledWith(expect.any(Object), baseRow);
    });

    it('calls deleteButtonEvent on delete button click', () => {
        const deleteButtonEvent = jest.fn();
        useGridConfig.mockReturnValue({
            state: {
                editButtonEnabled: false,
                deleteButtonEnabled: true,
                editButtonEvent: jest.fn(),
                deleteButtonEvent
            }
        });
        renderCell();

        const deleteBtn = screen.getByTitle('Delete');
        fireEvent.click(deleteBtn);
        expect(deleteButtonEvent).toHaveBeenCalledTimes(1);
        expect(deleteButtonEvent).toHaveBeenCalledWith(expect.any(Object), baseRow);
    });

    it('calls editButtonEvent on Enter and Space keydown on edit button', () => {
        const editButtonEvent = jest.fn();
        useGridConfig.mockReturnValue({
            state: {
                editButtonEnabled: true,
                deleteButtonEnabled: false,
                editButtonEvent,
                deleteButtonEvent: jest.fn()
            }
        });
        renderCell();

        const editBtn = screen.getByTitle('Edit');

        fireEvent.keyDown(editBtn, { key: 'Enter' });
        fireEvent.keyDown(editBtn, { key: ' ' });
        fireEvent.keyDown(editBtn, { key: 'Escape' });

        expect(editButtonEvent).toHaveBeenCalledTimes(2);
    });

    it('calls deleteButtonEvent on Enter and Space keydown on delete button', () => {
        const deleteButtonEvent = jest.fn();
        useGridConfig.mockReturnValue({
            state: {
                editButtonEnabled: false,
                deleteButtonEnabled: true,
                editButtonEvent: jest.fn(),
                deleteButtonEvent
            }
        });
        renderCell();

        const deleteBtn = screen.getByTitle('Delete');

        fireEvent.keyDown(deleteBtn, { key: 'Enter' });
        fireEvent.keyDown(deleteBtn, { key: ' ' });
        fireEvent.keyDown(deleteBtn, { key: 'Escape' });

        expect(deleteButtonEvent).toHaveBeenCalledTimes(2);
    });

    it('stops propagation when clicking on td', () => {
        renderCell();

        const td = screen.getByRole('cell');
        const clickEvent = new MouseEvent('click', { bubbles: true });
        const stopPropagation = jest.fn();
        Object.defineProperty(clickEvent, 'stopPropagation', {
            value: stopPropagation,
            writable: true,
        });

        td.dispatchEvent(clickEvent);

        expect(stopPropagation).toHaveBeenCalled();
    });
});
