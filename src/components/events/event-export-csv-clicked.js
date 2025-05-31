import { CSV_File_Name_Prefix } from "../../constants";
import { isNull } from "../../helper/common";
import { formatDate } from "../../helper/date";

/**
 * Exports an array of data objects to a CSV file.
 */
export const eventExportToCSV = (
    e,
    data,
    columns,
    filename,
    onDownloadComplete = () => { }
) => {
    if (!data || data.length === 0 || !columns) {
        return;
    }

    if (isNull(filename))
        filename = `${CSV_File_Name_Prefix}-${formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')}.csv`;

    // Ensure the filename ends with `.csv`
    if (!filename.toLowerCase().endsWith('.csv')) {
        filename += '.csv';
    }

    // Extract headers
    const headers = columns.map(col => col.name);

    // Preprocess rows to create case-insensitive key maps
    const processedData = data.map(row => {
        const keyMap = {};
        Object.keys(row).forEach(key => {
            keyMap[key.toLowerCase()] = row[key];
        });
        return keyMap;
    });

    // Create rows using case-insensitive lookup
    const rows = processedData.map(row => {
        return columns.map(col => {
            const colName = (col.name).toLowerCase(); // Normalize column name
            const value = row[colName];
            return `"${(value ?? '').toString().replace(/"/g, '""')}"`; // Escape double quotes
        }).join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    // Create Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.click();
    URL.revokeObjectURL(url);
    if (typeof onDownloadComplete === 'function') {
        onDownloadComplete(
            e,
            filename,
            blob
        );
    }
};
