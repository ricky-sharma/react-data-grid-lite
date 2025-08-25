import React from 'react';
import { Export_To_CSV_Text } from '../constants';
import { capitalize, isNull } from '../helpers/common';
import { useGridConfig } from '../hooks/use-grid-config';
import CheckboxIcon from '../icons/checkbox-icon';
import DownloadIcon from '../icons/download-icon';
import EraseIcon from '../icons/erase-icon';
import HideViewIcon from '../icons/hideview-Icon';
import Menu from './custom-fields/menu';
import { eventExportToCSV } from './events/event-export-csv-clicked';

const GridToolBarMenu = ({
    handleResetGrid,
    vertical,
    borderRadius,
    noBorder,
    height,
    top,
    boxShadow,
    padding
}) => {
    const { state = {}, setState } = useGridConfig() ?? {};
    const {
        columns,
        rowsData,
        downloadFilename,
        onDownloadComplete,
        showResetMenuItem,
        isCSVExportUIButton,
        enableDownload
    } = state || {};
    const noColumns = isNull(columns) || !columns.some(col => !col?.hideable && !col?.hidden);
    const noData = !Array.isArray(rowsData) || rowsData.length === 0 || noColumns
    const items = [
        {
            name: 'Reset filters',
            action: !noColumns ? handleResetGrid : null,
            disabled: noColumns,
            hidden: !showResetMenuItem,
            icon: <EraseIcon />,
            tooltip:
                'Resets the grid by clearing all selected rows, returning to the first page, and removing applied filters and sorting.',
        },
        {
            name: Export_To_CSV_Text,
            action: !noData ? eventExportToCSV : null,
            disabled: noData,
            args: [rowsData, columns, downloadFilename, onDownloadComplete],
            hidden: !(enableDownload && !isCSVExportUIButton),
            icon: <DownloadIcon />,
            tooltip: 'Export the grid data to a CSV format file',
        },
        {
            name: 'Column visibility',
            tooltip: 'Toggle visibility of columns in the grid',
            icon: <HideViewIcon />,
            subItems: columns?.
                filter(col => !col?.hidden).
                map((col) => ({
                    name: col?.alias ?? col?.name,
                    icon: !col?.hideable ? <CheckboxIcon /> : null,
                    tooltip: `Toggle visibility of "${capitalize(col?.alias ?? col?.name)}" column`,
                    action: () =>
                        setState((prev) => ({
                            ...prev,
                            columns: prev.columns.map((c) =>
                                c.name === col.name ? { ...c, hideable: !c.hideable } : c
                            ),
                        })),
                })),
        },
    ];

    return (
        <Menu
            items={items}
            vertical={vertical}
            borderRadius={borderRadius}
            noBorder={noBorder}
            height={height}
            top={top}
            boxShadow={boxShadow}
            padding={padding}
        />
    )
}

export default GridToolBarMenu;