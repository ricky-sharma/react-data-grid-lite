import { useCallback } from 'react';

export function useDropdownNavigation({
    open,
    setOpen,
    focusedIndex,
    setFocusedIndex,
    options,
    handleOptionClick,
    isControlled = false,
}) {
    const handleKeyDown = useCallback((e) => {
        const { key } = e;

        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            if (!open) {
                setOpen(true);
                setFocusedIndex(0);
            } else if (focusedIndex >= 0) {
                handleOptionClick(e, options[focusedIndex]);
            }
        } else if (key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            setFocusedIndex((prev) => (prev + 1) % options.length);
        } else if (key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
            setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
        } else if (key === 'Escape' || key === 'Tab') {
            if (isControlled) e.preventDefault();
            setOpen(false);
        }
    }, [open, focusedIndex, options, setOpen, setFocusedIndex, handleOptionClick, isControlled]);

    return handleKeyDown;
}