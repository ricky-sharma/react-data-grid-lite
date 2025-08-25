import { renderHook, act } from '@testing-library/react';
import { useDropdownNavigation } from '../../../src/hooks/use-dropdown-navigation';

describe('useDropdownNavigation', () => {
    const setup = (params) => {
        const result = renderHook(() =>
            useDropdownNavigation(params)
        );
        return result.result.current;
    };

    let open = false;
    let focusedIndex = -1;
    let options = ['Option 1', 'Option 2', 'Option 3'];
    let selectedOption = null;
    let preventDefaultMock;

    const setOpen = jest.fn((val) => {
        open = typeof val === 'function' ? val(open) : val;
    });

    const setFocusedIndex = jest.fn((val) => {
        focusedIndex = typeof val === 'function' ? val(focusedIndex) : val;
    });

    const handleOptionClick = jest.fn((e, option) => {
        selectedOption = option;
    });

    beforeEach(() => {
        open = false;
        focusedIndex = -1;
        selectedOption = null;
        jest.clearAllMocks();
        preventDefaultMock = jest.fn();
    });

    const createKeyDownEvent = (key) => ({
        key,
        preventDefault: preventDefaultMock,
    });

    it('opens dropdown on Enter when closed', () => {
        const handler = setup({ open, setOpen, focusedIndex, setFocusedIndex, options, handleOptionClick });

        act(() => {
            handler(createKeyDownEvent('Enter'));
        });

        expect(preventDefaultMock).toHaveBeenCalled();
        expect(setOpen).toHaveBeenCalledWith(true);
        expect(setFocusedIndex).toHaveBeenCalledWith(0);
    });

    it('selects option on Enter when open and focused', () => {
        open = true;
        focusedIndex = 1;

        const handler = setup({ open, setOpen, focusedIndex, setFocusedIndex, options, handleOptionClick });

        act(() => {
            handler(createKeyDownEvent('Enter'));
        });

        expect(preventDefaultMock).toHaveBeenCalled();
        expect(handleOptionClick).toHaveBeenCalledWith(expect.anything(), options[1]);
    });

    it('moves focus down on ArrowDown', () => {
        focusedIndex = 1;
        const handler = setup({ open, setOpen, focusedIndex, setFocusedIndex, options, handleOptionClick });

        act(() => {
            handler(createKeyDownEvent('ArrowDown'));
        });

        expect(preventDefaultMock).toHaveBeenCalled();
        expect(setOpen).toHaveBeenCalledWith(true);
        const updaterFn = setFocusedIndex.mock.calls[0][0];
        expect(typeof updaterFn).toBe('function');

        const newIndex = updaterFn(1);
        expect(newIndex).toBe(2);
    });

    it('moves focus up on ArrowUp', () => {
        focusedIndex = 0;
        const handler = setup({ open, setOpen, focusedIndex, setFocusedIndex, options, handleOptionClick });

        act(() => {
            handler(createKeyDownEvent('ArrowUp'));
        });

        expect(preventDefaultMock).toHaveBeenCalled();
        expect(setOpen).toHaveBeenCalledWith(true);

        const updaterFn = setFocusedIndex.mock.calls[0][0];
        expect(typeof updaterFn).toBe('function');

        const newIndex = updaterFn(0);
        expect(newIndex).toBe(2);
    });

    it('closes dropdown on Escape', () => {
        open = true;
        const handler = setup({ open, setOpen, focusedIndex, setFocusedIndex, options, handleOptionClick });

        act(() => {
            handler(createKeyDownEvent('Escape'));
        });

        expect(setOpen).toHaveBeenCalledWith(false);
    });

    it('prevents default on Escape if controlled', () => {
        open = true;
        const handler = setup({ open, setOpen, focusedIndex, setFocusedIndex, options, handleOptionClick, isControlled: true });

        act(() => {
            handler(createKeyDownEvent('Escape'));
        });

        expect(preventDefaultMock).toHaveBeenCalled();
        expect(setOpen).toHaveBeenCalledWith(false);
    });

    it('closes dropdown on Tab', () => {
        open = true;
        const handler = setup({ open, setOpen, focusedIndex, setFocusedIndex, options, handleOptionClick });

        act(() => {
            handler(createKeyDownEvent('Tab'));
        });

        expect(setOpen).toHaveBeenCalledWith(false);
    });

    it('does nothing on Enter when open and focusedIndex is invalid', () => {
        open = true;
        focusedIndex = -1;

        const handler = setup({
            open,
            setOpen,
            focusedIndex,
            setFocusedIndex,
            options,
            handleOptionClick
        });

        act(() => {
            handler(createKeyDownEvent('Enter'));
        });

        expect(preventDefaultMock).toHaveBeenCalled();
        expect(setOpen).not.toHaveBeenCalled();
        expect(setFocusedIndex).not.toHaveBeenCalled();
        expect(handleOptionClick).not.toHaveBeenCalled();
    });

    it('does nothing for unrelated key (e.g., "a")', () => {
        open = true;
        focusedIndex = 1;

        const handler = setup({
            open,
            setOpen,
            focusedIndex,
            setFocusedIndex,
            options,
            handleOptionClick,
            isControlled: false
        });

        act(() => {
            handler(createKeyDownEvent('a'));
        });

        expect(preventDefaultMock).not.toHaveBeenCalled();
        expect(setOpen).not.toHaveBeenCalled();
        expect(setFocusedIndex).not.toHaveBeenCalled();
        expect(handleOptionClick).not.toHaveBeenCalled();
    });

});
