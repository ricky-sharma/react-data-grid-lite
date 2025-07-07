export function useFieldNavigation({
    fieldIndex,
    editableColumns,
    rowIndex,
    baseRow,
    commitChanges,
    revertChanges,
    focusInput,
    isNavigatingRef,
    preventBlurRef,
    editContainerRef
}) {
    const handleBlur = () => {
        setTimeout(() => {
            const active = document.activeElement;
            const cellContainer = editContainerRef?.current;

            const isStillInsideCell =
                cellContainer?.contains(active) ||
                active?.closest('.dropdown-options') !== null;

            if (!isStillInsideCell) {
                const isExiting =
                    fieldIndex === editableColumns.length - 1 || fieldIndex === 0;
                commitChanges(rowIndex, editableColumns, baseRow, isExiting);
                if (isNavigatingRef)
                    isNavigatingRef.current = false;
                if (preventBlurRef)
                    preventBlurRef.current = false;
            }
        }, 0);
    };

    const handleKeyDown = (e) => {
        const { key, shiftKey } = e;

        if (key === 'Enter' || key === 'Tab') {
            e.preventDefault();
            if (isNavigatingRef)
                isNavigatingRef.current = true;

            const nextIndex = shiftKey ? fieldIndex - 1 : fieldIndex + 1;
            const isValid =
                nextIndex >= 0 && nextIndex < editableColumns.length;

            if (isValid) {
                setTimeout(() => {
                    focusInput(nextIndex);
                }, 0);
            }
            const isExiting =
                (!shiftKey && fieldIndex === editableColumns.length - 1) ||
                (shiftKey && fieldIndex === 0);

            commitChanges(rowIndex, editableColumns, baseRow, isExiting);
        } else if (key === 'Escape') {
            e.preventDefault();
            revertChanges(editableColumns);
        }
    };

    const handleClick = (e) => {
        e.preventDefault();
        if (isNavigatingRef)
            isNavigatingRef.current = true;
        focusInput(fieldIndex);
    };

    return { handleBlur, handleKeyDown, handleClick };
}
