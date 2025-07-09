import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import EditableDropdownField from '../../../../src/components/grid-edit/editable-dropdown-field';

describe('EditableDropdownField', () => {
    const baseProps = {
        colName: 'role',
        value: 'User',
        onChange: jest.fn(),
        autoFocus: true,
        inputRef: React.createRef(),
        rowIndex: 0,
        editableColumns: [
            { colName: 'name', type: 'text' },
            { colName: 'role', type: 'select', values: ['Admin', 'User', 'Guest'] }
        ],
        baseRow: { name: 'Alice', role: 'User' },
        focusInput: jest.fn(),
        commitChanges: jest.fn(),
        revertChanges: jest.fn(),
        preventBlurRef: { current: false },
        isNavigatingRef: { current: false },
        fieldIndex: 1,
        editContainerRef: React.createRef(),
        values: ['Admin', 'User', 'Guest'],
        openDropdownIndex: 1,
        setOpenDropdownIndex: jest.fn()
    };

    it('renders dropdown with correct value', () => {
        render(<EditableDropdownField {...baseProps} />);
        expect(screen.getByRole('button')).toHaveTextContent('User');
    });

    it('calls setOpenDropdownIndex when clicked', () => {
        render(<EditableDropdownField {...baseProps} openDropdownIndex={null} />);
        const dropdownButton = screen.getByRole('button');
        fireEvent.click(dropdownButton);
        expect(baseProps.setOpenDropdownIndex).toHaveBeenCalledWith(1);
    });

    it('navigates with Tab and commits changes', () => {
        const props = {
            ...baseProps,
            fieldIndex: 1,
            editableColumns: [
                { colName: 'name' },
                { colName: 'role' },
                { colName: 'status' },
            ],
        };

        render(<EditableDropdownField {...props} />);
        const dropdownButton = screen.getByRole('button');
        fireEvent.keyDown(dropdownButton, { key: 'Tab' });

        expect(props.focusInput).toHaveBeenCalledWith(2);
        expect(props.commitChanges).toHaveBeenCalledWith(
            props.rowIndex,
            props.editableColumns,
            props.baseRow,
            false
        );
    });

    it('navigates backward with Shift+Tab and commits changes', () => {
        render(<EditableDropdownField {...baseProps} fieldIndex={1} />);
        const dropdownButton = screen.getByRole('button');
        fireEvent.keyDown(dropdownButton, { key: 'Tab', shiftKey: true });
        expect(baseProps.focusInput).toHaveBeenCalledWith(0);
        expect(baseProps.commitChanges).toHaveBeenCalledWith(
            baseProps.rowIndex,
            baseProps.editableColumns,
            baseProps.baseRow,
            false
        );
    });

    it('selects option on Enter key', () => {
        render(<EditableDropdownField {...baseProps} />);
        const dropdownButton = screen.getByRole('button');
        fireEvent.click(dropdownButton);
        const option = screen.getByText('Admin');
        fireEvent.click(option);
        expect(baseProps.onChange).toHaveBeenCalledWith(expect.anything(), 'Admin', 'role');
    });
});

describe('EditableDropdownField more tests', () => {
    const baseProps = {
        colName: 'role',
        value: 'Admin',
        onChange: jest.fn(),
        autoFocus: false,
        inputRef: React.createRef(),
        rowIndex: 0,
        editableColumns: [{ colName: 'name' }, { colName: 'role' }],
        baseRow: { name: 'Alice', role: 'Admin' },
        focusInput: jest.fn(),
        commitChanges: jest.fn(),
        revertChanges: jest.fn(),
        preventBlurRef: { current: false },
        isNavigatingRef: { current: false },
        fieldIndex: 1,
        editContainerRef: React.createRef(),
        values: ['Admin', 'User'],
        openDropdownIndex: 1,
        setOpenDropdownIndex: jest.fn(),
    };

    it('calls stopPropagation on mouse down', () => {
        render(<EditableDropdownField {...baseProps} />);
        const dropdownButton = screen.getByRole('button');
        const stopPropagationSpy = jest.spyOn(Event.prototype, 'stopPropagation');
        fireEvent.mouseDown(dropdownButton);
        expect(stopPropagationSpy).toHaveBeenCalled();
        stopPropagationSpy.mockRestore();
    });
});

