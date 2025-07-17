/* eslint-disable react/prop-types */
import React from 'react';

const GridPagination = ({
    enablePaging,
    activePage = 1,
    noOfPages = 1,
    onPageChange,
    onPrevButtonClick,
    onNextButtonClick
}) => {
    if (!enablePaging) return null;

    const page = parseInt(activePage), total = parseInt(noOfPages);
    const pageItems = [];
    const commonLinkProps = {
        style: { background: 'inherit' },
        className: 'page-link alignCenter',
        href: '/',
    };

    const createItem = (key, content, onClick, extraClass = '', atagClass = '', style = {}, optionalProps = {}) => (
        <li key={key} className={`mg--0 pd--0 page-item ${extraClass}`} style={style} >
            <a {...commonLinkProps}
                {...optionalProps}
                className={`${commonLinkProps.className}
                ${atagClass}`}
                onClick={onClick}
            >
                {content}
            </a>
        </li>
    );

    // Prev
    pageItems.push(
        createItem(
            'prevButton',
            <b><i className="arrow" aria-hidden="true">&laquo;</i></b>,
            onPrevButtonClick,
            page === 1 || total === 0 ? 'arrow disabled' : 'arrow',
            '', {}, { 'aria-label': 'Previous Page' }
        )
    );

    // Left Dots
    pageItems.push(
        createItem(
            'leftDots',
            <b>..</b>,
            e => onPageChange(e, page - 2),
            '',
            'dot',
            { visibility: page > 2 && total > 3 ? "visible" : "hidden" },
            { 'tabIndex': '-1' }
        )
    );

    // Extra left number (when on last page)
    if (page === total && total >= 3) {
        pageItems.push(
            createItem('thirdLast', total - 2, e => onPageChange(e, total - 2))
        );
    }

    // Main Pages
    for (let j = Math.max(1, page - 1); j <= Math.min(total, page + 1); j++) {
        pageItems.push(
            createItem(j, j, e => onPageChange(e, j), page === j ? 'active' : '')
        );
    }

    // Extra right number (when on first page)
    if (page === 1 && total >= 3) {
        pageItems.push(createItem('thirdPage', 3, e => onPageChange(e, 3)));
    }

    // Right Dots
    pageItems.push(
        createItem(
            'rightDots',
            <b>..</b>,
            e => onPageChange(e, page + 2),
            '',
            'dot',
            { visibility: total - 1 > page && total > 3 ? "visible" : "hidden" },
            { 'tabIndex': '-1' }
        )
    );

    // Next
    pageItems.push(
        createItem(
            'nextButton',
            <b><i className="arrow" aria-hidden="true">&raquo;</i></b>,
            onNextButtonClick,
            page === total || total === 0 ? 'arrow disabled' : 'arrow',
            '', {}, { 'aria-label': 'Next Page' }
        )
    );

    return <ul className="pagination alignCenter">{pageItems}</ul>;
};

export default GridPagination;