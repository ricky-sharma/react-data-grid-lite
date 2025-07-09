import { renderHook, act } from '@testing-library/react';
import { useFieldNavigation } from '../../../src/hooks/use-field-navigation';

jest.useFakeTimers();

describe('useFieldNavigation', () => {
    const baseParams = {
        fieldIndex: 1,
        editableColumns: ['col1', 'col2', 'col3'],
        rowIndex: 0,
        baseRow: {},
        commitChanges: jest.fn(),
        revertChanges: jest.fn(),
        focusInput: jest.fn(),
        isNavigatingRef: { current: false },
        preventBlurRef: { current: false },
        editContainerRef: { current: null },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        baseParams.isNavigatingRef = { current: false };
        baseParams.preventBlurRef = { current: false };
    });

    describe('handleBlur', () => {
        it('commits changes and resets flags if focus left cell', () => {
            const activeElement = document.createElement('div');
            document.body.appendChild(activeElement);
            baseParams.editContainerRef.current = document.createElement('div');
            document.body.appendChild(baseParams.editContainerRef.current);
            jest.spyOn(document, 'activeElement', 'get').mockReturnValue(activeElement);

            const { result } = renderHook(() => useFieldNavigation(baseParams));

            act(() => {
                result.current.handleBlur();
                jest.runAllTimers();
            });

            expect(baseParams.commitChanges).toHaveBeenCalledWith(
                baseParams.rowIndex,
                baseParams.editableColumns,
                baseParams.baseRow,
                false
            );
            expect(baseParams.isNavigatingRef.current).toBe(false);
            expect(baseParams.preventBlurRef.current).toBe(false);
        });

        it('handleBlur skips setting preventBlurRef.current and isNavigatingRef.current when they are falsy', () => {
            const activeElement = document.createElement('div');
            document.body.appendChild(activeElement);
            baseParams.editContainerRef.current = document.createElement('div');
            document.body.appendChild(baseParams.editContainerRef.current);
            jest.spyOn(document, 'activeElement', 'get').mockReturnValue(activeElement);
            baseParams.preventBlurRef = null;
            baseParams.isNavigatingRef = null;
            const { result } = renderHook(() => useFieldNavigation(baseParams));

            act(() => {
                result.current.handleBlur();
                jest.runAllTimers();
            });

            expect(baseParams.commitChanges).toHaveBeenCalledWith(
                baseParams.rowIndex,
                baseParams.editableColumns,
                baseParams.baseRow,
                false
            );
        });

        it('does NOT commit changes if focus still inside cell', () => {
            const cellDiv = document.createElement('div');
            const child = document.createElement('div');
            cellDiv.appendChild(child);
            baseParams.editContainerRef.current = cellDiv;

            jest.spyOn(document, 'activeElement', 'get').mockReturnValue(child);

            const { result } = renderHook(() => useFieldNavigation(baseParams));

            act(() => {
                result.current.handleBlur();
                jest.runAllTimers();
            });

            expect(baseParams.commitChanges).not.toHaveBeenCalled();
        });

        it('commits changes with isExiting true if at first or last field', () => {
            const paramsFirst = { ...baseParams, fieldIndex: 0 };
            const paramsLast = { ...baseParams, fieldIndex: baseParams.editableColumns.length - 1 };
            const activeElement = document.createElement('div');
            document.body.appendChild(activeElement);
            paramsFirst.editContainerRef.current = document.createElement('div');
            paramsLast.editContainerRef.current = document.createElement('div');
            jest.spyOn(document, 'activeElement', 'get').mockReturnValue(activeElement);

            let { result } = renderHook(() => useFieldNavigation(paramsFirst));
            act(() => {
                result.current.handleBlur();
                jest.runAllTimers();
            });
            expect(paramsFirst.commitChanges).toHaveBeenCalledWith(
                paramsFirst.rowIndex,
                paramsFirst.editableColumns,
                paramsFirst.baseRow,
                true
            );

            jest.clearAllMocks();
            result = renderHook(() => useFieldNavigation(paramsLast)).result;
            act(() => {
                result.current.handleBlur();
                jest.runAllTimers();
            });
            expect(paramsLast.commitChanges).toHaveBeenCalledWith(
                paramsLast.rowIndex,
                paramsLast.editableColumns,
                paramsLast.baseRow,
                true
            );
        });
    });

    describe('handleKeyDown', () => {
        it('handles Enter and Tab key - calls focusInput and commitChanges with isNavigatingRef', () => {
            const { result } = renderHook(() => useFieldNavigation(baseParams));

            const tabEvent = {
                key: 'Tab',
                shiftKey: false,
                preventDefault: jest.fn(),
            };

            act(() => {
                result.current.handleKeyDown(tabEvent);
                jest.runAllTimers();
            });

            expect(tabEvent.preventDefault).toHaveBeenCalled();
            expect(baseParams.isNavigatingRef.current).toBe(true);
            expect(baseParams.focusInput).toHaveBeenCalledWith(2);
            expect(baseParams.commitChanges).toHaveBeenCalledWith(
                baseParams.rowIndex,
                baseParams.editableColumns,
                baseParams.baseRow,
                false
            );
        });

        it('handles Enter key when activeElement is not interactive', () => {
            const { result } = renderHook(() => useFieldNavigation(baseParams));

            const enterEvent = {
                key: 'Enter',
                shiftKey: false,
                preventDefault: jest.fn(),
            };

            jest.spyOn(document, 'activeElement', 'get').mockReturnValue({
                tagName: 'DIV',
            });

            act(() => {
                result.current.handleKeyDown(enterEvent);
                jest.runAllTimers();
            });

            expect(enterEvent.preventDefault).toHaveBeenCalled();
            expect(baseParams.isNavigatingRef.current).toBe(true);
            expect(baseParams.focusInput).toHaveBeenCalled();
            expect(baseParams.commitChanges).toHaveBeenCalledWith(
                baseParams.rowIndex,
                baseParams.editableColumns,
                baseParams.baseRow,
                false
            );
        });

        it('handles Escape key to revert changes', () => {
            const { result } = renderHook(() => useFieldNavigation(baseParams));

            const escapeEvent = {
                key: 'Escape',
                preventDefault: jest.fn(),
            };

            act(() => {
                result.current.handleKeyDown(escapeEvent);
            });

            expect(escapeEvent.preventDefault).toHaveBeenCalled();
            expect(baseParams.revertChanges).toHaveBeenCalledWith(baseParams.editableColumns);
        });

        it('handleKeyDown does not throw or assign when isNavigatingRef is null', () => {
            const params = {
                fieldIndex: 0,
                editableColumns: ['a', 'b'],
                rowIndex: 0,
                baseRow: {},
                commitChanges: jest.fn(),
                revertChanges: jest.fn(),
                focusInput: jest.fn(),
                preventBlurRef: { current: false },
                isNavigatingRef: null,
                editContainerRef: { current: document.createElement('div') }
            };

            const { handleKeyDown } = useFieldNavigation(params);
            const event = {
                key: 'Tab',
                preventDefault: jest.fn(),
                shiftKey: false
            };

            expect(() => handleKeyDown(event)).not.toThrow();
            expect(params.commitChanges).toHaveBeenCalled();
        });

        it('handleKeyDown does NOT call focusInput if nextIndex is invalid (else path)', () => {
            const commitChanges = jest.fn();
            const focusInput = jest.fn();

            const params = {
                fieldIndex: 0,
                editableColumns: ['a', 'b'],
                rowIndex: 0,
                baseRow: {},
                commitChanges,
                revertChanges: jest.fn(),
                focusInput,
                isNavigatingRef: { current: false },
                preventBlurRef: { current: false },
                editContainerRef: { current: document.createElement('div') }
            };

            const { handleKeyDown } = useFieldNavigation(params);
            const event = {
                key: 'Tab',
                preventDefault: jest.fn(),
                shiftKey: true
            };

            handleKeyDown(event);
            expect(commitChanges).toHaveBeenCalled();
            expect(focusInput).not.toHaveBeenCalled();
        });

        it('handleKeyDown does nothing on random key press (else path of Escape)', () => {
            const commitChanges = jest.fn();
            const revertChanges = jest.fn();
            const focusInput = jest.fn();

            const params = {
                fieldIndex: 0,
                editableColumns: ['col1', 'col2'],
                rowIndex: 0,
                baseRow: {},
                commitChanges,
                revertChanges,
                focusInput,
                isNavigatingRef: { current: false },
                preventBlurRef: { current: false },
                editContainerRef: { current: document.createElement('div') }
            };

            const { handleKeyDown } = useFieldNavigation(params);

            const event = {
                key: 'a',
                preventDefault: jest.fn(),
                shiftKey: false
            };

            handleKeyDown(event);

            expect(event.preventDefault).not.toHaveBeenCalled();
            expect(revertChanges).not.toHaveBeenCalled();
            expect(commitChanges).not.toHaveBeenCalled();
            expect(focusInput).not.toHaveBeenCalled();
        });

        it('handleClick does not throw and skips isNavigatingRef when it is falsy', () => {
            const focusInput = jest.fn();
            const params = {
                fieldIndex: 0,
                editableColumns: ['col1'],
                rowIndex: 0,
                baseRow: {},
                commitChanges: jest.fn(),
                revertChanges: jest.fn(),
                focusInput,
                isNavigatingRef: null,
                preventBlurRef: null,
                editContainerRef: { current: document.createElement('div') }
            };

            const { handleClick } = useFieldNavigation(params);
            const event = { preventDefault: jest.fn() };
            handleClick(event);
            expect(event.preventDefault).toHaveBeenCalled();
            expect(focusInput).toHaveBeenCalledWith(0);
        });       
    });

    describe('handleClick', () => {
        it('prevents default, sets isNavigatingRef and calls focusInput', () => {
            const { result } = renderHook(() => useFieldNavigation(baseParams));

            const clickEvent = {
                preventDefault: jest.fn(),
            };

            act(() => {
                result.current.handleClick(clickEvent);
            });

            expect(clickEvent.preventDefault).toHaveBeenCalled();
            expect(baseParams.isNavigatingRef.current).toBe(true);
            expect(baseParams.focusInput).toHaveBeenCalledWith(baseParams.fieldIndex);
        });
    });
});