describe('EditableDropdownField random key handling', () => {
    const baseProps = {
        colName: 'role',
        value: 'Admin',
        onChange: jest.fn(),
        autoFocus: false,
        inputRef: React.createRef(),
        rowIndex: 0,
        editableColumns: [{ colName: 'name' }, { colName: 'role' }],
        baseRow: { name: 'Alice', role: 'Admin' },
        focusInput: jest.fn(),
        commitChanges: jest.fn(),
        revertChanges: jest.fn(),
        preventBlurRef: { current: false },
        isNavigatingRef: { current: false },
        fieldIndex: 1,
        editContainerRef: React.createRef(),
        values: ['Admin', 'User'],
        openDropdownIndex: 1,
        setOpenDropdownIndex: jest.fn(),
    };

    it('does not crash when random key is pressed', () => {
        render(<EditableDropdownField {...baseProps} />);
        const dropdownButton = screen.getByRole('button');
        expect(() => {
            fireEvent.keyDown(dropdownButton, { key: 'x' });
        }).not.toThrow();
        expect(baseProps.focusInput).not.toHaveBeenCalled();
        expect(baseProps.commitChanges).not.toHaveBeenCalled();
    });
});

describe('EditableDropdownField key handling', () => {
    const baseProps = {
        colName: 'role',
        value: 'Admin',
        onChange: jest.fn(),
        autoFocus: false,
        inputRef: React.createRef(),
        rowIndex: 0,
        editableColumns: [
            { colName: 'name' },
            { colName: 'role', values: ['Admin', 'User'] }
        ],
        baseRow: { name: 'Alice', role: 'Admin' },
        focusInput: jest.fn(),
        commitChanges: jest.fn(),
        revertChanges: jest.fn(),
        preventBlurRef: { current: false },
        isNavigatingRef: { current: false },
        fieldIndex: 1,
        editContainerRef: React.createRef(),
        values: ['Admin', 'User'],
        openDropdownIndex: 1,
        setOpenDropdownIndex: jest.fn(),
    };

    it('opens dropdown and allows Enter key selection', () => {
        render(<EditableDropdownField {...baseProps} openDropdownIndex={null} />);
        const dropdownButton = screen.getByRole('button');
        fireEvent.keyDown(dropdownButton, { key: 'Enter' });
        expect(baseProps.setOpenDropdownIndex).toHaveBeenCalledWith(1);
    });
});

describe('EditableDropdownField - else path for isNavigatingRef', () => {
    it('does not fail when isNavigatingRef is undefined', () => {
        const mockProps = {
            colName: 'role',
            value: 'Admin',
            onChange: jest.fn(),
            autoFocus: false,
            inputRef: React.createRef(),
            rowIndex: 0,
            editableColumns: [
                { colName: 'name' },
                { colName: 'role' },
                { colName: 'status' }
            ],
            baseRow: { name: 'Alice', role: 'Admin' },
            focusInput: jest.fn(),
            commitChanges: jest.fn(),
            revertChanges: jest.fn(),
            fieldIndex: 1,
            editContainerRef: React.createRef(),
            values: ['Admin', 'User'],
            openDropdownIndex: 1,
            setOpenDropdownIndex: jest.fn()
        };

        render(<EditableDropdownField {...mockProps} />);
        const dropdownButton = screen.getByRole('button');
        fireEvent.keyDown(dropdownButton, { key: 'Tab' });
        expect(mockProps.focusInput).toHaveBeenCalledWith(2);
        expect(mockProps.commitChanges).toHaveBeenCalled();
    });
});

describe('EditableDropdownField - else path for isValid check', () => {
    it('does not call focusInput when nextIndex is out of bounds', () => {
        const focusInput = jest.fn();
        const commitChanges = jest.fn();

        const props = {
            colName: 'role',
            value: 'Admin',
            onChange: jest.fn(),
            autoFocus: false,
            inputRef: React.createRef(),
            rowIndex: 0,
            editableColumns: [{ colName: 'role' }],
            baseRow: { role: 'Admin' },
            focusInput,
            commitChanges,
            revertChanges: jest.fn(),
            isNavigatingRef: { current: false },
            fieldIndex: 0,
            editContainerRef: React.createRef(),
            values: ['Admin', 'User'],
            openDropdownIndex: 0,
            setOpenDropdownIndex: jest.fn(),
        };

        render(<EditableDropdownField {...props} />);
        const dropdownButton = screen.getByRole('button');
        fireEvent.keyDown(dropdownButton, { key: 'Tab' });
        expect(focusInput).not.toHaveBeenCalled();
        expect(commitChanges).toHaveBeenCalled();
    });
});