import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { GridConfigContext } from '../../../src/context/grid-config-context';
import GridPagination from './../../../src/components/grid-pagination';

beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
});

describe('GridPagination', () => {
    const mockState = {
        enablePaging: true,
        activePage: 2,
        noOfPages: 5
    };

    const renderWithProvider = (ui, stateOverrides = {}) =>
        render(
            <GridConfigContext.Provider value={{ state: { ...mockState, ...stateOverrides } }}>
                {ui}
            </GridConfigContext.Provider>
        );

    it('renders nothing if enablePaging is false', () => {
        const { container } = renderWithProvider(<GridPagination />, { enablePaging: false });
        expect(container.firstChild).toBeNull();
    });

    it('renders pagination with correct buttons', () => {
        renderWithProvider(<GridPagination />);
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getAllByText('..')).toHaveLength(2);
    });

    it('disables previous button on first page', () => {
        renderWithProvider(<GridPagination />, { activePage: 1 });
        const prevButton = screen.getAllByRole('link')[0];
        expect(prevButton.parentElement).toHaveClass('disabled');
    });

    it('disables next button on last page', () => {
        renderWithProvider(<GridPagination />, { activePage: 5 });
        const links = screen.getAllByRole('link');
        const nextButton = links[links.length - 1];
        expect(nextButton.parentElement).toHaveClass('disabled');
    });

    it('calls onPrevButtonClick when prev is clicked', () => {
        const onPrev = jest.fn();
        renderWithProvider(<GridPagination onPrevButtonClick={onPrev} />);
        const prevButton = screen.getAllByRole('link')[0];
        fireEvent.click(prevButton);
        expect(onPrev).toHaveBeenCalled();
    });

    it('calls onNextButtonClick when next is clicked', () => {
        const onNext = jest.fn();
        renderWithProvider(<GridPagination onNextButtonClick={onNext} />);
        const links = screen.getAllByRole('link');
        const nextButton = links[links.length - 1];
        fireEvent.click(nextButton);
        expect(onNext).toHaveBeenCalled();
    });

    it('calls onPageChange when a page number is clicked', () => {
        const onPageChange = jest.fn();
        renderWithProvider(<GridPagination onPageChange={onPageChange} />);
        fireEvent.click(screen.getByText('1'));
        expect(onPageChange).toHaveBeenCalledWith(expect.anything(), 1);
    });

    it('shows extra left and right numbers when applicable', () => {
        renderWithProvider(<GridPagination />, { activePage: 1 });
        expect(screen.getByText('3')).toBeInTheDocument();

        renderWithProvider(<GridPagination />, { activePage: 5 });
        expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('hides dots when not needed', () => {
        const { container } = renderWithProvider(<GridPagination />, { activePage: 2, noOfPages: 2 });
        const dotElements = container.querySelectorAll('a.dot');
        expect(dotElements.length).toBeGreaterThan(0);
        expect(dotElements[0].closest('li')).toHaveStyle('visibility: hidden');
    });
});

describe('GridPagination Functional Tests', () => {
    const baseProps = {
        onPageChange: jest.fn(),
        onPrevButtonClick: jest.fn(),
        onNextButtonClick: jest.fn()
    };

    const mockState = {
        enablePaging: true,
        noOfPages: 5,
        activePage: 3
    };

    const renderWithProvider = (ui, stateOverrides = {}) =>
        render(
            <GridConfigContext.Provider value={{ state: { ...mockState, ...stateOverrides } }}>
                {ui}
            </GridConfigContext.Provider>
        );

    beforeEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('triggers onPageChange with page - 2 on left dots click', () => {
        renderWithProvider(<GridPagination {...baseProps} />);
        const leftDots = screen.getAllByText('..')[0];
        fireEvent.click(leftDots);
        expect(baseProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 1);
    });

    it('triggers onPageChange with 3 on thirdPage item (when page is 1)', () => {
        renderWithProvider(<GridPagination {...baseProps} />, { activePage: 1 });
        const thirdPage = screen.getByText('3');
        fireEvent.click(thirdPage);
        expect(baseProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 3);
    });

    it('triggers onPageChange with total - 2 on thirdLast (when page is last)', () => {
        renderWithProvider(<GridPagination {...baseProps} />, { activePage: 5 });
        const thirdLast = screen.getByText('3');
        fireEvent.click(thirdLast);
        expect(baseProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 3);
    });

    it('triggers onPageChange with page + 2 on right dots click', () => {
        renderWithProvider(<GridPagination {...baseProps} />);
        const rightDots = screen.getAllByText('..')[1];
        fireEvent.click(rightDots);
        expect(baseProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 5);
    });

    it('disables prev button on first page', () => {
        renderWithProvider(<GridPagination {...baseProps} />, { activePage: 1 });
        const prev = screen.getByLabelText('Previous Page');
        expect(prev).toBeInTheDocument();
        const parent = prev.parentElement;
        expect(parent).toHaveClass('disabled');
    });

    it('disables next button on last page', () => {
        renderWithProvider(<GridPagination {...baseProps} />, { activePage: 5 });
        const next = screen.getByLabelText('Next Page');
        expect(next).toBeInTheDocument();
        const parent = next.parentElement;
        expect(parent).toHaveClass('disabled');
    });

    it('calls onPrevButtonClick when prev is clicked and not disabled', () => {
        renderWithProvider(<GridPagination {...baseProps} />, { activePage: 3 });
        const prev = screen.getByLabelText('Previous Page');
        fireEvent.click(prev.firstChild);
        expect(baseProps.onPrevButtonClick).toHaveBeenCalled();
    });

    it('calls onNextButtonClick when next is clicked and not disabled', () => {
        renderWithProvider(<GridPagination {...baseProps} />, { activePage: 3 });
        const next = screen.getByLabelText('Next Page');
        fireEvent.click(next.firstChild);
        expect(baseProps.onNextButtonClick).toHaveBeenCalled();
    });
});