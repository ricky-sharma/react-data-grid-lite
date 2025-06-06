/* eslint-disable react/prop-types */
import React from 'react';
import { useWindowWidth } from '../hooks/use-window-width';
import { Export_To_CSV_Text } from './../constants';
import { eventExportToCSV } from './events/event-export-csv-clicked';

const GridGlobalSearchBar = ({
    enableGlobalSearch,
    globalSearchInput,
    gridID,
    columns,
    onSearchClicked,
    handleResetSearch,
    enableDownload,
    rowsData,
    downloadFilename,
    onDownloadComplete,
}) => {
    const windowWidth = useWindowWidth();
    const isSmallScreen = windowWidth < 500;
    const noData = !Array.isArray(rowsData) || rowsData.length === 0
    return (
        <div className="row col-12 globalSearchDiv">
            {enableGlobalSearch && (
                <div
                    style={{
                        pointerEvents: (noData ? 'none' : ''),
                        opacity: (noData ? '0.5' : '')
                    }}
                    className="p-0 m-0">
                    <input
                        data-type={`globalSearch${gridID}`}
                        value={globalSearchInput}
                        className="globalSearch"
                        placeholder="Global Search"
                        onChange={(e) =>
                            onSearchClicked(e, '##globalSearch##', columns)
                        }
                        type="text"
                    />
                </div>
            )}
            <div
                style={{
                    pointerEvents: (noData ? 'none' : ''),
                    opacity: (noData ? '0.5' : '')
                }}
                className="p-0 m-0 icon-div alignCenter clear-icon-div"
                title="Reset Search"
                onClick={handleResetSearch}
                data-toggle="tooltip"
            >
                <span className="icon-common-css erase-icon"></span>
            </div>
            {enableDownload && (
                <div
                    style={{
                        pointerEvents: (noData ? 'none' : ''),
                        opacity: (noData ? '0.5' : '')
                    }}
                    className="p-0 m-0 icon-div alignCenter download-icon-div"
                    title="Export CSV"
                    onClick={(e) =>
                        eventExportToCSV(
                            e,
                            rowsData,
                            columns,
                            downloadFilename,
                            onDownloadComplete
                        )
                    }
                    data-toggle="tooltip"
                >
                    {isSmallScreen ? '' : Export_To_CSV_Text} <span className="icon-common-css download-icon"></span>
                </div>
            )}
        </div>
    );
};

export default GridGlobalSearchBar;