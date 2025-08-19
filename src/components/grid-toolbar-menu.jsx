import React, { useEffect, useRef, useState } from 'react';
import { useGridConfig } from '../hooks/use-grid-config';
import { eventExportToCSV } from './events/event-export-csv-clicked';
import Menu from './custom-fields/menu';

const GridToolBarMenu = ({ handleResetGrid }) => {
    const { state = {} } = useGridConfig() ?? {};
    const {
        columns,
        rowsData,
        downloadFilename,
        onDownloadComplete
    } = state;

    const items = [
        {
            name: 'Export CSV', action: eventExportToCSV,
            args: [rowsData, columns, downloadFilename, onDownloadComplete]
        },
        {
            name: 'Reset Filters', action: handleResetGrid
        },
    ]

    return (
        <Menu items={items} />
    )
}

export default GridToolBarMenu;