/* eslint-disable no-undef */
jest.mock('./../../../src/components/events/event-export-csv-clicked', () => ({
    eventExportToCSV: jest.fn(),
}));

jest.mock('./../../../src/hooks/use-window-width', () => ({
    useWindowWidth: jest.fn(() => 1024),
}));

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import GridGlobalSearchBar from './../../../src/components/grid-global-search-bar';
import { eventExportToCSV } from './../../../src/components/events/event-export-csv-clicked';

describe('GridGlobalSearchBar', () => {
    const defaultProps = {
        enableGlobalSearch: true,
        globalSearchInput: 'test',
        gridID: '1',
        columns: [{ name: 'col1' }],
        onSearchClicked: jest.fn(),
        handleResetSearch: jest.fn(),
        enableDownload: true,
        rowsData: [{ col1: 'value1' }],
        downloadFilename: 'my-data',
        onDownloadComplete: jest.fn(),
        setState: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders GridGlobalSearchBar without crashing with rowsData null or empty', () => {
        expect(() => render(
            <GridGlobalSearchBar
                rowsData={null}
                enableDownload={true}
                enableGlobalSearch={true}
            />)).not.toThrow();
        expect(() => render(
            <GridGlobalSearchBar
                rowsData={[]}
                enableDownload={true}
                enableGlobalSearch={true}
            />)).not.toThrow();
    });

    it('renders global search input when enabled', () => {
        render(<GridGlobalSearchBar {...defaultProps} />);
        const input = screen.getByPlaceholderText(/Global Search/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('test');
    });

    it('does not render global search input when disabled', () => {
        render(<GridGlobalSearchBar {...defaultProps} enableGlobalSearch={false} />);
        expect(screen.queryByPlaceholderText(/Global Search/i)).not.toBeInTheDocument();
    });

    it('calls onSearchClicked when input changes', () => {
        render(<GridGlobalSearchBar {...defaultProps} />);
        const input = screen.getByPlaceholderText(/Global Search/i);
        fireEvent.change(input, { target: { value: 'new' } });
        expect(defaultProps.onSearchClicked).toHaveBeenCalledWith(
            expect.any(Object),
            '##globalSearch##',
            defaultProps.columns
        );
    });

    it('calls handleResetSearch on reset icon click', () => {
        render(<GridGlobalSearchBar {...defaultProps} />);
        const resetIcon = screen.getByTitle(/Reset Filters/i);
        fireEvent.click(resetIcon);
        expect(defaultProps.handleResetSearch).toHaveBeenCalled();
    });

    it('calls eventExportToCSV on export click', () => {
        render(<GridGlobalSearchBar {...defaultProps} />);
        const exportIcon = screen.getByTitle(/Export CSV/i);
        fireEvent.click(exportIcon);
        expect(eventExportToCSV).toHaveBeenCalledWith(
            expect.any(Object),
            defaultProps.rowsData,
            defaultProps.columns,
            defaultProps.downloadFilename,
            defaultProps.onDownloadComplete
        );
    });

    it('does not render export section when enableDownload is false', () => {
        render(<GridGlobalSearchBar {...defaultProps} enableDownload={false} />);
        expect(screen.queryByTitle(/Export CSV/i)).not.toBeInTheDocument();
    });

    it('hides Export_To_CSV_Text on small screens', () => {
        jest.resetModules();
        jest.doMock('./../../../src/hooks/use-window-width', () => ({
            useWindowWidth: () => 400,
        }));
        const SmallScreenComponent = require('./../../../src/components/grid-global-search-bar').default;
        render(<SmallScreenComponent {...defaultProps} />);
        const exportDiv = screen.getByTitle(/Export CSV/i);
        expect(exportDiv).toBeInTheDocument();
        expect(exportDiv.textContent).not.toMatch(/Export To CSV/i);
        expect(exportDiv.textContent.trim()).toBe('');
    });

});
