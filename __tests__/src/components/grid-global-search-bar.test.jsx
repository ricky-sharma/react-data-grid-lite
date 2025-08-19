/* eslint-disable no-undef */
jest.mock('./../../../src/components/events/event-export-csv-clicked', () => ({
    eventExportToCSV: jest.fn(),
}));
jest.mock('./../../../src/hooks/use-window-width', () => ({
    useWindowWidth: jest.fn(() => 1024),
}));

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { GridConfigContext } from '../../../src/context/grid-config-context';
import { eventExportToCSV } from './../../../src/components/events/event-export-csv-clicked';
import GridGlobalSearchBar from './../../../src/components/grid-global-search-bar';

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
    cleanup();
});

describe('GridGlobalSearchBar', () => {
    const mockState = {
        enableGlobalSearch: true,
        globalSearchInput: 'test',
        gridID: '1',
        columns: [{ name: 'col1' }],
        enableDownload: true,
        rowsData: [{ col1: 'value1' }],
        downloadFilename: 'my-data',
        onDownloadComplete: jest.fn(),
        showResetButton: true,
        gridID: 'testID'
    };

    const mockSetState = jest.fn();

    const defaultProps = {
        searchHandler: jest.fn(),
        handleResetGrid: jest.fn()
    };

    const renderWithProvider = (ui, stateOverrides = {}) =>
        render(
            <GridConfigContext.Provider value={{ state: { ...mockState, ...stateOverrides }, setState: mockSetState }}>
                {ui}
            </GridConfigContext.Provider>
        );

    it('renders GridGlobalSearchBar without crashing with rowsData null or empty', () => {
        expect(() => renderWithProvider(<GridGlobalSearchBar />,
            {
                rowsData: null,
                enableDownload: true,
                enableGlobalSearch: true
            })).not.toThrow();
        expect(() => renderWithProvider(
            <GridGlobalSearchBar />,
            {
                rowsData: [],
                enableDownload: true,
                enableGlobalSearch: true
            })).not.toThrow();
    });

    it('renders global search input when enabled', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />);
        const input = screen.getByPlaceholderText(/Search all columns…/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('test');
    });

    it('does not render global search input when disabled', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />, { enableGlobalSearch: false });
        expect(screen.queryByPlaceholderText(/Search all columns…/i)).not.toBeInTheDocument();
    });

    it('calls searchHandler when input changes', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />);
        const input = screen.getByPlaceholderText(/Search all columns…/i);
        fireEvent.change(input, { target: { value: 'new' } });
        expect(defaultProps.searchHandler).toHaveBeenCalledWith(
            expect.any(Object),
            '##globalSearch##',
            mockState.columns
        );
    });

    it('calls handleResetGrid on reset icon click', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />);
        const resetIcon = screen.getByTitle(/Reset Filters/i);
        fireEvent.click(resetIcon);
        expect(defaultProps.handleResetGrid).toHaveBeenCalled();
    });

    it('calls eventExportToCSV on export click', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />);
        const exportIcon = screen.getByTitle(/Export CSV/i);
        fireEvent.click(exportIcon);
        expect(eventExportToCSV).toHaveBeenCalledWith(
            mockState.rowsData,
            mockState.columns,
            mockState.downloadFilename,
            mockState.onDownloadComplete,
            expect.any(Object)
        );
    });

    it('does not render export section when enableDownload is false', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />, { enableDownload: false });
        expect(screen.queryByTitle(/Export CSV/i)).not.toBeInTheDocument();
    });
});

describe('More Tests for GridGlobalSearchBar', () => {
    const setState = jest.fn();
    const searchHandler = jest.fn();
    const handleResetGrid = jest.fn();
    const onDownloadComplete = jest.fn();

    const defaultProps = {
        searchHandler,
        handleResetGrid
    };
    const mockState = {
        enableGlobalSearch: true,
        globalSearchInput: '',
        columns: [{ name: 'name' }],
        enableDownload: true,
        rowsData: [{ id: 1, name: 'A' }],
        downloadFilename: 'file.csv',
        onDownloadComplete,
        showResetButton: true,
        gridID: 'testID'
    };

    const renderWithProvider = (ui, stateOverrides = {}) =>
        render(
            <GridConfigContext.Provider value={{ state: { ...mockState, ...stateOverrides }, setState: setState }}>
                {ui}
            </GridConfigContext.Provider>
        );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders global search input when enabled', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />);
        expect(screen.getByPlaceholderText('Search all columns…')).toBeInTheDocument();
    });

    it('does not render global search input when disabled', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />, { enableGlobalSearch: false });
        expect(screen.queryByPlaceholderText('Search all columns…')).toBeNull();
    });

    it('calls setState and searchHandler on input change', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />);
        const input = screen.getByPlaceholderText('Search all columns…');

        fireEvent.change(input, { target: { value: 'hello' } });

        expect(setState).toHaveBeenCalled();
        expect(searchHandler).toHaveBeenCalled();
    });

    it('calls handleResetGrid on reset button click', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />);
        const resetBtn = screen.getByTitle('Reset Filters');

        fireEvent.click(resetBtn);

        expect(handleResetGrid).toHaveBeenCalled();
    });

    it('calls handleResetGrid on reset button key press Enter and Space', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />);
        const resetBtn = screen.getByTitle('Reset Filters');

        fireEvent.keyDown(resetBtn, { key: 'Enter' });
        fireEvent.keyDown(resetBtn, { key: ' ' });

        expect(handleResetGrid).toHaveBeenCalledTimes(2);
    });

    it('renders download button when enabled', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />);
        expect(screen.getByTitle(/Export CSV/i)).toBeInTheDocument();
    });

    it('does not render download button when disabled', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />, { enableDownload: false });
        expect(screen.queryByTitle(/Export CSV/i)).toBeNull();
    });

    it('download button triggers click and keyboard events', () => {
        renderWithProvider(<GridGlobalSearchBar {...defaultProps} />);
        const downloadBtn = screen.getByTitle(/Export CSV/i);

        fireEvent.click(downloadBtn);
        fireEvent.keyDown(downloadBtn, { key: 'Enter' });
        fireEvent.keyDown(downloadBtn, { key: ' ' });
    });

    it('download button is disabled and semi-transparent when no data', () => {
        const props = {
            ...defaultProps
        };
        renderWithProvider(<GridGlobalSearchBar {...props} />, {
            rowsData: [],
            columns: null
        });
        const downloadBtn = screen.getByTitle(/Export CSV/i);
        expect(downloadBtn).toHaveStyle('pointer-events: none');
        expect(downloadBtn).toHaveStyle('opacity: 0.5');
    });

    it('does not call handleResetGrid on other key presses', () => {
        renderWithProvider(
            <GridGlobalSearchBar
                {...defaultProps}
            />
        );

        const resetBtn = screen.getByTitle('Reset Filters');
        fireEvent.keyDown(resetBtn, { key: 'Escape' });
        fireEvent.keyDown(resetBtn, { key: 'Tab' });
        fireEvent.keyDown(resetBtn, { key: 'a' });
        expect(handleResetGrid).not.toHaveBeenCalled();

        const downloadBtn = screen.getByTitle(/Export CSV/i);
        fireEvent.keyDown(downloadBtn, { key: 'Escape' });
        fireEvent.keyDown(downloadBtn, { key: 'Tab' });
        fireEvent.keyDown(downloadBtn, { key: 'a' });
    });
});

