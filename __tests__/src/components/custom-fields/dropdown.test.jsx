import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import Dropdown from './../../../../src/components/custom-fields/dropdown';

describe('Dropdown component', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];

    it('renders with selected value', () => {
        render(<Dropdown options={options} value="Option 2" />);
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('▼')).toBeInTheDocument();
    });

    it('opens dropdown when clicked', () => {
        render(<Dropdown options={options} value="Option 1" />);
        fireEvent.click(screen.getByText('Option 1'));
        const optionsList = screen.getByRole('button').parentNode.querySelector('.dropdown-options');
        options.forEach(option => {
            expect(within(optionsList).getByText(option)).toBeInTheDocument();
        });

        expect(screen.getByText('▲')).toBeInTheDocument();
    });

    it('closes dropdown when an option is clicked and triggers onChange', () => {
        const handleChange = jest.fn();
        render(<Dropdown options={['Option 1', 'Option 2', 'Option 3']}
            value="Option 1" onChange={handleChange} />);

        const toggle = screen.getAllByText('Option 1')[0];
        fireEvent.click(toggle);

        const optionToSelect = screen.getByText('Option 3');
        fireEvent.click(optionToSelect);

        expect(handleChange).toHaveBeenCalledWith(expect.any(Object), 'Option 3', '');

        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });


    it('closes dropdown on outside click', () => {
        render(
            <div>
                <Dropdown options={options} value="Option 1" />
                <button data-testid="outside">Outside</button>
            </div>
        );

        fireEvent.click(screen.getByText('Option 1'));
        expect(screen.getByText('Option 2')).toBeInTheDocument();

        fireEvent.mouseDown(screen.getByTestId('outside'));
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    it('highlights selected option', () => {
        render(<Dropdown options={['Option 1', 'Option 2', 'Option 3']} value="Option 2" />);
        fireEvent.click(screen.getByText('Option 2'));
        const allMatches = screen.getAllByText('Option 2');
        const selectedOption = allMatches[1];
        expect(selectedOption).toHaveClass('dropdown-option', 'selected');
    });

    it('does not crash with no options', () => {
        render(<Dropdown options={[]} value="None" />);
        fireEvent.click(screen.getByText('Select'));
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('renders without crashing with default props', () => {
        render(<Dropdown />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Select')).toBeInTheDocument();
    });

    it('displays the selected option label when value matches', () => {
        const options = [{ label: 'Option A', value: 'a' }];
        render(<Dropdown options={options} value="a" />);
        expect(screen.getByText('Option A')).toBeInTheDocument();
    });

    it('opens dropdown when clicked', () => {
        const options = ['Option 1', 'Option 2'];
        render(<Dropdown options={options} />);

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByRole('listbox')).toBeInTheDocument();
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('calls onChange when an option is selected', () => {
        const handleChange = jest.fn();
        const options = ['One', 'Two'];

        render(<Dropdown options={options} value="One" onChange={handleChange} />);

        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Two'));

        expect(handleChange).toHaveBeenCalledWith(expect.anything(), 'Two', '');
    });

    it('closes the dropdown on Escape key', () => {
        const options = ['One', 'Two'];
        render(<Dropdown options={options} />);

        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('listbox')).toBeInTheDocument();

        fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('renders dropdown options in a portal when usePortal is true', async () => {
        const portalContainer = document.createElement('div');
        portalContainer.setAttribute('id', 'app-container');
        document.body.appendChild(portalContainer);

        const options = ['Alpha', 'Beta'];
        render(<Dropdown options={options} usePortal={true} />);

        fireEvent.click(screen.getByRole('button'));
        const listbox = await screen.findByRole('listbox');
        expect(listbox).toBeInTheDocument();
        expect(screen.getByText('Alpha')).toBeInTheDocument();
        expect(screen.getByText('Beta')).toBeInTheDocument();
    });

    it('respects controlled isOpen and setOpenExternally props', () => {
        const setOpenExternally = jest.fn();
        const { rerender } = render(
            <Dropdown
                options={['Controlled']}
                isOpen={false}
                setOpenExternally={setOpenExternally}
                fieldIndex={2}
            />
        );

        fireEvent.click(screen.getByRole('button'));
        expect(setOpenExternally).toHaveBeenCalledWith(2);
        rerender(
            <Dropdown
                options={['Controlled']}
                isOpen={true}
                setOpenExternally={setOpenExternally}
                fieldIndex={2}
            />
        );

        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('assigns triggerRef to dropDownRef.current when dropDownRef is an object', () => {
        const refObject = React.createRef();
        render(<Dropdown options={['A']} dropDownRef={refObject} />);
        fireEvent.click(screen.getByRole('button'));

        expect(refObject.current).not.toBeNull();
        expect(refObject.current).toHaveClass('dropdown-selected');
    });
});