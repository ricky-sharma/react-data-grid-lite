import React, { memo } from 'react';
import { Page_Size_Selector_Options } from '../constants';
import { useGridConfig } from '../hooks/use-grid-config';
import { useWindowWidth } from '../hooks/use-window-width';
import Dropdown from './custom-fields/dropdown';
import GridPagination from './grid-pagination';

const GridFooter = memo(({
    onPageChange,
    onPrev,
    onNext
}) => {
    const windowWidth = useWindowWidth();
    const { state = {}, setState } = useGridConfig() ?? {};
    const {
        totalRows,
        currentPageRows,
        activePage,
        pageRows,
        enablePaging,
        pagerSelectOptions,
        gridBackgroundColor,
        showNumberPagination,
        showSelectPagination,
        showPageSizeSelector,
        showPageInfo
    } = state;
    const isMobile = windowWidth < 701;
    const start = (activePage - 1) * pageRows + 1;
    const end = start + currentPageRows - 1;
    const showingRange = totalRows > currentPageRows ? `${start} - ${end}` : totalRows;

    const onPageSelectorChange = (value) => {
        setState?.(prev => {
            let noOfPages = Math.floor(totalRows / value);
            let lastPageRows = totalRows % value;
            if (lastPageRows > 0) noOfPages++;
            if (lastPageRows === 0) lastPageRows = value;
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
            <div className="col-flex-5 mg--0 pd--0 page-results">
                {showPageInfo === true && totalRows > 0 && (`${showingRange} of ${totalRows}`)}
            </div>
            <div className="col-flex-2 mg--0 pd--0 pager-select alignCenter">
                {showSelectPagination === true &&
                    enablePaging === true &&
                    pagerSelectOptions?.length > 0 &&
                    (<Dropdown
                        options={pagerSelectOptions}
                        value={activePage}
                        onChange={(e, val) => onPageChange(e, parseInt(val, 10))}
                    />)}
            </div>
            <div className="col-flex-3 mg--0 pd--0 page-size-selector alignCenter">
                {showPageSizeSelector === true &&
                    enablePaging === true &&
                    state?.pageRows > 0 &&
                    (<div className="rows--selector" >
                        <div>Rows per page:</div>
                        <Dropdown
                            options={Page_Size_Selector_Options}
                            value={state?.pageRows}
                            onChange={(_, value) => onPageSelectorChange(value)}
                            cssClass="ps-dropdown"
                        />
                    </div>)}
            </div>
            <div className="float-lt col-flex-2 mg--0 pd--0 page-list">
                {showNumberPagination === true &&
                    pagerSelectOptions?.length > 0 &&
                    (!isMobile || !showSelectPagination) && (
                        <GridPagination
                            onPageChange={onPageChange}
                            onPrevButtonClick={onPrev}
                            onNextButtonClick={onNext}
                        />
                    )}
            </div>
        </div>
    );
});

export default GridFooter;