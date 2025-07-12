/* eslint-disable react/prop-types */
import React from 'react';
import { isNull } from '../helpers/common';
import { useWindowWidth } from '../hooks/use-window-width';
import DownloadIcon from '../icons/download-icon';
import EraseIcon from '../icons/erase-icon';
import { Export_To_CSV_Text } from './../constants';
import Input from './custom-fields/input';
import { eventExportToCSV } from './events/event-export-csv-clicked';

const GridGlobalSearchBar = ({
    setState,
    enableGlobalSearch,
    globalSearchInput,
    columns,
    onSearchClicked,
    handleResetSearch,
    enableDownload,
    rowsData,
    downloadFilename,
    onDownloadComplete,
    showResetButton,
    globalSearchPlaceholder
}) => {
    const windowWidth = useWindowWidth();
    const isSmallScreen = windowWidth < 701;
    const noColumns = isNull(columns);
    const noData = !Array.isArray(rowsData) || rowsData.length === 0 || noColumns
    return (
        <div className="row--flex col-flex-12 globalSearchDiv">
            {enableGlobalSearch && (
                <div
                    style={{
                        opacity: (noData ? '0.8' : '')
                    }}
                    className="pd--0 mg--0 globalSearch">
                    <Input
                        placeholder={globalSearchPlaceholder ?? "Search all columns…"}
                        type="text"
                        value={globalSearchInput}
                        onChange={(e) => {
                            setState(prev => ({
                                ...prev,
                                globalSearchInput: e?.target?.value
                            }));
                            if (typeof onSearchClicked === 'function') {
                                onSearchClicked(e, '##globalSearch##', columns);
                            }
                        }}
                    />
                </div>
            )}
            <div className="button-container">
                {showResetButton === true && (
                    <div
                        style={{
                            pointerEvents: (noColumns ? 'none' : ''),
                            opacity: (noColumns ? '0.5' : '')
                        }}
                        className="pd--0 mg--0 icon-div alignCenter clear-icon-div icon-div-mobile"
                        title="Reset Filters"
                        onClick={handleResetSearch}
                        data-toggle="tooltip"
                        role="button"
                        tabIndex="0"
                        onKeyDown={
                            (e) => {
                                if (e.key === 'Enter' || e.key === ' ')
                                    handleResetSearch(e)
                            }}
                    >
                        <EraseIcon />
                    </div>)}
                {enableDownload === true && (
                    <div
                        style={{
                            pointerEvents: (noData ? 'none' : ''),
                            opacity: (noData ? '0.5' : '')
                        }}
                        className="pd--0 mg--0 alignCenter download-icon-div icon-div icon-div-mobile"
                        title={Export_To_CSV_Text}
                        onClick={(e) =>
                            eventExportToCSV(
                                e,
                                rowsData,
                                columns,
                                downloadFilename,
                                onDownloadComplete
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
                        data-toggle="tooltip"
                    >
                        <div className="pd--0 mg--0 icon-content">
                            <DownloadIcon />
                            <span>
                                {isSmallScreen ? '' : Export_To_CSV_Text}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GridGlobalSearchBar;