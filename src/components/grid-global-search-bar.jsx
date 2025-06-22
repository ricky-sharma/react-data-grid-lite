/* eslint-disable react/prop-types */
import React from 'react';
import { isNull } from '../helpers/common';
import { useWindowWidth } from '../hooks/use-window-width';
import DownloadIcon from '../icons/download-icon';
import EraseIcon from '../icons/erase-icon';
import { Export_To_CSV_Text } from './../constants';
import { eventExportToCSV } from './events/event-export-csv-clicked';
import Input from './input';

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
    concatColumns,
    columnFormatting
}) => {
    const windowWidth = useWindowWidth();
    const isSmallScreen = windowWidth < 701;
    const noData = !Array.isArray(rowsData) || rowsData.length === 0 || isNull(columns)
    return (
        <div className="row col-12 globalSearchDiv">
            {enableGlobalSearch && (
                <div
                    style={{
                        opacity: (noData ? '0.8' : '')
                    }}
                    className="p-0 m-0 globalSearch">
                    <Input
                        placeholder="Global Search"
                        type="text"
                        value={globalSearchInput}
                        onChange={(e) => {
                            setState(prev => ({
                                ...prev,
                                globalSearchInput: e?.target?.value ?? ''
                            }));
                            if (typeof onSearchClicked === 'function') {
                                onSearchClicked(e, '##globalSearch##', columns);
                            }
                        }}
                    />
                </div>
            )}
            {enableDownload && (
                <div
                    style={{
                        pointerEvents: (noData ? 'none' : ''),
                        opacity: (noData ? '0.5' : '')
                    }}
                    className="p-0 m-0 alignCenter download-icon-div icon-div icon-div-mobile"
                    title="Export CSV"
                    onClick={(e) =>
                        eventExportToCSV(
                            e,
                            rowsData,
                            columns,
                            downloadFilename,
                            onDownloadComplete,
                            concatColumns,
                            columnFormatting
                        )
                    }
                    data-toggle="tooltip"
                >
                    <div className="p-0 m-0 icon-content">
                        <DownloadIcon />
                        <span>
                            {isSmallScreen ? '' : Export_To_CSV_Text}
                        </span>
                    </div>
                </div>
            )}
            <div
                className="p-0 m-0 icon-div alignCenter clear-icon-div icon-div-mobile"
                title="Reset Filters"
                onClick={handleResetSearch}
                data-toggle="tooltip"
            >
                <EraseIcon />
            </div>
        </div>
    );
};

export default GridGlobalSearchBar;