/* eslint-disable no-unused-vars */

import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { GridConfigContext } from '../../../src/context/grid-config-context';
import * as useGridConfigModule from '../../../src/hooks/use-grid-config';
import GridFooter from './../../../src/components/grid-footer';


describe('GridFooter Component', () => {
    const defaultProps = {
        onPageChange: jest.fn(),
        onPrev: jest.fn(),
        onNext: jest.fn()
    };

    const mockState = {
        totalRows: 25,
        currentPageRows: 10,
        activePage: 2,
        pageRows: 10,
        pagerSelectOptions: [1, 2, 3],
        enablePaging: true,
        noOfPages: 3,
        showNumberPagination: true,
        showSelectPagination: true,
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

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders GridFooter with pagination', () => {
        renderWithProvider(<GridFooter {...defaultProps} />);
        expect(screen.getByText((content) => content.includes('25'))).toBeInTheDocument();
        const paginationEl = screen.getByRole('list');
        expect(paginationEl).toHaveClass('pagination');
    });

    it('displays the correct range based on active page', () => {
        renderWithProvider(<GridFooter {...defaultProps} />);
        expect(screen.getByText((content) => content.includes('11 - 20'))).toBeInTheDocument();
    });

    it('shows only totalRows if all results are on one page', () => {
        const { container } = renderWithProvider(<GridFooter {...defaultProps} />, {
            totalRows: 8,
            currentPageRows: 8,
            showSelectPagination: false,
            activePage: 1,
            noOfPages: 1
        });
        const pageResults = container.querySelector('.page-results');
        expect(pageResults).toHaveTextContent('8 of 8');
    });

    it('renders pager select with correct values', () => {
        const { container } = renderWithProvider(<GridFooter {...defaultProps} />);

        const dropdownTrigger = screen.getByRole('button', { name: /2/i });
        expect(dropdownTrigger).toBeInTheDocument();

        fireEvent.click(dropdownTrigger);
        const optionsContainer = container.querySelector('.dropdown-options');
        const optionItems = within(optionsContainer).getAllByText(/^\d+$/);

        expect(optionItems).toHaveLength(3);
        expect(optionItems[0].textContent).toBe('1');
    });


    it('triggers onPageChange when a new page is selected from dropdown', () => {
        renderWithProvider(<GridFooter {...defaultProps} />);
        const dropdownTrigger = screen.getByRole('button', { name: /2/i });
        fireEvent.click(dropdownTrigger);
        const option = screen.getByRole('option', { name: '3' });
        fireEvent.click(option);
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 3);
    });

    it('calls onPrev when prev button is clicked', () => {
        renderWithProvider(<GridFooter {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('Previous Page'));
        expect(defaultProps.onPrev).toHaveBeenCalled();
    });

    it('calls onNext when next button is clicked', () => {
        renderWithProvider(<GridFooter {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('Next Page'));
        expect(defaultProps.onNext).toHaveBeenCalled();
    });
});

