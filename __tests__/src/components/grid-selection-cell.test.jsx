import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GridSelectionCell from '../../../src/components/grid-selection-cell';
import { useGridConfig } from '../../../src/hooks/use-grid-config';

jest.mock('../../../src/hooks/use-grid-config', () => ({
    useGridConfig: jest.fn(),
}));

describe('GridSelectionCell', () => {
    const baseRow = { __$index__: 1 };
    const mockSetState = jest.fn();
    const onRowSelect = jest.fn();

    const defaultProps = {
        selectionColWidth: 50,
        isSelectionColumnLeft: true,
        isSelectionColumnRight: false,
        isActionColumnLeft: true,
        isActionColumnRight: false,
        isMobile: false,
        buttonColWidth: 100,
        baseRow,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useGridConfig.mockReturnValue({
            state: {
                onRowSelect,
                selectedRows: new Set([1]),
            },
            setState: mockSetState,
        });
    });

    it('renders checkbox checked when row is selected', () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <GridSelectionCell {...defaultProps} />
                    </tr>
                </tbody>
            </table>
        );
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeChecked();
    });

    it('toggles checkbox off and calls callbacks', () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <GridSelectionCell {...defaultProps} />
                    </tr>
                </tbody>
            </table>
        );
        const checkbox = screen.getByRole('checkbox');

        fireEvent.click(checkbox);

        expect(mockSetState).toHaveBeenCalledTimes(1);
        expect(onRowSelect).toHaveBeenCalledWith(expect.any(Object), baseRow, false);
    });

    it('toggles checkbox on and calls callbacks', () => {
        useGridConfig.mockReturnValue({
            state: {
                onRowSelect,
                selectedRows: new Set([]),
            },
            setState: mockSetState,
        });

        render(
            <table>
                <tbody>
                    <tr>
                        <GridSelectionCell {...defaultProps} />
                    </tr>
                </tbody>
            </table>
        );
        const checkbox = screen.getByRole('checkbox');

        fireEvent.click(checkbox);

        expect(mockSetState).toHaveBeenCalledTimes(1);
        expect(onRowSelect).toHaveBeenCalledWith(expect.any(Object), baseRow, true);
    });

    it('applies correct sticky styles', () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <GridSelectionCell {...defaultProps} />
                    </tr>
                </tbody>
            </table>
        );
        const td = screen.getByRole('cell', { name: /select row/i });

        expect(td).toHaveStyle({
            position: 'sticky',
            left: '100px',
            zIndex: '6',
            boxShadow: '#e0e0e0 -0.5px 0 0 0 inset',
        });
    });

    it('does not apply sticky styles on mobile', () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <GridSelectionCell {...defaultProps} isMobile={true} />
                    </tr>
                </tbody>
            </table>
        );
        const td = screen.getByRole('cell', { name: /select row/i });

        expect(td).toHaveStyle({
            position: '',
            left: '',
            right: '',
        });
    });

    it('stops event propagation on td click', () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <GridSelectionCell {...defaultProps} isMobile={true} />
                    </tr>
                </tbody>
            </table>
        );
        const td = screen.getByRole('cell', { name: /select row/i });

        const clickEvent = new MouseEvent('click', { bubbles: true });
        const stopPropagation = jest.fn();
        Object.defineProperty(clickEvent, 'stopPropagation', {
            value: stopPropagation,
            writable: true,
        });

        td.dispatchEvent(clickEvent);

        expect(stopPropagation).toHaveBeenCalled();
    });

    it('adds row index to selectedRows when checkbox is checked', () => {
        const mockSetState = jest.fn();
        const baseRow = { __$index__: 5 };
        const defaultProps = {
            selectionColWidth: 50,
            isSelectionColumnLeft: true,
            isSelectionColumnRight: false,
            isActionColumnLeft: true,
            isActionColumnRight: false,
            isMobile: false,
            buttonColWidth: 100,
            baseRow,
        };

        useGridConfig.mockReturnValue({
            state: {
                onRowSelect: jest.fn(),
                selectedRows: new Set(),
            },
            setState: mockSetState,
        });

        render(
            <table>
                <tbody>
                    <tr>
                        <GridSelectionCell {...defaultProps} />
                    </tr>
                </tbody>
            </table>
        );

        const checkbox = screen.getByRole('checkbox');

        fireEvent.click(checkbox);

        expect(mockSetState).toHaveBeenCalledTimes(1);
        const callback = mockSetState.mock.calls[0][0];
        const prevState = { selectedRows: new Set() };

        const nextState = callback(prevState);
        expect(nextState.selectedRows.has(5)).toBe(true);
    });

    it('removes row index from selectedRows when checkbox is unchecked', () => {
        const mockSetState = jest.fn();
        const baseRow = { __$index__: 5 };
        const defaultProps = {
            selectionColWidth: 50,
            isSelectionColumnLeft: true,
            isSelectionColumnRight: false,
            isActionColumnLeft: true,
            isActionColumnRight: false,
            isMobile: false,
            buttonColWidth: 100,
            baseRow,
        };

        useGridConfig.mockReturnValue({
            state: {
                onRowSelect: jest.fn(),
                selectedRows: new Set([5]),
            },
            setState: mockSetState,
        });

        render(
            <table>
                <tbody>
                    <tr>
                        <GridSelectionCell {...defaultProps} />
                    </tr>
                </tbody>
            </table>
        );

        const checkbox = screen.getByRole('checkbox');

        fireEvent.click(checkbox);

        expect(mockSetState).toHaveBeenCalledTimes(1);
        const callback = mockSetState.mock.calls[0][0];
        const prevState = { selectedRows: new Set([5]) };

        const nextState = callback(prevState);
        expect(nextState.selectedRows.has(5)).toBe(false);
    });

    it('handles missing state from useGridConfig safely', () => {
        const mockSetState = jest.fn();

        useGridConfig.mockReturnValue({
            state: undefined,
            setState: mockSetState,
        });

        const baseRow = { __$index__: 1 };

        const props = {
            selectionColWidth: 50,
            isSelectionColumnLeft: false,
            isSelectionColumnRight: false,
            isActionColumnLeft: false,
            isActionColumnRight: false,
            isMobile: false,
            buttonColWidth: 100,
            baseRow,
        };

        render(
            <table>
                <tbody>
                    <tr>
                        <GridSelectionCell {...props} />
                    </tr>
                </tbody>
            </table>
        );

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
    });

    it('does not call onRowSelect if it is not a function', () => {
        const mockSetState = jest.fn();
        const baseRow = { __$index__: 10 };

        useGridConfig.mockReturnValue({
            state: {
                onRowSelect: undefined,
                selectedRows: new Set(),
            },
            setState: mockSetState,
        });

        const props = {
            selectionColWidth: 40,
            isSelectionColumnLeft: true,
            isSelectionColumnRight: false,
            isActionColumnLeft: false,
            isActionColumnRight: false,
            isMobile: false,
            buttonColWidth: 80,
            baseRow,
        };

        render(
            <table>
                <tbody>
                    <tr>
                        <GridSelectionCell {...props} />
                    </tr>
                </tbody>
            </table>
        );

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockSetState).toHaveBeenCalledTimes(1);
    });

});


