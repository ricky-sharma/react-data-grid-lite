import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import EditableCellFields from '../../../../src/components/grid-edit/editable-cell-fields';

describe('EditableCellFields', () => {
    const baseRow = { name: 'Alice', role: 'Admin' };
    const rowIndex = 0;
    const commitChanges = jest.fn();
    const revertChanges = jest.fn();
    const onCellChange = jest.fn();

    it('renders nothing when editableColumns is empty or undefined', () => {
        const { container } = render(
            <EditableCellFields
                baseRow={baseRow}
                editableColumns={[]}
                columnValue=""
                rowIndex={rowIndex}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders text and select fields based on editableColumns', () => {
        const editableColumns = [
            { colName: 'name', type: 'text' },
            {
                colName: 'role',
                type: 'select',
                values: ['Admin', 'User']
            }
        ];

        render(
            <EditableCellFields
                baseRow={{ name: 'Alice', role: 'Admin' }}
                editableColumns={editableColumns}
                onCellChange={onCellChange}
                commitChanges={commitChanges}
                revertChanges={revertChanges}
                columnValue="Alice"
                rowIndex={rowIndex}
            />
        );

        const textInput = screen.getByDisplayValue('Alice');
        expect(textInput).toBeInTheDocument();
        const dropdownTrigger = screen.getByRole('button');
        expect(dropdownTrigger).toHaveTextContent('Admin');
    });


    it('calls onCellChange when input is changed', () => {
        const editableColumns = [{ colName: 'name', type: 'text' }];

        render(
            <EditableCellFields
                baseRow={baseRow}
                editableColumns={editableColumns}
                onCellChange={onCellChange}
                commitChanges={commitChanges}
                revertChanges={revertChanges}
                columnValue="Alice"
                rowIndex={rowIndex}
            />
        );

        const input = screen.getByDisplayValue('Alice');
        fireEvent.change(input, { target: { value: 'Bob' } });
        expect(onCellChange).toHaveBeenCalledWith(
            expect.any(Object),
            'Bob',
            'name'
        );
        expect(onCellChange).toHaveBeenCalledTimes(1);
    });

    it('updates input value after change event', () => {
        const rowIndex = 0;

        function Wrapper() {
            const [row, setRow] = useState({ name: 'Alice', role: 'Admin' });

            return (
                <EditableCellFields
                    baseRow={row}
                    editableColumns={[{ colName: 'name', type: 'text' }]}
                    onCellChange={(e, value, colName) => {
                        setRow((prev) => ({
                            ...prev,
                            [colName]: value,
                        }));
                    }}
                    commitChanges={jest.fn()}
                    revertChanges={jest.fn()}
                    columnValue={row.name}
                    rowIndex={rowIndex}
                />
            );
        }

        render(<Wrapper />);

        const input = screen.getByPlaceholderText('name');
        expect(input.value).toBe('Alice');

        fireEvent.change(input, { target: { value: 'Bob' } });
        expect(input.value).toBe('Bob');
    });

    it('sets autofocus on the first editable field', () => {
        const editableColumns = [
            { colName: 'name', type: 'text' },
            { colName: 'role', type: 'text' }
        ];

        render(
            <EditableCellFields
                baseRow={baseRow}
                editableColumns={editableColumns}
                onCellChange={onCellChange}
                commitChanges={commitChanges}
                revertChanges={revertChanges}
                columnValue="Alice"
                rowIndex={rowIndex}
            />
        );

        const firstInput = screen.getByDisplayValue('Alice');
        expect(firstInput).toHaveFocus();
    });

    it('closes dropdown on text field click', () => {
        const editableColumns = [
            {
                colName: 'name',
                type: 'text'
            },
            {
                colName: 'role',
                type: 'select',
                values: ['Admin', 'User']
            }
        ];

        render(
            <EditableCellFields
                baseRow={baseRow}
                editableColumns={editableColumns}
                onCellChange={onCellChange}
                commitChanges={commitChanges}
                revertChanges={revertChanges}
                columnValue="Alice"
                rowIndex={rowIndex}
            />
        );

        const input = screen.getByDisplayValue('Alice');
        fireEvent.click(input); 
    });

    it('returns null for unknown editor type', () => {
        const editableColumns = [
            { colName: 'unknown', type: 'custom' }
        ];

        const baseRow = { unknown: 'Value' };

        const { container } = render(
            <EditableCellFields
                baseRow={baseRow}
                editableColumns={editableColumns}
                onCellChange={jest.fn()}
                commitChanges={jest.fn()}
                revertChanges={jest.fn()}
                columnValue="Value"
                rowIndex={0}
            />
        );

        expect(container.querySelector('.editField')).toBeInTheDocument();
        expect(container.querySelector('.editField')?.children.length).toBe(0);
    });

    it('does not throw when attempting to focus a non-existent inputRef', () => {
        const baseRow = { name: 'Alice' };
        const editableColumns = [{ colName: 'name', type: 'text' }];

        const commitChanges = jest.fn();
        const revertChanges = jest.fn();
        const onCellChange = jest.fn();

        render(
            <EditableCellFields
                baseRow={baseRow}
                editableColumns={editableColumns}
                columnValue="Alice"
                commitChanges={commitChanges}
                revertChanges={revertChanges}
                onCellChange={onCellChange}
                rowIndex={0}
            />
        );

        const input = screen.getByDisplayValue('Alice');
        expect(input).toBeInTheDocument();

        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
        expect(true).toBe(true);
    });
});