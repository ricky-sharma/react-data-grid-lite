/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import { useGridConfig } from '../hooks/use-grid-config';

const GridPagination = memo(({
    onPageChange,
    onPrevButtonClick,
    onNextButtonClick
}) => {
    const { state = {} } = useGridConfig() ?? {};
    const {
        enablePaging,
        activePage = 1,
        noOfPages = 1
    } = state;
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
            <i className="arrow" aria-hidden="true">&laquo;</i>,
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
            <i className="arrow" aria-hidden="true">&raquo;</i>,
            onNextButtonClick,
            page === total || total === 0 ? 'arrow disabled' : 'arrow',
            '', {}, { 'aria-label': 'Next Page' }
        )
    );

    return <ul className="pagination alignCenter">{pageItems}</ul>;
});

export default GridPagination;