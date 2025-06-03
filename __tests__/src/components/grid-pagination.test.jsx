import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import GridPagination from './../../../src/components/grid-pagination';

beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
});

describe('GridPagination', () => {
    it('renders nothing if enablePaging is false', () => {
        const { container } = render(<GridPagination enablePaging={false} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders pagination with correct buttons', () => {
        render(<GridPagination enablePaging={true} activePage={2} noOfPages={5} />);
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getAllByText('..')).toHaveLength(2);
    });

    it('disables previous button on first page', () => {
        render(<GridPagination enablePaging={true} activePage={1} noOfPages={5} />);
        const prevButton = screen.getAllByRole('link')[0];
        expect(prevButton.parentElement).toHaveClass('disabled');
    });

    it('disables next button on last page', () => {
        render(<GridPagination enablePaging={true} activePage={5} noOfPages={5} />);
        const links = screen.getAllByRole('link');
        const nextButton = links[links.length - 1];
        expect(nextButton.parentElement).toHaveClass('disabled');
    });

    it('disables previous button on first page', () => {
        render(<GridPagination enablePaging={true} activePage={1} noOfPages={5} />);
        const prevButton = screen.getAllByRole('link')[0];
        expect(prevButton.parentElement).toHaveClass('disabled');
    });

    it('disables next button on last page', () => {
        render(<GridPagination enablePaging={true} activePage={5} noOfPages={5} />);
        const links = screen.getAllByRole('link');
        const nextButton = links[links.length - 1];
        expect(nextButton.parentElement).toHaveClass('disabled');
    });

    it('calls onPrevButtonClick when prev is clicked', () => {
        const onPrev = jest.fn();
        render(<GridPagination enablePaging={true} activePage={2} noOfPages={5} onPrevButtonClick={onPrev} />);
        const prevButton = screen.getAllByRole('link')[0];
        fireEvent.click(prevButton);
        expect(onPrev).toHaveBeenCalled();
    });

    it('calls onNextButtonClick when next is clicked', () => {
        const onNext = jest.fn();
        render(<GridPagination enablePaging={true} activePage={2} noOfPages={5} onNextButtonClick={onNext} />);
        const links = screen.getAllByRole('link');
        const nextButton = links[links.length - 1];
        fireEvent.click(nextButton);
        expect(onNext).toHaveBeenCalled();
    });

    it('calls onPageChange when a page number is clicked', () => {
        const onPageChange = jest.fn();
        render(<GridPagination enablePaging={true} activePage={2} noOfPages={5} onPageChange={onPageChange} />);
        fireEvent.click(screen.getByText('1'));
        expect(onPageChange).toHaveBeenCalledWith(expect.anything(), 1);
    });

    it('shows extra left and right numbers when applicable', () => {
        render(<GridPagination enablePaging={true} activePage={1} noOfPages={5} />);
        expect(screen.getByText('3')).toBeInTheDocument();

        render(<GridPagination enablePaging={true} activePage={5} noOfPages={5} />);
        expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('hides dots when not needed', () => {
        render(<GridPagination enablePaging={true} activePage={2} noOfPages={2} />);
        const dotElements = screen.getAllByRole('link').filter(el => el.classList.contains('dot'));
        expect(dotElements[0].closest('li')).toHaveStyle('visibility: collapse');
    });
});

describe('GridPagination Functional Tests', () => {
    const baseProps = {
        enablePaging: true,
        noOfPages: 5,
        activePage: 3,
        onPageChange: jest.fn(),
        onPrevButtonClick: jest.fn(),
        onNextButtonClick: jest.fn(),
    };

    beforeEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('triggers onPageChange with page - 2 on left dots click', () => {
        render(<GridPagination {...baseProps} />);
        const leftDots = screen.getAllByText('..')[0];
        fireEvent.click(leftDots);
        expect(baseProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 1); // 3 - 2
    });

    it('triggers onPageChange with 3 on thirdPage item (when page is 1)', () => {
        render(<GridPagination {...baseProps} activePage={1} />);
        const thirdPage = screen.getByText('3');
        fireEvent.click(thirdPage);
        expect(baseProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 3);
    });

    it('triggers onPageChange with total - 2 on thirdLast (when page is last)', () => {
        render(<GridPagination {...baseProps} activePage={5} />);
        const thirdLast = screen.getByText('3'); // total 5, total - 2 = 3
        fireEvent.click(thirdLast);
        expect(baseProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 3);
    });

    it('triggers onPageChange with page + 2 on right dots click', () => {
        render(<GridPagination {...baseProps} />);
        const rightDots = screen.getAllByText('..')[1];
        fireEvent.click(rightDots);
        expect(baseProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 5); // 3 + 2
    });

    it('disables prev button on first page', () => {
        render(<GridPagination {...baseProps} activePage={1} />);
        const prev = screen.getByLabelText('Previous Page');
        expect(prev).toHaveClass('disabled');
    });

    it('disables next button on last page', () => {
        render(<GridPagination {...baseProps} activePage={5} />);
        const next = screen.getByLabelText('Next Page');
        expect(next).toHaveClass('disabled');
    });

    it('calls onPrevButtonClick when prev is clicked and not disabled', () => {
        render(<GridPagination {...baseProps} activePage={3} />);
        const prev = screen.getByLabelText('Previous Page');
        fireEvent.click(prev.firstChild);
        expect(baseProps.onPrevButtonClick).toHaveBeenCalled();
    });

    it('calls onNextButtonClick when next is clicked and not disabled', () => {
        render(<GridPagination {...baseProps} activePage={3} />);
        const next = screen.getByLabelText('Next Page');
        fireEvent.click(next.firstChild);
        expect(baseProps.onNextButtonClick).toHaveBeenCalled();
    });
});