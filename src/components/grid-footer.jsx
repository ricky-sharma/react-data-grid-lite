import React, { memo } from 'react';
import { Page_Size_Selector_Options } from '../constants';
import { useGridConfig } from '../hooks/use-grid-config';
import { useWindowWidth } from '../hooks/use-window-width';
import { gridWidthType } from '../utils/grid-width-type-utils';
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
        showPageInfo,
        gridID
    } = state;
    const {
        isXSWidth,
        isSmallWidth,
        isMobileWidth,
        isTabletWidth,
        isMediumWidth,
        isLargeWidth
    } = gridWidthType(windowWidth, gridID);
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
            <div
                style={{
                    paddingLeft: isSmallWidth === true ? '4px' : undefined,
                    width: isMobileWidth ? '40%' : isXSWidth ? "25%" : isSmallWidth ? "30%" : undefined,
                    maxWidth: isMobileWidth ? '40%' : isXSWidth ? "25%" : isSmallWidth ? "30%" : undefined,
                }}
                className="col-flex-5 mg--0 pd--0 page-results opacity--level">
                {showPageInfo === true && totalRows > 0 && (`${showingRange} of ${totalRows}`)}
            </div>
            <div
                style={{
                    width: isMobileWidth || isSmallWidth ? '20%' : undefined,
                    maxWidth: isMobileWidth || isSmallWidth ? '20%' : undefined,
                }}
                className="col-flex-2 mg--0 pd--0 pager-select alignCenter">
                {showSelectPagination === true &&
                    enablePaging === true &&
                    pagerSelectOptions?.length > 0 &&
                    (<Dropdown
                        options={pagerSelectOptions}
                        value={activePage}
                        onChange={(e, val) => onPageChange(e, parseInt(val, 10))}
                    />)}
            </div>
            <div
                style={{
                    padding: isLargeWidth === true ? '0 60px 0 0' :
                        (isMediumWidth === true ? '0 40px 0 0' : 0),
                    width: isTabletWidth ? '33.332%' :
                        (isMobileWidth ? '40%' : isXSWidth ? "55%" : isSmallWidth ? '50%' : undefined),
                    maxWidth: isTabletWidth ? '33.332%'
                        : (isMobileWidth ? '40%' : isXSWidth ? "55%" : isSmallWidth ? '50%' : undefined)
                }}
                className="col-flex-3 mg--0 pd--0 page-size-selector alignCenter">
                {showPageSizeSelector === true &&
                    enablePaging === true &&
                    state?.pageRows > 0 &&
                    (<div className="rows--selector">
                        <div className="opacity--level" style={{ flex: 'none' }}>Rows per page:</div>
                        <Dropdown
                            options={Page_Size_Selector_Options}
                            value={state?.pageRows}
                            onChange={(_, value) => onPageSelectorChange(value)}
                            cssClass="ps-dropdown"
                        />
                    </div>)}
            </div>
            <div
                style={{
                    width: isTabletWidth ? '8.333%' : (isMobileWidth || isSmallWidth ? '100%' : undefined),
                    maxWidth: isTabletWidth ? '8.333%' : (isMobileWidth || isSmallWidth ? '100%' : undefined)
                }}
                className="float-lt col-flex-2 mg--0 pd--0 page-list opacity--level">
                {showNumberPagination === true &&
                    pagerSelectOptions?.length > 0 &&
                    (
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