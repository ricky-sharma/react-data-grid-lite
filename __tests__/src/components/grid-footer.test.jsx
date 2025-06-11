/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */

jest.mock('./../../../src/components/grid-pagination', () => (props) => (
    <div data-testid="mock-pagination">
        <button
            data-testid="prev-button"
            disabled={props.activePage === 1}
            onClick={() => props.onPrevButtonClick()}
        >
            Previous
        </button>
        <span data-testid="page-indicator">
            Page {props.activePage} of {props.noOfPages}
        </span>
        <button
            data-testid="next-button"
            disabled={props.activePage === props.noOfPages}
            onClick={() => props.onNextButtonClick()}
        >
            Next
        </button>
    </div>
));

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import GridFooter from './../../../src/components/grid-footer';

describe('GridFooter Component', () => {
    const defaultProps = {
        totalRows: 25,
        currentPageRows: 10,
        activePage: 2,
        pageRows: 10,
        pagerSelectOptions: [1, 2, 3],
        enablePaging: true,
        noOfPages: 3,
        onPageChange: jest.fn(),
        onPrev: jest.fn(),
        onNext: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders GridFooter with pagination', () => {
        render(<GridFooter {...defaultProps} />);
        expect(screen.getByText((content) => content.includes('25'))).toBeInTheDocument();
        expect(screen.getByTestId('mock-pagination')).toBeInTheDocument();
    });

    it('displays the correct range based on active page', () => {
        render(<GridFooter {...defaultProps} />);
        expect(screen.getByText((content) => content.includes('11 - 20'))).toBeInTheDocument();
    });

    it('shows only totalRows if all results are on one page', () => {
        const { container } = render(<GridFooter {...defaultProps} totalRows={8} currentPageRows={8} />);
        const pageResults = container.querySelector('.page-results');
        expect(pageResults).toHaveTextContent('8 results');
    });

    it('renders pager select with correct values', () => {
        render(<GridFooter {...defaultProps} />);
        const select = screen.getByRole('combobox');
        expect(select.value).toBe('2');
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(3);
        expect(options[0].value).toBe('1');
    });

    it('triggers onPageChange when a new page is selected from dropdown', () => {
        render(<GridFooter {...defaultProps} />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '3' } });
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 3);
    });

    it('calls onPrev when prev button is clicked', () => {
        render(<GridFooter {...defaultProps} />);
        fireEvent.click(screen.getByTestId('prev-button'));
        expect(defaultProps.onPrev).toHaveBeenCalled();
    });

    it('calls onNext when next button is clicked', () => {
        render(<GridFooter {...defaultProps} />);
        fireEvent.click(screen.getByTestId('next-button'));
        expect(defaultProps.onNext).toHaveBeenCalled();
    });
});

describe('More Tests for GridFooter Component', () => {
    const defaultProps = {
        totalRows: 50,
        currentPageRows: 10,
        activePage: 2,
        pageRows: 10,
        pagerSelectOptions: [1, 2, 3, 4, 5],
        enablePaging: true,
        noOfPages: 5,
        onPageChange: jest.fn(),
        onPrev: jest.fn(),
        onNext: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    it('renders pagination controls correctly', () => {
        render(<GridFooter {...defaultProps} />);
        expect(screen.getByText('11 - 20')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('calls onPrev when Previous is clicked', () => {
        render(<GridFooter {...defaultProps} />);
        const prevButton = screen.getByText('Previous');
        fireEvent.click(prevButton);
        expect(defaultProps.onPrev).toHaveBeenCalledTimes(1);
    });

    it('calls onNext when Next is clicked', () => {
        render(<GridFooter {...defaultProps} />);
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);
        expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it('calls onPageChange when a page is selected from the dropdown', () => {
        render(<GridFooter {...defaultProps} />);
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '2' } });
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 2);
    });

    it('disables Previous button on the first page', () => {
        render(<GridFooter {...defaultProps} activePage={1} />);
        const prevButton = screen.getByText('Previous');
        expect(prevButton).toBeDisabled();
    });

    it('disables Next button on the last page', () => {
        render(<GridFooter {...defaultProps} activePage={5} />);
        const nextButton = screen.getByText('Next');
        expect(nextButton).toBeDisabled();
    });

    it('enables Next button on a non-final page', () => {
        render(<GridFooter {...defaultProps} activePage={2} />);
        const nextButton = screen.getByTestId('next-button');
        expect(nextButton).not.toBeDisabled();
    });

    it('renders GridFooter without crashing', () => {
        expect(() => render(<GridFooter pagerSelectOptions={[]} totalRows={0} />)).not.toThrow();
    });
});