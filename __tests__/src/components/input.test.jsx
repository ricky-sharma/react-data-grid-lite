import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Input from './../../../src/components/custom-fields/input';

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
