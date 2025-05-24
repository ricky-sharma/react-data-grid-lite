/* eslint-disable react/prop-types */
import React from 'react';

const GridPagination = ({
    enablePaging = false,
    activePage = 1,
    noOfPages = 1,
    onPageChange = () => { },
    onPrevButtonClick = () => { },
    onNextButtonClick = () => { }
}) => {
    if (enablePaging === false)
        return null

    const pageItems = [];

    const page = parseInt(activePage);
    const total = parseInt(noOfPages);

    // Previous Button
    pageItems.push(
        <li key="prevButton" className={`arrow page-item ${page === 1 || total === 0 ? "disabled" : ""}`}>
            <a onClick={(e) => onPrevButtonClick(e)} href="/" className="page-link alignCenter">
                <b><i aria-hidden="true" className="arrow">&laquo;</i></b>
            </a>
        </li>
    );

    // Left dots
    pageItems.push(
        <li
            style={{ visibility: page > 2 && total > 3 ? "visible" : "collapse" }}
            key="leftDots"
            className="m-0 p-0 page-item">
            <a href="/" onClick={(e) => onPageChange(e, page - 2)} className="page-link alignCenter dot"><b>..</b></a>
        </li>
    );

    // Third last page (when on last page)
    if (page === total && total >= 3) {
        pageItems.push(
            <li key="thirdLast" className="m-0 p-0 page-item">
                <a href="/" onClick={(e) => onPageChange(e, total - 2)} className="page-link alignCenter">{total - 2}</a>
            </li>
        );
    }

    // Central pagination
    for (let j = 1; j <= total; j++) {
        if (page - 1 <= j && page + 1 >= j) {
            pageItems.push(
                <li key={j} className={`m-0 p-0 page-item ${page === j ? 'active' : ''}`}>
                    <a href="/" onClick={(e) => onPageChange(e, j)} className="page-link alignCenter">{j}</a>
                </li>
            );
        }
    }

    // Third page (when on first page)
    if (page === 1 && total >= 3) {
        pageItems.push(
            <li key="thirdPage" className="m-0 p-0 page-item">
                <a href="/" onClick={(e) => onPageChange(e, 3)} className="page-link alignCenter">3</a>
            </li>
        );
    }

    // Right dots
    pageItems.push(
        <li
            style={{ visibility: total - 1 > page && total > 3 ? "visible" : "collapse" }}
            key="rightDots"
            className="m-0 p-0 page-item">
            <a href="/" onClick={(e) => onPageChange(e, page + 2)} className="page-link alignCenter dot"><b>..</b></a>
        </li>
    );

    // Next Button
    pageItems.push(
        <li key="nextButton" className={`arrow page-item ${page === total || total === 0 ? "disabled" : ""}`}>
            <a onClick={(e) => onNextButtonClick(e)} href="/" className="page-link alignCenter">
                <b><i aria-hidden="true" className="arrow">&raquo;</i></b>
            </a>
        </li>
    );

    return (
        <ul className="pagination alignCenter">
            {pageItems}
        </ul>
    );
};

export default GridPagination;
