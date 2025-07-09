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


describe('More Tests for GridGlobalSearchBar', () => {
    const setState = jest.fn();
    const onSearchClicked = jest.fn();
    const handleResetSearch = jest.fn();
    const onDownloadComplete = jest.fn();

    const defaultProps = {
        setState,
        enableGlobalSearch: true,
        globalSearchInput: '',
        columns: [{ name: 'name' }],
        onSearchClicked,
        handleResetSearch,
        enableDownload: true,
        rowsData: [{ id: 1, name: 'A' }],
        downloadFilename: 'file.csv',
        onDownloadComplete
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders global search input when enabled', () => {
        render(<GridGlobalSearchBar {...defaultProps} />);
        expect(screen.getByPlaceholderText('Global Search')).toBeInTheDocument();
    });

    it('does not render global search input when disabled', () => {
        render(<GridGlobalSearchBar {...defaultProps} enableGlobalSearch={false} />);
        expect(screen.queryByPlaceholderText('Global Search')).toBeNull();
    });

    it('calls setState and onSearchClicked on input change', () => {
        render(<GridGlobalSearchBar {...defaultProps} />);
        const input = screen.getByPlaceholderText('Global Search');

        fireEvent.change(input, { target: { value: 'hello' } });

        expect(setState).toHaveBeenCalled();
        expect(onSearchClicked).toHaveBeenCalled();
    });

    it('calls handleResetSearch on reset button click', () => {
        render(<GridGlobalSearchBar {...defaultProps} />);
        const resetBtn = screen.getByTitle('Reset Filters');

        fireEvent.click(resetBtn);

        expect(handleResetSearch).toHaveBeenCalled();
    });

    it('calls handleResetSearch on reset button key press Enter and Space', () => {
        render(<GridGlobalSearchBar {...defaultProps} />);
        const resetBtn = screen.getByTitle('Reset Filters');

        fireEvent.keyDown(resetBtn, { key: 'Enter' });
        fireEvent.keyDown(resetBtn, { key: ' ' });

        expect(handleResetSearch).toHaveBeenCalledTimes(2);
    });

    it('renders download button when enabled', () => {
        render(<GridGlobalSearchBar {...defaultProps} />);
        expect(screen.getByTitle(/Export CSV/i)).toBeInTheDocument();
    });

    it('does not render download button when disabled', () => {
        render(<GridGlobalSearchBar {...defaultProps} enableDownload={false} />);
        expect(screen.queryByTitle(/Export CSV/i)).toBeNull();
    });

    it('download button triggers click and keyboard events', () => {
        render(<GridGlobalSearchBar {...defaultProps} />);
        const downloadBtn = screen.getByTitle(/Export CSV/i);

        fireEvent.click(downloadBtn);
        fireEvent.keyDown(downloadBtn, { key: 'Enter' });
        fireEvent.keyDown(downloadBtn, { key: ' ' });
    });

    it('download button is disabled and semi-transparent when no data', () => {
        const props = {
            ...defaultProps,
            rowsData: [],
            columns: null
        };
        render(<GridGlobalSearchBar {...props} />);
        const downloadBtn = screen.getByTitle(/Export CSV/i);
        expect(downloadBtn).toHaveStyle('pointer-events: none');
        expect(downloadBtn).toHaveStyle('opacity: 0.5');
    });

    it('does not call handleResetSearch on other key presses', () => {
        render(
            <GridGlobalSearchBar
                {...defaultProps}
            />
        );

        const resetBtn = screen.getByTitle('Reset Filters');
        fireEvent.keyDown(resetBtn, { key: 'Escape' });
        fireEvent.keyDown(resetBtn, { key: 'Tab' });
        fireEvent.keyDown(resetBtn, { key: 'a' });
        expect(handleResetSearch).not.toHaveBeenCalled();

        const downloadBtn = screen.getByTitle(/Export CSV/i);
        fireEvent.keyDown(downloadBtn, { key: 'Escape' });
        fireEvent.keyDown(downloadBtn, { key: 'Tab' });
        fireEvent.keyDown(downloadBtn, { key: 'a' });
    });   
});

describe('GridGlobalSearchBar else path for onSearchClicked', () => {
    it('should NOT call onSearchClicked when it is not a function', () => {
        const setState = jest.fn();

        render(
            <GridGlobalSearchBar
                setState={setState}
                enableGlobalSearch={true}
                globalSearchInput=""
                columns={[{ name: 'name' }]}
                onSearchClicked={null}
                handleResetSearch={() => { }}
                enableDownload={false}
                rowsData={[{ id: 1, name: 'test' }]}
                downloadFilename="test.csv"
                onDownloadComplete={() => { }}
            />
        );

        const input = screen.getByPlaceholderText('Global Search');
        fireEvent.change(input, { target: { value: 'test' } });
        expect(setState).toHaveBeenCalled();
    });
});

describe('GridGlobalSearchBar setState coverage', () => {
    it('calls setState with updater that sets globalSearchInput', () => {
        const setState = jest.fn();

        render(
            <GridGlobalSearchBar
                setState={setState}
                enableGlobalSearch={true}
                globalSearchInput=""
                columns={[{ name: 'name' }]}
                onSearchClicked={undefined}
                handleResetSearch={() => { }}
                enableDownload={false}
                rowsData={[{ id: 1, name: 'Row' }]}
                downloadFilename="test.csv"
                onDownloadComplete={() => { }}
            />
        );

        const input = screen.getByPlaceholderText('Global Search');
        fireEvent.change(input, { target: { value: 'hello' } });
        expect(setState).toHaveBeenCalled();
        const updater = setState.mock.calls[0][0];
        const updated = updater({ globalSearchInput: '', something: 'else' });
        expect(updated.globalSearchInput).toBe('');
    });
});