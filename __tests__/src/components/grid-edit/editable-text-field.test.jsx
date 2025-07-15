import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import EditableTextField from '../../../../src/components/grid-edit/editable-text-field';

describe('EditableTextField', () => {
    const baseProps = {
        colName: 'name',
        value: 'Alice',
        onChange: jest.fn(),
        autoFocus: false,
        inputRef: React.createRef(),
        rowIndex: 0,
        editableColumns: [{ colName: 'name', type: 'text' }],
        baseRow: { name: 'Alice' },
        focusInput: jest.fn(),
        commitChanges: jest.fn(),
        revertChanges: jest.fn(),
        preventBlurRef: { current: false },
        isNavigatingRef: { current: false },
        fieldIndex: 1,
        editContainerRef: React.createRef(),
        type: 'text',
        onClick: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders input with correct value and placeholder', () => {
        render(<EditableTextField {...baseProps} />);
        const input = screen.getByPlaceholderText('name');
        expect(input).toBeInTheDocument();
        expect(input.value).toBe('Alice');
    });

    it('calls onChange when value changes', () => {
        render(<EditableTextField {...baseProps} />);
        const input = screen.getByPlaceholderText('name');
        fireEvent.change(input, { target: { value: 'Bob' } });
        expect(baseProps.onChange).toHaveBeenCalledWith(expect.anything(), 'Bob', 'name');
    });

    it('calls handleClick and onClick on input click', () => {
        render(<EditableTextField {...baseProps} />);
        const input = screen.getByPlaceholderText('name');
        fireEvent.click(input);
        expect(baseProps.onClick).toHaveBeenCalled();
    });

    it('calls stopPropagation on mouseDown', () => {
        render(<EditableTextField {...baseProps} />);
        const input = screen.getByPlaceholderText('name');
        const event = createEvent.mouseDown(input);
        event.stopPropagation = jest.fn();
        fireEvent(input, event);
        expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('calls handleBlur on blur', () => {
        render(<EditableTextField {...baseProps} />);
        const input = screen.getByPlaceholderText('name');
        fireEvent.blur(input);
        expect(baseProps.commitChanges).not.toHaveBeenCalled();
    });

    it('handles keyDown event', () => {
        const focusInput = jest.fn();
        const commitChanges = jest.fn();
        const props = {
            ...baseProps,
            focusInput,
            commitChanges,
            editableColumns: [{ colName: 'name' }, { colName: 'age' }],
            fieldIndex: 0,
        };

        render(<EditableTextField {...props} />);
        const input = screen.getByPlaceholderText('name');
        fireEvent.keyDown(input, { key: 'Tab' });
        expect(props.isNavigatingRef.current).toBe(true);
    });
});

describe('EditableTextField integration', () => {
    const focusInput = jest.fn();
    const commitChanges = jest.fn();
    const revertChanges = jest.fn();
    const onChange = jest.fn();
    const isNavigatingRef = React.createRef();

    const baseProps = {
        colName: 'name',
        value: 'Alice',
        onChange,
        autoFocus: false,
        inputRef: null,
        rowIndex: 0,
        editableColumns: ['name', 'age', 'email'],
        baseRow: {},
        focusInput,
        commitChanges,
        revertChanges,
        preventBlurRef: null,
        isNavigatingRef,
        fieldIndex: 1,
        editContainerRef: null,
        type: 'text',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls commitChanges with exiting true if on last field and Tab pressed', () => {
        const lastIndexProps = { ...baseProps, fieldIndex: baseProps.editableColumns.length - 1 };

        render(<EditableTextField {...lastIndexProps} />);
        const input = screen.getByPlaceholderText('name');
        fireEvent.keyDown(input, { key: 'Tab', shiftKey: false });
        expect(isNavigatingRef.current).toBe(true);
        expect(focusInput).not.toHaveBeenCalled();
        expect(commitChanges).toHaveBeenCalledWith(
            lastIndexProps.editableColumns,
            lastIndexProps.baseRow,
            true
        );
    });
});
