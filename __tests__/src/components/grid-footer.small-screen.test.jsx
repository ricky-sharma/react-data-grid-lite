import { render, screen } from '@testing-library/react';
import React from 'react';
import { GridConfigContext } from '../../../src/context/grid-config-context';
import GridFooter from './../../../src/components/grid-footer';

jest.mock('../../../src/hooks/use-window-width', () => ({
    useWindowWidth: () => 600,
}));


describe('GridFooter when (!isMobile || !showSelectPagination)', () => {
    const defaultProps = {
        onPageChange: jest.fn(),
        onPrev: jest.fn(),
        onNext: jest.fn(),
    };

    const mockState = {
        totalRows: 50,
        currentPageRows: 10,
        activePage: 2,
        pageRows: 10,
        pagerSelectOptions: [1, 2, 3],
        enablePaging: true,
        noOfPages: 5,
        showNumberPagination: true,
        showSelectPagination: false,
        showPageSizeSelector: true,
        showPageInfo: true,
    };

    const mockSetState = jest.fn();

    const renderWithProvider = (ui, stateOverrides = {}) =>
        render(
            <GridConfigContext.Provider value={{ state: { ...mockState, ...stateOverrides }, setState: mockSetState }}>
                {ui}
            </GridConfigContext.Provider>
        );

    it('renders GridPagination on mobile when showSelectPagination is false', () => {
        renderWithProvider(<GridFooter {...defaultProps} />);
        const paginationEl = screen.getByRole('list');
        expect(paginationEl).toBeInTheDocument();
    });
});