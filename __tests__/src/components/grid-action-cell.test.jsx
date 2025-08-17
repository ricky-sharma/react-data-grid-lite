import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GridActionCell from '../../../src/components/grid-action-cell';

jest.mock('../../../src/icons/edit-icon', () => () => <svg data-testid="edit-icon" />);
jest.mock('../../../src/icons/delete-icon', () => () => <svg data-testid="delete-icon" />);

describe('GridActionCell', () => {
    const baseRow = { id: 123, name: 'Row 1' };
    const defaultProps = {
        buttonColWidth: 120,
        isActionColumnLeft: false,
        isActionColumnRight: false,
        isMobile: false,
        baseRow,
        editButtonEnabled: false,
        deleteButtonEnabled: false,
        editButtonEvent: jest.fn(),
        deleteButtonEvent: jest.fn(),
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
            boxShadow: '#e0e0e0 -0.5px 0 0 0 inset',
        });
    });

    it('applies correct styles when isActionColumnRight is true and not mobile', () => {
        renderCell({ isActionColumnRight: true, buttonColWidth: 100, isMobile: false });

        const td = screen.getByRole('cell');
        expect(td).toHaveStyle({
            right: '-0.1px',
            position: 'sticky',
            zIndex: '6',
            boxShadow: '#e0e0e0 0.5px 0 0 0 inset',
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
        renderCell({ editButtonEnabled: true });

        expect(screen.getByTitle('Edit')).toBeInTheDocument();
        expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    });

    it('renders delete button when deleteButtonEnabled is true', () => {
        renderCell({ deleteButtonEnabled: true });

        expect(screen.getByTitle('Delete')).toBeInTheDocument();
        expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
    });

    it('calls editButtonEvent on edit button click', () => {
        const editButtonEvent = jest.fn();
        renderCell({ editButtonEnabled: true, editButtonEvent });

        const editBtn = screen.getByTitle('Edit');
        fireEvent.click(editBtn);
        expect(editButtonEvent).toHaveBeenCalledTimes(1);
        expect(editButtonEvent).toHaveBeenCalledWith(expect.any(Object), baseRow);
    });

    it('calls deleteButtonEvent on delete button click', () => {
        const deleteButtonEvent = jest.fn();
        renderCell({ deleteButtonEnabled: true, deleteButtonEvent });

        const deleteBtn = screen.getByTitle('Delete');
        fireEvent.click(deleteBtn);
        expect(deleteButtonEvent).toHaveBeenCalledTimes(1);
        expect(deleteButtonEvent).toHaveBeenCalledWith(expect.any(Object), baseRow);
    });

    it('calls editButtonEvent on Enter and Space keydown on edit button', () => {
        const editButtonEvent = jest.fn();
        renderCell({ editButtonEnabled: true, editButtonEvent });

        const editBtn = screen.getByTitle('Edit');

        fireEvent.keyDown(editBtn, { key: 'Enter' });
        fireEvent.keyDown(editBtn, { key: ' ' });
        fireEvent.keyDown(editBtn, { key: 'Escape' });

        expect(editButtonEvent).toHaveBeenCalledTimes(2);
    });

    it('calls deleteButtonEvent on Enter and Space keydown on delete button', () => {
        const deleteButtonEvent = jest.fn();
        renderCell({ deleteButtonEnabled: true, deleteButtonEvent });

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
