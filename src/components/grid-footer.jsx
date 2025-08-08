import React, { memo } from 'react';
import { Page_Size_Selector_Options } from '../constants';
import { isNull } from '../helpers/common';
import { useGridConfig } from '../hooks/use-grid-config';
import Dropdown from './custom-fields/dropdown';
import GridPagination from './grid-pagination';

const GridFooter = memo(({
    onPageChange,
    onPrev,
    onNext
}) => {
    const { state = {}, setState = () => { } } = useGridConfig() ?? {};
    const {
        totalRows,
        currentPageRows,
        activePage,
        pageRows,
        pagerSelectOptions,
        gridBackgroundColor
    } = state;
    const start = (activePage - 1) * pageRows + 1;
    const end = start + currentPageRows - 1;
    const showingRange = totalRows > currentPageRows ? `${start} - ${end}` : totalRows;

    const onPageSelectorChange = (value) => {
        console.log(value)
        setState(prev => {
            let noOfPages = Math.floor(prev.rowsData / value);
            let lastPageRows = prev.rowsData % value;
            if (lastPageRows > 0) noOfPages++;
            else if (lastPageRows === 0) lastPageRows = value;
            const resetPage = prev?.activePage > noOfPages;
            const activePage = resetPage ? 1 : prev?.activePage ?? 1;
            return {
                ...prev,
                noOfPages,
                lastPageRows,
                activePage,
                currentPageRows: (activePage === noOfPages) ? lastPageRows : value,
                firstRow: value * (resetPage ? 0 : activePage - 1),
                pageRows: value
            }
        });
    }

    return (
        <div style={{
            backgroundColor: gridBackgroundColor
        }} className="row--flex col-flex-12 mg--0 pd--0 alignCenter grid-footer">
            {!isNull(totalRows) && totalRows !== 0 ? (
                <div className="col-flex-5 mg--0 pd--0 page-results">
                    {showingRange}{" of "}{totalRows}
                </div>)
                : null
            }
            <div className="col-flex-2 mg--0 pd--0 pager-select alignCenter">
                {pagerSelectOptions?.length ?? 0 > 0 ?
                    <Dropdown
                        options={pagerSelectOptions}
                        value={activePage}
                        onChange={(e, val) => onPageChange(e, parseInt(val, 10))}
                    />
                    : null
                }
            </div>
            <div className="col-flex-3 mg--0 pd--0 page-size-selector alignCenter">
                {(state?.pageRows ?? 0) > 0 ?
                    <div className="rows--selector" >
                        <div>Rows per page:</div>
                        <Dropdown
                            options={Page_Size_Selector_Options}
                            value={state?.pageRows}
                            onChange={(_, value) => onPageSelectorChange(value)}
                            cssClass="ps-dropdown"
                        />
                    </div>
                    : null}
            </div>
            <div className="float-lt col-flex-2 mg--0 pd--0 page-list">
                {(pagerSelectOptions?.length ?? 0) > 0 ?
                    <GridPagination
                        onPageChange={onPageChange}
                        onPrevButtonClick={onPrev}
                        onNextButtonClick={onNext}
                    /> : null}
            </div>
        </div>
    );
});

export default GridFooter;