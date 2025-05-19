import PropTypes from 'prop-types';
import React from 'react';

const GridPagination = ({
    enablePaging,
    activePage,
    noOfPages,
    onPageChange,
    onPrevButtonClick,
    onNextButtonClick
}) => {
    if (enablePaging === false)
        return null

    const pageItems = [];

    const page = parseInt(activePage);
    const total = parseInt(noOfPages);

    // Previous Button
    pageItems.push(
        <li key="prevButton" className={`arrow page-item ${page === 1 || total === 0 ? "disabled" : ""}`}>
            <a onClick={(e) => onPrevButtonClick(e)} href="/" className="page-link remove-bg-color icon-align-center">
                <b><i aria-hidden="true" className="arrow">&laquo;</i></b>
            </a>
        </li>
    );

    // Left dots
    if (page > 2 && total > 3) {
        pageItems.push(
            <li key="leftDots" className="m-0 p-0 page-item">
                <a href="/" onClick={(e) => onPageChange(e, page - 2)} className="page-link"><b>..</b></a>
            </li>
        );
    }

    // Third last page (when on last page)
    if (page === total && total >= 3) {
        pageItems.push(
            <li key="thirdLast" className="m-0 p-0 page-item">
                <a href="/" onClick={(e) => onPageChange(e, total - 2)} className="page-link">{total - 2}</a>
            </li>
        );
    }

    // Central pagination
    for (let j = 1; j <= total; j++) {
        if (page - 1 <= j && page + 1 >= j) {
            pageItems.push(
                <li key={j} className={`m-0 p-0 page-item ${page === j ? 'active' : ''}`}>
                    <a href="/" onClick={(e) => onPageChange(e, j)} className="page-link">{j}</a>
                </li>
            );
        }
    }

    // Third page (when on first page)
    if (page === 1 && total >= 3) {
        pageItems.push(
            <li key="thirdPage" className="m-0 p-0 page-item">
                <a href="/" onClick={(e) => onPageChange(e, 3)} className="page-link">3</a>
            </li>
        );
    }

    // Right dots
    if (total - 1 > page && total > 3) {
        pageItems.push(
            <li key="rightDots" className="m-0 p-0 page-item">
                <a href="/" onClick={(e) => onPageChange(e, page + 2)} className="page-link"><b>..</b></a>
            </li>
        );
    }
    // Next Button
    pageItems.push(
        <li key="nextButton" className={`arrow page-item ${page === total || total === 0 ? "disabled" : ""}`}>
            <a onClick={(e) => onNextButtonClick(e)} href="/" className="page-link remove-bg-color icon-align-center">
                <b><i aria-hidden="true" className="arrow">&raquo;</i></b>
            </a>
        </li>
    );

    return (
        <ul className="pagination align-center">
            {pageItems}
        </ul>
    );
};

// PropTypes
GridPagination.propTypes = {
    enablePaging: PropTypes.bool.isRequired,
    activePage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    noOfPages: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    onPageChange: PropTypes.func.isRequired,
    onPrevButtonClick: PropTypes.func.isRequired,
    onNextButtonClick: PropTypes.func.isRequired,
};

// Default props
GridPagination.defaultProps = {
    enablePaging: false,
    activePage: 1,
    noOfPages: 1,
    onPageChange: () => { },
    onPrevButtonClick: () => { },
    onNextButtonClick: () => { },
};

export default GridPagination;
