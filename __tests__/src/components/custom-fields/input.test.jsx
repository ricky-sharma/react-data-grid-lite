import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Input from './../../../../src/components/custom-fields/input';

describe('Input component', () => {
    it('renders with provided props', () => {
        render(
            <Input
                type="text"
                dataType="name"
                placeholder="Enter name"
                className="input-class"
                value="John"
                onChange={() => { }}
            />
        );

        const input = screen.getByPlaceholderText('Enter name');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'text');
        expect(input).toHaveAttribute('data-type', 'name');
        expect(input).toHaveClass('input-class');
        expect(input.value).toBe('John');
    });

    it('uses blank placeholder if none provided', () => {
        render(<Input type="text" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('placeholder', '');
    });

    it('updates input value when typing (fully controlled)', () => {
        function ControlledInputWrapper() {
            const [val, setVal] = React.useState('');
            return <Input type="text" value={val} onChange={(e) => setVal(e.target.value)} />;
        }
        render(<ControlledInputWrapper />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'abc' } });
        expect(input.value).toBe('abc');
    });


    it('renders clear button when value exists', () => {
        render(<Input type="text" value="some text" onChange={() => { }} />);
        expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('does not render clear button when value is empty', () => {
        render(<Input type="text" value="" onChange={() => { }} />);
        expect(screen.queryByText('×')).not.toBeInTheDocument();
    });

    it('clears input when clear button is clicked', () => {
        const handleChange = jest.fn();
        render(<Input type="text" value="clear me" onChange={handleChange} />);

        const clearButton = screen.getByText('×');
        fireEvent.click(clearButton);

        expect(handleChange).toHaveBeenCalledWith({ target: { value: '' } });
    });

    it('applies default props if not provided', () => {
        render(<Input type="text" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('data-type', '');
        expect(input).not.toHaveClass();
        expect(input.value).toBe('');
    });
});

describe('Input component more tests', () => {
    it('renders input with default props', () => {
        render(<Input placeholder="Test input" />);
        const input = screen.getByPlaceholderText('Test input');
        expect(input).toBeInTheDocument();
    });

    it('calls onChange when typing', () => {
        const handleChange = jest.fn();
        render(<Input placeholder="Type here" onChange={handleChange} />);
        const input = screen.getByPlaceholderText('Type here');
        fireEvent.change(input, { target: { value: 'Hello' } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur', () => {
        const handleBlur = jest.fn();
        render(<Input placeholder="Blur me" onBlur={handleBlur} />);
        const input = screen.getByPlaceholderText('Blur me');
        fireEvent.blur(input);
        expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('calls onKeyDown', () => {
        const handleKeyDown = jest.fn();
        render(<Input placeholder="Press key" onKeyDown={handleKeyDown} />);
        const input = screen.getByPlaceholderText('Press key');
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('calls onClick', () => {
        const handleClick = jest.fn();
        render(<Input placeholder="Click me" onClick={handleClick} />);
        const input = screen.getByPlaceholderText('Click me');
        fireEvent.click(input);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('clears input when clear icon clicked', () => {
        const handleChange = jest.fn();
        render(<Input placeholder="Clear me" value="Test" onChange={handleChange} />);
        const clearBtn = screen.getByText('×');
        fireEvent.click(clearBtn);
        expect(handleChange).toHaveBeenCalledWith({ target: { value: '' } });
    });

    it('prevents blur when clicking clear icon', () => {
        const preventBlurRef = { current: false };
        render(
            <Input
                placeholder="With preventBlurRef"
                value="test"
                onChange={jest.fn()}
                preventBlurRef={preventBlurRef}
            />
        );
        const clearBtn = screen.getByText('×');
        fireEvent.mouseDown(clearBtn);
        expect(preventBlurRef.current).toBe(true);
    });

    it('supports custom className and data-type', () => {
        render(
            <Input
                placeholder="Custom"
                className="custom-class"
                dataType="number"
            />
        );
        const input = screen.getByPlaceholderText('Custom');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveAttribute('data-type', 'number');
    });

    it('does not crash when onChange is not provided', () => {
        const { getByPlaceholderText } = render(<Input placeholder="name" />);
        const input = getByPlaceholderText('name');

        expect(() => {
            fireEvent.change(input, { target: { value: 'Hello' } });
        }).not.toThrow();

        expect(() => {
            fireEvent.click(input);
            fireEvent.blur(input);
            fireEvent.keyDown(input);
            fireEvent.mouseDown(input);
        }).not.toThrow();
    });

    it('sets preventBlurRef.current to false after clicking clear button', () => {
        jest.useFakeTimers();
        const preventBlurRef = { current: false };
        const handleChange = jest.fn();

        const { getByText } = render(
            <Input
                value="something"
                onChange={handleChange}
                preventBlurRef={preventBlurRef}
            />
        );

        const clearButton = getByText('×');
        fireEvent.mouseDown(clearButton);
        fireEvent.click(clearButton);
        expect(preventBlurRef.current).toBe(true);
        jest.runAllTimers();
        expect(preventBlurRef.current).toBe(false);
        jest.useRealTimers();
    });

    it('does not throw error when preventBlurRef is undefined', () => {
        const handleChange = jest.fn();
        const { getByText } = render(
            <Input value="test" onChange={handleChange} />
        );
        const clearButton = getByText('×');
        expect(() => {
            fireEvent.mouseDown(clearButton);
            fireEvent.click(clearButton);
        }).not.toThrow();
        expect(handleChange).toHaveBeenCalledWith({
            target: { value: '' }
        });
    });
});