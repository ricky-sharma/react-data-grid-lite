/* eslint-disable react/prop-types */
import React from 'react';
import { isNull } from '../helpers/common';
import Dropdown from './custom-fields/dropdown';
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
        <div className="row--flex col-flex-12 mg--0 pd--0 alignCenter grid-footer">
            {!isNull(totalRows) && totalRows !== 0 ? (
                <div className="col-flex-5 mg--0 pd--0 page-results">
                    {showingRange}{" of "}{totalRows}{" results"}
                </div>)
                : null
            }
            <div className="col-flex-2 mg--0 pd--0 pagerSelect alignCenter">
                {pagerSelectOptions?.length ?? 0 > 0 ?
                    <Dropdown
                        options={pagerSelectOptions}
                        value={activePage}
                        onChange={(e, val) => onPageChange(e, parseInt(val, 10))}
                    />
                    : null
                }
            </div>
            <div className="float-lt col-flex-5 mg--0 pd--0 page-list">
                <div className="col-flex-12 mg--0 pd--0">
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
