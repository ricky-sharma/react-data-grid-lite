/* eslint-disable react/prop-types */
import React from 'react';
import GridPagination from './grid-pagination';

const GridFooter = ({
    totalRows,
    currentPageRows,
    activePage,
    pageRows,
    pagerSelectOptions,
    enablePaging,
    noOfPages,
    onPageChange,
    onPrev,
    onNext
}) => {
    const start = (activePage - 1) * pageRows + 1;
    const end = start + currentPageRows - 1;
    const showingRange = totalRows > currentPageRows ? `${start} - ${end}` : totalRows;

    return (
        <div className="row col-12 m-0 p-0 alignCenter grid-footer">
            <div className="col-5 m-0 p-0 page-results">
                <b>{showingRange}</b> {" of "} <b>{totalRows}</b> {" results"}
            </div>
            <div className="col-2 m-0 p-0 pagerSelect alignCenter">
                <select value={activePage} onChange={e => onPageChange(e, parseInt(e.target.value, 10))}>
                    {pagerSelectOptions.map((item, key) => (
                        <option key={key} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>
            <div className="float-lt col-5 m-0 p-0">
                <div className="col-12 m-0 p-0">
                    <GridPagination
                        enablePaging={enablePaging}
                        activePage={activePage}
                        noOfPages={noOfPages}
                        onPageChange={onPageChange}
                        onPrevButtonClick={onPrev}
                        onNextButtonClick={onNext}
                    />
                </div>
            </div>
        </div>
    );
};

export default GridFooter;