describe('More Tests for GridFooter Component', () => {
    const defaultProps = {
        onPageChange: jest.fn(),
        onPrev: jest.fn(),
        onNext: jest.fn()
    };

    const mockState = {
        totalRows: 50,
        currentPageRows: 10,
        activePage: 2,
        pageRows: 10,
        pagerSelectOptions: [1, 2, 3, 4, 5],
        enablePaging: true,
        noOfPages: 5,
        showNumberPagination: true,
        showSelectPagination: true,
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

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    it('renders pagination controls correctly', () => {
        renderWithProvider(<GridFooter {...defaultProps} />);
        expect(screen.getByText(/11 - 20/i)).toBeInTheDocument();
        expect(screen.getByText(/50/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Next Page')).toBeInTheDocument();
        expect(screen.getByLabelText('Previous Page')).toBeInTheDocument();
    });

    it('calls onPrev when Previous is clicked', () => {
        renderWithProvider(<GridFooter {...defaultProps} />);
        const prevButton = screen.getByLabelText('Previous Page');
        fireEvent.click(prevButton);
        expect(defaultProps.onPrev).toHaveBeenCalledTimes(1);
    });

    it('calls onNext when Next is clicked', () => {
        renderWithProvider(<GridFooter {...defaultProps} />);
        const nextButton = screen.getByLabelText('Next Page');
        fireEvent.click(nextButton);
        expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it('calls onPageChange when a page is selected from the dropdown', () => {
        renderWithProvider(<GridFooter {...defaultProps} />);
        const dropdownTrigger = screen.getByRole('button', { name: /2/i });
        fireEvent.click(dropdownTrigger);
        const option = screen.getByText('5');
        fireEvent.click(option);
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 5);
    });

    it('disables Previous button on the first page', () => {
        renderWithProvider(<GridFooter {...defaultProps} />, { activePage: 1 });
        const prevButton = screen.getByLabelText('Previous Page');
        const listItem = prevButton.closest('li');
        expect(listItem).toHaveClass('disabled');
    });

    it('disables Next button on the last page', () => {
        renderWithProvider(<GridFooter {...defaultProps} />, { activePage: 5 });
        const nextButton = screen.getByLabelText('Next Page');
        const listItem = nextButton.closest('li');
        expect(listItem).toHaveClass('disabled');
    });

    it('enables Next button on a non-final page', () => {
        renderWithProvider(<GridFooter {...defaultProps} />, { activePage: 2 });
        const nextButton = screen.getByLabelText('Next Page');
        const listItem = nextButton.closest('li');
        expect(listItem).not.toHaveClass('disabled');
    });

    it('renders GridFooter without crashing', () => {
        expect(() => renderWithProvider(<GridFooter />, { pagerSelectOptions: [], totalRows: 0 })).not.toThrow();
    });

    it('updates pagination state correctly when page size is changed', () => {
        const stateOverrides = {
            totalRows: 100,
            currentPageRows: 10,
            activePage: 6,
            pageRows: 10,
            pagerSelectOptions: [1, 2, 3, 4, 5, 6],
            noOfPages: 10,
            showPageSizeSelector: true
        };

        renderWithProvider(<GridFooter {...defaultProps} />, stateOverrides);
        const pageSizeDropdownTrigger = screen.getByRole('button', { name: /10/i });
        fireEvent.click(pageSizeDropdownTrigger);
        const newPageSizeOption = screen.getByText('25');
        fireEvent.click(newPageSizeOption);
        expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
        const updaterFn = mockSetState.mock.calls[0][0];

        const result = updaterFn({
            totalRows: 100,
            activePage: 6,
            currentPageRows: 10,
            pageRows: 10,
        });

        expect(result).toEqual({
            totalRows: 100,
            activePage: 1,
            currentPageRows: 25,
            pageRows: 25,
            firstRow: 0,
            lastPageRows: 25,
            noOfPages: 4,
        });
    });

    it('increments noOfPages if lastPageRows > 0', () => {
        const stateOverrides = {
            totalRows: 105,
            currentPageRows: 10,
            activePage: 5,
            pageRows: 10,
            pagerSelectOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            noOfPages: 11,
            showPageSizeSelector: true
        };

        renderWithProvider(<GridFooter {...defaultProps} />, stateOverrides);
        const pageSizeDropdownTrigger = screen.getByRole('button', { name: /10/i });
        fireEvent.click(pageSizeDropdownTrigger);
        const newPageSizeOption = screen.getByText('25');
        fireEvent.click(newPageSizeOption);
        const updaterFn = mockSetState.mock.calls[0][0];
        const result = updaterFn({
            totalRows: 105,
            activePage: 5,
            currentPageRows: 5,
            pageRows: 25
        });

        expect(result.noOfPages).toBe(5);
        expect(result.lastPageRows).toBe(5);
        expect(result.activePage).toBe(5);
        expect(result.currentPageRows).toBe(5);
        expect(result.firstRow).toBe(100);
        expect(result.pageRows).toBe(25);
    });

    it('defaults activePage to 1 if prev.activePage is undefined and resetPage is false', () => {
        const mockSetState = jest.fn();
        render(
            <GridConfigContext.Provider
                value={{
                    state: {
                        ...mockState,
                        totalRows: 100,
                        activePage: undefined 
                    },
                    setState: mockSetState
                }}
            >
                <GridFooter {...defaultProps} />
            </GridConfigContext.Provider>
        );

        const dropdownTrigger = screen.getAllByRole('button')[1];
        fireEvent.click(dropdownTrigger);
        const newPageSizeOption = screen.getByText('25');
        fireEvent.click(newPageSizeOption);
        expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
        const updatedState = mockSetState.mock.calls[0][0]({
            totalRows: 100,
            activePage: undefined
        });
        expect(updatedState.activePage).toBe(1);
    });

    describe('GridFooter when useGridConfig returns null or undefined', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        it('renders safely when useGridConfig returns null', () => {
            jest.spyOn(useGridConfigModule, 'useGridConfig').mockReturnValue(null);

            expect(() => render(<GridFooter {...defaultProps} />)).not.toThrow();
            expect(screen.queryByText(/of/)).toBeNull();
        });

        it('renders safely when useGridConfig returns undefined', () => {
            jest.spyOn(useGridConfigModule, 'useGridConfig').mockReturnValue(undefined);

            expect(() => render(<GridFooter {...defaultProps} />)).not.toThrow();
        });
    });   
});