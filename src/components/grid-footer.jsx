/* eslint-disable react/prop-types */
import React from 'react';
import { isNull } from '../helpers/common';
import GridPagination from './grid-pagination';
import Dropdown from './dropdown';

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
            {!isNull(totalRows) && totalRows !== 0 ? (
                <div className="col-5 m-0 p-0 page-results">
                    {showingRange}{" of "}{totalRows}{" results"}
                </div>)
                : null
            }
            <div className="col-2 m-0 p-0 pagerSelect alignCenter">
                {pagerSelectOptions?.length ?? 0 > 0 ?
                    <Dropdown
                        options={pagerSelectOptions}
                        value={activePage}
                        onChange={(e, val) => onPageChange(e, parseInt(val, 10))}
                    />
                    : null
                }
            </div>
            <div className="float-lt col-5 m-0 p-0 page-list">
                <div className="col-12 m-0 p-0">
                    {pagerSelectOptions?.length ?? 0 > 0 ?
                        <GridPagination
                            enablePaging={enablePaging}
                            activePage={activePage}
                            noOfPages={noOfPages}
                            onPageChange={onPageChange}
                            onPrevButtonClick={onPrev}
                            onNextButtonClick={onNext}
                        /> : null}
                </div>
            </div>
        </div>
    );
};

export default GridFooter;