describe('GridSelectionCell `right` style', () => {
    const baseRow = { __$index__: 1 };

    const getProps = (overrides = {}) => ({
        selectionColWidth: 50,
        isSelectionColumnLeft: false,
        isSelectionColumnRight: true,
        isActionColumnLeft: false,
        isActionColumnRight: false,
        isMobile: false,
        buttonColWidth: 100,
        baseRow,
        ...overrides
    });

    const renderCell = (props) => {
        render(
            <table>
                <tbody>
                    <tr>
                        <GridSelectionCell {...props} />
                    </tr>
                </tbody>
            </table>
        );
        return screen.getByRole('cell', { name: /select row/i });
    };

    it('sets right to -0.1px when not mobile and isActionColumnRight is false', () => {
        const td = renderCell(getProps({ isActionColumnRight: false }));
        expect(td).toHaveStyle({ right: '-0.1px' });
    });

    it('sets right to buttonColWidth when not mobile and isActionColumnRight is true', () => {
        const td = renderCell(getProps({ isActionColumnRight: true }));
        expect(td).toHaveStyle({ right: '100px' });
    });

    it('sets right to empty string when isMobile is true', () => {
        const td = renderCell(getProps({ isMobile: true }));
        expect(td).toHaveStyle({ right: '' });
    });

    it('sets right to empty string when isSelectionColumnRight is false', () => {
        const td = renderCell(getProps({ isSelectionColumnRight: false }));
        expect(td).toHaveStyle({ right: '' });
    });
});
