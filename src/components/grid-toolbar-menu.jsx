import React from 'react';
import { useGridConfig } from '../hooks/use-grid-config';
import DownloadIcon from '../icons/download-icon';
import EraseIcon from '../icons/erase-icon';
import Menu from './custom-fields/menu';
import { eventExportToCSV } from './events/event-export-csv-clicked';
import { Export_To_CSV_Text } from '../constants';

const GridToolBarMenu = ({ handleResetGrid }) => {
    const { state = {} } = useGridConfig() ?? {};
    const {
        columns,
        rowsData,
        downloadFilename,
        onDownloadComplete,
        showResetMenuItem,
        isCSVExportUIButton,
        enableDownload
    } = state;

    const items = [
        {
            name: 'Reset Filters', action: handleResetGrid,
            hidden: !showResetMenuItem,
            icon: <EraseIcon />,
            tooltip: "Resets the grid by clearing all selected rows, returning to the first page, and removing applied filters and sorting."
        },
        {
            name: Export_To_CSV_Text, action: eventExportToCSV,
            args: [rowsData, columns, downloadFilename, onDownloadComplete],
            hidden: !(enableDownload && !isCSVExportUIButton),
            icon: <DownloadIcon />,
            tooltip: "Export the grid data to a CSV format file"
        }
    ]

    return (
        <Menu items={items} />
    )
}

export default GridToolBarMenu;