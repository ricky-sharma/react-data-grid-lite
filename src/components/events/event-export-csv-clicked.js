import { CSV_File_Name } from "../../constants";

/**
 * Exports an array of data objects to a CSV file.
 *
 * This function creates a CSV from a given dataset and a set of column definitions.
 * It performs case-insensitive matching between column names and data keys, 
 * ensuring reliable value extraction even if the key casing is inconsistent.
 *
 * @param {Array<Object>} data - The array of data records to export.
 * @param {Array<Object|string>} columns - Column definitions. Each can be an object with `Name` and optional `DisplayName`, or a simple string key.
 * @param {string} [filename='*.csv'] - The name of the CSV file to download.
 *
 * @returns {void}
 */
export const eventExportToCSV = (data, columns, filename = CSV_File_Name) => {
    if (!data || data.length === 0 || !columns) {
        return;
    }

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
};
