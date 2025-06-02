/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import GridFooter from './../../../src/components/grid-footer';

jest.mock('./../../../src/components/grid-pagination', () => ({
    enablePaging, activePage, noOfPages, onPageChange, onPrevButtonClick, onNextButtonClick
}) => (
    <div data-testid="mock-pagination">
        <button data-testid="prev-button" onClick={() => onPrevButtonClick()}>Prev</button>
        <span data-testid="page-indicator">Page {activePage} of {noOfPages}</span>
        <button data-testid="next-button" onClick={() => onNextButtonClick()}>Next</button>
    </div>
));
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