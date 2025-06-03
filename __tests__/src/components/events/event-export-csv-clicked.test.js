import { eventExportToCSV } from './../../../../src/components/events/event-export-csv-clicked';
import { CSV_File_Name_Prefix } from './../../../../src/constants';
import * as commonHelpers from './../../../../src/helpers/common';
import * as dateHelpers from './../../../../src/helpers/date';

describe('eventExportToCSV', () => {
    const mockClick = jest.fn();
    let originalCreateObjectURL;
    let originalRevokeObjectURL;
    let originalCreateElement;

    beforeAll(() => {
        originalCreateObjectURL = URL.createObjectURL;
        originalRevokeObjectURL = URL.revokeObjectURL;
        URL.createObjectURL = jest.fn(() => 'blob:url');
        URL.revokeObjectURL = jest.fn();
        originalCreateElement = document.createElement;
        document.createElement = jest.fn(() => ({
            href: '',
            setAttribute: jest.fn(),
            click: mockClick,
        }));
        jest.spyOn(commonHelpers, 'isNull');
        jest.spyOn(dateHelpers, 'formatDate');
    });

    afterAll(() => {
        URL.createObjectURL = originalCreateObjectURL;
        URL.revokeObjectURL = originalRevokeObjectURL;
        document.createElement = originalCreateElement;
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        mockClick.mockClear();
        commonHelpers.isNull.mockReset();
        dateHelpers.formatDate.mockReset();
    });

    it('returns early if data is empty', () => {
        const result = eventExportToCSV(null, [], [{ name: 'col1' }], 'file.csv');
        expect(result).toBeUndefined();
        expect(URL.createObjectURL).not.toHaveBeenCalled();
    });

    it('returns early if columns is falsy', () => {
        const data = [{ col1: 'value' }];
        const result = eventExportToCSV(null, data, null, 'file.csv');
        expect(result).toBeUndefined();
        expect(URL.createObjectURL).not.toHaveBeenCalled();
    });

    it('generates filename using prefix and formatted date if filename is null', () => {
        commonHelpers.isNull.mockReturnValue(true);
        dateHelpers.formatDate.mockReturnValue('2025-06-03 12:00:00');

        const data = [{ col1: 'value' }];
        const columns = [{ name: 'col1' }];

        eventExportToCSV(null, data, columns, null);

        expect(commonHelpers.isNull).toHaveBeenCalledWith(null);
        expect(dateHelpers.formatDate).toHaveBeenCalled();
        const expectedFilename = `${CSV_File_Name_Prefix}-2025-06-03 12:00:00.csv`;
        expect(document.createElement).toHaveBeenCalledWith('a');
        const createdLink = document.createElement.mock.results[0].value;
        expect(createdLink.setAttribute).toHaveBeenCalledWith('download', expectedFilename);
    });

    it('appends .csv extension if missing in filename', () => {
        commonHelpers.isNull.mockReturnValue(false);

        const data = [{ col1: 'value' }];
        const columns = [{ name: 'col1' }];
        const filename = 'myfile';

        eventExportToCSV(null, data, columns, filename);

        const createdLink = document.createElement.mock.results[0].value;
        expect(createdLink.setAttribute).toHaveBeenCalledWith('download', 'myfile.csv');
    });

    it('does not append .csv if filename already ends with .csv (case-insensitive)', () => {
        commonHelpers.isNull.mockReturnValue(false);

        const data = [{ col1: 'value' }];
        const columns = [{ name: 'col1' }];
        const filename = 'myfile.CSV';

        eventExportToCSV(null, data, columns, filename);

        const createdLink = document.createElement.mock.results[0].value;
        expect(createdLink.setAttribute).toHaveBeenCalledWith('download', 'myfile.CSV');
    });

    it('calls onDownloadComplete callback with correct parameters', () => {
        commonHelpers.isNull.mockReturnValue(false);

        const data = [{ col1: 'value' }];
        const columns = [{ name: 'col1' }];
        const filename = 'file.csv';
        const onDownloadComplete = jest.fn();

        const event = { type: 'click' };

        eventExportToCSV(event, data, columns, filename, onDownloadComplete);

        expect(onDownloadComplete).toHaveBeenCalledWith(expect.any(Object), filename, expect.any(Blob));
    });

    it('exports CSV content with properly escaped values and case-insensitive columns', () => {
        commonHelpers.isNull.mockReturnValue(false);

        const data = [
            { Col1: 'value1', CoL2: 'value, with, commas', col3: 'value "with quotes"' }
        ];
        const columns = [
            { name: 'col1' },
            { name: 'COL2' },
            { name: 'col3' },
            { name: 'col4' },
        ];

        const mockBlobConstructor = jest.fn(function (content, options) {
            this.content = content;
            this.options = options;
        });
        const originalBlob = global.Blob;
        global.Blob = mockBlobConstructor;

        eventExportToCSV(null, data, columns, 'file.csv');

        expect(mockBlobConstructor).toHaveBeenCalledTimes(1);

        const expectedCsvLines = [
            'col1,COL2,col3,col4',
            '"value1","value, with, commas","value ""with quotes""",""'
        ];
        const expectedCsvContent = expectedCsvLines.join('\n');
        expect(mockBlobConstructor).toHaveBeenCalledWith(
            [expectedCsvContent],
            { type: 'text/csv;charset=utf-8;' }
        );
        global.Blob = originalBlob;
    });
});
