import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import Dropdown from './../../../../src/components/custom-fields/dropdown';

describe('Dropdown component', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });

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

        fireEvent.click(screen.getByTestId('outside'));
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
        render(<Dropdown options={[]} value='None' />);
        fireEvent.click(screen.getByText('None'));
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

    it('calls preventDefault, stopPropagation and sets preventBlurRef.current on option mousedown', async () => {
        jest.useFakeTimers();
        const preventBlurRef = { current: false };

        render(<Dropdown options={['One', 'Two']} value="One" preventBlurRef={preventBlurRef} />);
        fireEvent.click(screen.getByRole('button'));
        const option = screen.getByText('Two');

        const mousedownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
        });

        mousedownEvent.preventDefault = jest.fn();
        mousedownEvent.stopPropagation = jest.fn();

        option.dispatchEvent(mousedownEvent);

        expect(mousedownEvent.preventDefault).toHaveBeenCalled();
        expect(mousedownEvent.stopPropagation).toHaveBeenCalled();
        expect(preventBlurRef.current).toBe(true);

        await act(async () => {
            jest.runAllTimers();
        });

        expect(preventBlurRef.current).toBe(false);
        jest.useRealTimers();
    });

    it('does not throw or access preventBlurRef when it is undefined', () => {
        render(<Dropdown options={['One', 'Two']} value="One" />);
        fireEvent.click(screen.getByRole('button'));
        const option = screen.getByText('Two');
        const mousedownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
        });
        mousedownEvent.preventDefault = jest.fn();
        mousedownEvent.stopPropagation = jest.fn();
        option.dispatchEvent(mousedownEvent);
        expect(mousedownEvent.preventDefault).toHaveBeenCalled();
        expect(mousedownEvent.stopPropagation).toHaveBeenCalled();
    });

    it('calls dropDownRef as a function with triggerRef', () => {
        const dropDownRefFn = jest.fn();

        render(<Dropdown options={['A']} dropDownRef={dropDownRefFn} />);

        fireEvent.click(screen.getByRole('button'));

        expect(dropDownRefFn).toHaveBeenCalled();
        const refArg = dropDownRefFn.mock.calls[0][0];
        expect(refArg).toHaveClass('dropdown-selected');
    });

    it('assigns triggerRef to dropDownRef.current when dropDownRef is an object', () => {
        const refObject = React.createRef();

        render(<Dropdown options={['A']} dropDownRef={refObject} />);

        fireEvent.click(screen.getByRole('button'));

        expect(refObject.current).not.toBeNull();
        expect(refObject.current).toHaveClass('dropdown-selected');
    });

    it('calls focusInput with fieldIndex when autoFocus is true', () => {
        const focusInput = jest.fn();
        const fieldIndex = 1;

        const dropDownRef = jest.fn();

        render(
            <Dropdown
                options={['A']}
                autoFocus={true}
                fieldIndex={fieldIndex}
                focusInput={focusInput}
                dropDownRef={dropDownRef}
            />
        );

        expect(focusInput).toHaveBeenCalledWith(fieldIndex);
    });

    it('does nothing when dropDownRef is neither a function nor a ref object', () => {
        const invalidDropDownRef = {};
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <Dropdown
                options={['A']}
                dropDownRef={invalidDropDownRef}
            />
        );

        fireEvent.click(screen.getByRole('button'));
        expect(invalidDropDownRef.current).toBeUndefined();
        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('closes the dropdown when clicking outside (wrapperRef logic)', async () => {
        render(
            <div>
                <Dropdown options={['Option 1', 'Option 2']} value="Option 1" />
                <div data-testid="outside-area">Outside</div>
            </div>
        );
        fireEvent.click(screen.getByText('Option 1'));
        await waitFor(() => { expect(screen.getByRole('listbox')).toBeInTheDocument(); });
        fireEvent.click(screen.getByTestId('outside-area'));
        await waitFor(() => { expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); });
    });

    it('closes dropdown when scrolling outside wrapperRef', async () => {
        render(<Dropdown options={['Option 1', 'Option 2']} value="Option 1" />);
        fireEvent.click(screen.getByText('Option 1'));

        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });
        const wrapper = screen.getByRole('listbox').parentElement;
        const outside = document.createElement('div');
        document.body.appendChild(outside);
        fireEvent.scroll(outside);
        await waitFor(() => {
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        });
        document.body.removeChild(outside);
    });

    it('does not close dropdown when scrolling inside wrapperRef', async () => {
        render(<Dropdown options={['Option 1', 'Option 2']} value="Option 1" />);
        fireEvent.click(screen.getByText('Option 1'));

        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });
        const wrapper = screen.getByRole('listbox').parentElement;
        fireEvent.scroll(wrapper);
        await waitFor(() => { expect(screen.getByRole('listbox')).toBeInTheDocument(); });
    });

    it('calls scrollIntoView on the correct option ref when dropdown opens', async () => {
        const scrollMock = jest.fn();
        HTMLElement.prototype.scrollIntoView = scrollMock;
        jest.useFakeTimers();

        const options = [
            { label: 'Option 1', value: 'Option 1' },
            { label: 'Option 2', value: 'Option 2' },
            { label: 'Option 3', value: 'Option 3' }
        ];
        const value = 'Option 2';

        render(<Dropdown options={options} value={value} />);
        fireEvent.click(screen.getByRole('button'));
        act(() => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument();
            expect(scrollMock).toHaveBeenCalledWith({
                block: 'nearest',
                behavior: 'smooth',
            });
        });
        jest.useRealTimers();
    });

    it('calls both onKeyDown prop and hook handleKeyDown logic', () => {
        const mockOnKeyDown = jest.fn();

        render(<Dropdown onKeyDown={mockOnKeyDown} options={['One', 'Two']} value="One" />);

        const button = screen.getByRole('button');
        fireEvent.keyDown(button, { key: 'Enter' });
        expect(mockOnKeyDown).toHaveBeenCalled();
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('sets and uses focusBeforeOpenRef correctly', () => {
        const focusMock = jest.fn();
        HTMLElement.prototype.focus = focusMock;

        const { container, rerender } = render(
            <Dropdown options={['One', 'Two']} value="One" />
        );

        const trigger = container.querySelector('.dropdown-selected');
        const focusEvent = new FocusEvent('focusin', { bubbles: true });
        trigger.dispatchEvent(focusEvent);
        fireEvent.click(trigger);
        fireEvent.click(document.body);
        expect(focusMock).toHaveBeenCalled();
    });

    it('closes dropdown on window resize', async () => {
        let resizeListenerAdded = false;

        const originalAddEventListener = window.addEventListener;
        jest.spyOn(window, 'addEventListener').mockImplementation((event, handler, options) => {
            if (event === 'resize') resizeListenerAdded = true;
            originalAddEventListener.call(window, event, handler, options);
        });

        render(<Dropdown options={['One', 'Two']} value="One" />);
        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => expect(resizeListenerAdded).toBe(true));
        fireEvent(window, new Event('resize'));
        await waitFor(() => {
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        });

        window.addEventListener.mockRestore();
    });

    it('adds and removes resize event listener that closes dropdown', () => {
        const setOpenExternallyMock = jest.fn();
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
        const { unmount, getByRole } = render(
            <Dropdown
                options={['One', 'Two']}
                value="One"
                setOpenExternally={setOpenExternallyMock}
                isOpen={true}
                onChange={() => { }}
                fieldIndex={0}
            />
        );

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            'resize',
            expect.any(Function)
        );
        fireEvent(window, new Event('resize'));
        expect(setOpenExternallyMock).toHaveBeenCalledWith(null);
        unmount();
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'resize',
            expect.any(Function)
        );
    });

    it('does not call onChange if optionValue === value', () => {
        const onChangeMock = jest.fn();
        const options = ['One', 'Two', 'Three'];
        const value = 'Two';

        render(<Dropdown options={options} value={value} onChange={onChangeMock} />);
        const toggle = screen.getByRole('button');
        fireEvent.click(toggle);
        const option = screen.getAllByText('Two').find(el => el.getAttribute('role') === 'option');
        fireEvent.click(option);
        expect(onChangeMock).not.toHaveBeenCalled();
    });
});