describe('GridGlobalSearchBar else path for searchHandler', () => {
    it('should NOT call searchHandler when it is not a function', () => {
        const setState = jest.fn();
        const defaultProps = {
            searchHandler: null,
            handleResetGrid: () => { }
        };

        const mockState = {
            enableGlobalSearch: true,
            globalSearchInput: "",
            columns: [{ name: 'name' }],
            enableDownload: false,
            rowsData: [{ id: 1, name: 'test' }],
            downloadFilename: "test.csv",
            onDownloadComplete: () => { },
            gridID:'testID'
        };

        const renderWithProvider = (ui, stateOverrides = {}) =>
            render(
                <GridConfigContext.Provider value={{ state: { ...mockState, ...stateOverrides }, setState: setState }}>
                    {ui}
                </GridConfigContext.Provider>
            );

        renderWithProvider(
            <GridGlobalSearchBar
                {...defaultProps}
            />
        );

        const input = screen.getByPlaceholderText('Search all columns…');
        fireEvent.change(input, { target: { value: 'test' } });
        expect(setState).toHaveBeenCalled();
    });
});

describe('GridGlobalSearchBar setState coverage', () => {
    it('calls setState with updater that sets globalSearchInput', () => {
        const setState = jest.fn();
        const defaultProps = {
            searchHandler: undefined,
            handleResetGrid: () => { }
        };
        const mockState = {
            enableGlobalSearch: true,
            globalSearchInput: "",
            columns: [{ name: 'name' }],
            enableDownload: false,
            rowsData: [{ id: 1, name: 'Row' }],
            downloadFilename: "test.csv",
            onDownloadComplete: () => { }
        };

        const renderWithProvider = (ui, stateOverrides = {}) =>
            render(
                <GridConfigContext.Provider value={{ state: { ...mockState, ...stateOverrides }, setState: setState }}>
                    {ui}
                </GridConfigContext.Provider>
            );
        renderWithProvider(
            <GridGlobalSearchBar
                {...defaultProps}
            />
        );
        const input = screen.getByPlaceholderText('Search all columns…');
        fireEvent.change(input, { target: { value: 'hello' } });
        expect(setState).toHaveBeenCalled();
        const updater = setState.mock.calls[0][0];
        const updated = updater({ globalSearchInput: '', something: 'else' });
        expect(updated.globalSearchInput).toBe('');
    });
});

describe('GridGlobalSearchBar (AI Search Button)', () => {
    const setup = (aiEnabled = true) => {
        const setState = jest.fn();
        const mockState = {
            enableGlobalSearch: true,
            globalSearchInput: '',
            columns: [{ name: 'name' }],
            rowsData: [{ name: 'Alice' }],
            downloadFilename: 'file.csv',
            aiSearchOptions: {
                enabled: aiEnabled,
                minRowCount: 1
            },
            showResetButton: false
        };

        const searchHandler = jest.fn();
        const handleResetGrid = jest.fn();

        const utils = render(
            <GridConfigContext.Provider value={{ state: { ...mockState }, setState: setState }}>
                <GridGlobalSearchBar
                    searchHandler={searchHandler}
                    handleResetGrid={handleResetGrid}
                />
            </GridConfigContext.Provider>
        );

        return {
            ...utils,
            searchHandler
        };
    };

    it('renders AI search button and triggers searchHandler on click', () => {
        const { getByTitle, searchHandler } = setup(true);

        const aiButton = getByTitle('Run AI Search');
        expect(aiButton).toBeInTheDocument();

        fireEvent.click(aiButton);

        expect(searchHandler).toHaveBeenCalledWith(
            expect.any(Object),
            '##globalSearch##',
            [{ name: 'name' }],
            null,
            false
        );
    });

    it('does not render AI search button if AI search is disabled', () => {
        const { queryByTitle } = setup(false);
        expect(queryByTitle('Run AI Search')).not.toBeInTheDocument();
    });
});