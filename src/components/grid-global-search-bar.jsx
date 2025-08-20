import React, { memo } from 'react';
import { isNull } from '../helpers/common';
import { useGridConfig } from '../hooks/use-grid-config';
import { useWindowWidth } from '../hooks/use-window-width';
import DownloadIcon from '../icons/download-icon';
import EraseIcon from '../icons/erase-icon';
import SearchIcon from '../icons/search-icon';
import { gridWidthType } from '../utils/grid-width-type-utils';
import { Export_To_CSV_Text } from './../constants';
import Input from './custom-fields/input';
import { eventExportToCSV } from './events/event-export-csv-clicked';
import GridToolBarMenu from './grid-toolbar-menu';

const GridGlobalSearchBar = memo(({
    searchHandler,
    handleResetGrid,
}) => {
    const windowWidth = useWindowWidth();
    const { state = {}, setState = () => { } } = useGridConfig() ?? {};
    const {
        enableGlobalSearch,
        globalSearchInput,
        columns,
        enableDownload,
        rowsData,
        downloadFilename,
        onDownloadComplete,
        showResetButton,
        globalSearchPlaceholder,
        gridID,
        isCSVExportUIButton
    } = state;

    const { isXSWidth, isSmallWidth, isMobileWidth, isTabletWidth, isMediumWidth } = gridWidthType(windowWidth, gridID);
    const noColumns = isNull(columns);
    const noData = !Array.isArray(rowsData) || rowsData.length === 0 || noColumns
    return (
        <div
            style={{
                zIndex: 5,
                position: 'relative'
            }}
            className="row--flex col-flex-12 globalSearchDiv">
            {enableGlobalSearch === true && (
                <div
                    style={{
                        opacity: (noData ? '0.7' : '0.9'),
                        width: !isCSVExportUIButton ? (isXSWidth ? '64%' : '70%')
                            : (isXSWidth ? '48%' :
                                isSmallWidth ? '53%' :
                                    isMobileWidth ? '63%' : '68%')
                    }}
                    className="pd--0 mg--0 globalSearch">
                    <div className="ai-search-input-wrapper">
                        <Input
                            placeholder={globalSearchPlaceholder ?? "Search all columns…"}
                            type="text"
                            value={globalSearchInput}
                            onChange={(e) => {
                                setState(prev => ({
                                    ...prev,
                                    globalSearchInput: e?.target?.value
                                }));
                                if ((!state?.aiSearchOptions?.enabled || e?.target?.value === '') && typeof searchHandler === 'function') {
                                    searchHandler(e, '##globalSearch##', columns);
                                }
                            }}
                        />
                        {state?.aiSearchOptions?.enabled && (
                            <button
                                className="inline-search-btn alignCenter"
                                onClick={(e) => searchHandler(e, '##globalSearch##', columns, null, false)}
                                title="Run AI Search"
                            >
                                <SearchIcon />
                            </button>
                        )}
                    </div>
                </div>
            )}
            <div className="button-container">
                {showResetButton === true && (
                    <div
                        style={{
                            pointerEvents: (noColumns ? 'none' : ''),
                            opacity: (noColumns ? '0.5' : ''),
                            float: (isSmallWidth || isMobileWidth ? 'right' : undefined),
                            width: (isSmallWidth || isMobileWidth ? '36px' : undefined),
                        }}
                        className="pd--0 mg--0 icon-div alignCenter clear-icon-div icon-div-mobile opacity--level"
                        title="Reset Filters"
                        onClick={(e) => {
                            e.preventDefault();
                            handleResetGrid();
                        }}
                        role="button"
                        tabIndex="0"
                        onKeyDown={
                            (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleResetGrid()
                                }
                            }}
                    >
                        <EraseIcon />
                    </div>)}
                {enableDownload === true && isCSVExportUIButton === true && (
                    <div
                        style={{
                            pointerEvents: (noData ? 'none' : ''),
                            opacity: (noData ? '0.5' : ''),
                            width: (isSmallWidth || isMobileWidth ? '36px' : undefined),
                        }}
                        className="pd--0 mg--0 alignCenter download-icon-div icon-div icon-div-mobile opacity--level"
                        title={Export_To_CSV_Text}
                        onClick={(e) =>
                            eventExportToCSV(
                                rowsData,
                                columns,
                                downloadFilename,
                                onDownloadComplete,
                                e
                            )
                        }
                        role="button"
                        tabIndex="0"
                        onKeyDown={
                            (e) => {
                                if (e.key === 'Enter' || e.key === ' ')
                                    eventExportToCSV(
                                        e,
                                        rowsData,
                                        columns,
                                        downloadFilename,
                                        onDownloadComplete
                                    )
                            }}
                    >
                        <div
                            style={{
                                gap: isSmallWidth || isMobileWidth ? 0 : undefined
                            }}
                            className="pd--0 mg--0 icon-content">
                            <DownloadIcon />
                            <span>
                                {isSmallWidth || isMobileWidth ? '' : Export_To_CSV_Text}
                            </span>
                        </div>
                    </div>
                )}
                <div className="pd--0 mg--0 alignCenter">
                    <GridToolBarMenu handleResetGrid={handleResetGrid} />
                </div>
            </div>
        </div>
    );
});

export default GridGlobalSearchBar;