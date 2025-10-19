import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { eventExportToCSV } from '../../../src/components/events/event-export-csv-clicked';
import GridToolBarMenu from '../../../src/components/grid-toolbar-menu';
import { Export_To_CSV_Text } from '../../../src/constants';
import { useGridConfig } from '../../../src/hooks/use-grid-config';
import { hideLoader, showLoader } from '../../../src/utils/loading-utils';

jest.mock('../../../src/hooks/use-grid-config');
jest.mock('../../../src/components/events/event-export-csv-clicked', () => ({
    eventExportToCSV: jest.fn(),
}));

jest.mock('../../../src/utils/loading-utils', () => ({
    hideLoader: jest.fn(),
    showLoader: jest.fn()
}));

describe('GridToolBarMenu', () => {
    const defaultState = {
        columns: [
            { name: 'col1', alias: 'Column 1', hideable: true, hidden: false },
            { name: 'col2', hideable: false, hidden: false },
        ],
        rowsData: [{ id: 1, col1: 'A', col2: 'B' }],
        downloadFilename: 'file.csv',
        onDownloadComplete: jest.fn(),
        showResetMenuItem: true,
        isCSVExportUIButton: false,
        enableDownload: true,
    };

    const containerDiv = document.createElement('div');

    beforeEach(() => {
        containerDiv.className = 'react-data-grid-lite';
        document.body.appendChild(containerDiv);
    });

    afterEach(() => {
        document.body.removeChild(containerDiv);
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    const setup = (customState = {}, props = {}) => {
        const mockSetState = jest.fn();
        useGridConfig.mockReturnValue({
            state: { ...defaultState, ...customState },
            setState: mockSetState,
        });

        const handleResetGrid = jest.fn();

        const { getByLabelText } = render(
            <GridToolBarMenu handleResetGrid={handleResetGrid}
                {...props} />,
            {
                container: containerDiv,
            }
        );
        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        return { mockSetState, handleResetGrid };
    };

    it('renders "Reset filters" when showResetMenuItem is true and calls handler', () => {
        const { handleResetGrid } = setup();

        const resetButton = screen.getByText('Reset filters');
        expect(resetButton).toBeInTheDocument();

        fireEvent.click(resetButton);
        expect(handleResetGrid).toHaveBeenCalled();
    });

    it('does not render "Reset filters" when showResetMenuItem is false', () => {
        setup({ showResetMenuItem: false });

        expect(screen.queryByText('Reset filters')).not.toBeInTheDocument();
    });

    it('renders "Export to CSV" and calls eventExportToCSV with correct arguments', () => {
        setup();

        const exportButton = screen.getByText(Export_To_CSV_Text);
        expect(exportButton).toBeInTheDocument();

        fireEvent.click(exportButton);
        expect(eventExportToCSV).toHaveBeenCalledWith(
            defaultState.rowsData,
            defaultState.columns,
            defaultState.downloadFilename,
            defaultState.onDownloadComplete,
            expect.anything()
        );
    });

    it('does not render "Export to CSV" when enableDownload is false', () => {
        setup({ enableDownload: false });
        expect(screen.queryByText(Export_To_CSV_Text)).not.toBeInTheDocument();
    });

    it('does not render "Export to CSV" when isCSVExportUIButton is true', () => {
        setup({ isCSVExportUIButton: true });
        expect(screen.queryByText(Export_To_CSV_Text)).not.toBeInTheDocument();
    });

    it('renders column visibility subitems and toggles hideable flag on click', () => {
        const { mockSetState } = setup();

        const columnVisibilityButton = screen.getByText('Column Visibility');
        expect(columnVisibilityButton).toBeInTheDocument();

        fireEvent.click(columnVisibilityButton);

        const columnItem = screen.getByText('Column 1');
        expect(columnItem).toBeInTheDocument();

        fireEvent.click(columnItem);

        expect(mockSetState).toHaveBeenCalled();
        const updateFn = mockSetState.mock.calls[0][0];

        const result = updateFn({
            columns: [
                { name: 'col1', hideable: true },
                { name: 'col2', hideable: false },
            ]
        });

        expect(result.columns[0].hideable).toBe(false);
        expect(result.columns[1].hideable).toBe(false);
    });

    it('does not crash when useGridConfig returns null', () => {
        useGridConfig.mockReturnValue(null);

        const handleResetGrid = jest.fn();

        const { getByLabelText } = render(
            <GridToolBarMenu handleResetGrid={handleResetGrid} />,
            {
                container: containerDiv,
            }
        );
        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        expect(screen.getByText('Column Visibility')).toBeInTheDocument();
    });

    it('does not crash when state, setState is null', () => {
        useGridConfig.mockReturnValue({
            state: null
        });

        const handleResetGrid = jest.fn();

        const { getByLabelText } = render(
            <GridToolBarMenu handleResetGrid={handleResetGrid} />,
            {
                container: containerDiv,
            }
        );
        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        expect(screen.getByText('Column Visibility')).toBeInTheDocument();
    });
});

describe('GridToolBarMenu - Show All column toggle', () => {
    const mockSetState = jest.fn();
    const defaultProps = {
        handleResetGrid: jest.fn(),
        vertical: false,
        borderRadius: '4px',
        noBorder: false,
        height: '100%',
        top: '10px',
        boxShadow: '0 0 10px #ccc',
        padding: '10px',
        searchColsRef: { current: [] },
        globalSearchQueryRef: { current: '' }
    };

    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
    });

    it('toggles hideable state of columns and calls loader utils', () => {
        const initialColumns = [
            { name: 'col1', alias: 'Column 1', hidden: false, hideable: false },
            { name: 'col2', alias: 'Column 2', hidden: false, hideable: false },
            { name: 'col3', alias: 'Column 3', hidden: true, hideable: true }
        ];

        useGridConfig.mockReturnValue({
            state: {
                columns: initialColumns,
                rowsData: [],
                gridID: 'grid-abc',
                showResetMenuItem: true,
                isCSVExportUIButton: false,
                enableDownload: false,
                transposeColumnName: null,
                columnsReceived: [],
                showTransposeMenuItem: false,
                showAboutMenuItem: false
            },
            setState: mockSetState
        });

        const { getByLabelText } = render(<GridToolBarMenu {...defaultProps} />);
        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        const columnVisibility = screen.getByText('Column Visibility');
        fireEvent.click(columnVisibility);

        const toggleItem = screen.getByText('Show All');
        fireEvent.click(toggleItem);

        expect(hideLoader).toHaveBeenCalledWith('grid-abc');
        expect(showLoader).toHaveBeenCalledWith('grid-abc');

        jest.runAllTimers();

        expect(mockSetState).toHaveBeenCalledTimes(1);
        const stateUpdater = mockSetState.mock.calls[0][0];

        const updatedState = stateUpdater({ columns: initialColumns });
        expect(updatedState.columns).toEqual([
            { name: 'col1', alias: 'Column 1', hidden: false, hideable: true },
            { name: 'col2', alias: 'Column 2', hidden: false, hideable: true },
            { name: 'col3', alias: 'Column 3', hidden: true, hideable: true }
        ]);
    });
});

describe('GridToolBarMenu', () => {
    const mockSetState = jest.fn();
    const defaultProps = {
        handleResetGrid: jest.fn(),
        vertical: false,
        borderRadius: '4px',
        noBorder: false,
        height: '100%',
        top: '10px',
        boxShadow: '0 0 10px #ccc',
        padding: '10px',
        searchColsRef: { current: [] },
        globalSearchQueryRef: { current: '' }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const setup = (stateOverrides = {}) => {
        useGridConfig.mockReturnValue({
            state: {
                columns: [
                    { name: 'col1', alias: 'Column 1', hidden: false, hideable: false },
                    { name: 'col2', alias: 'Column 2', hidden: false, hideable: false },
                ],
                rowsData: [{ col1: 'value1', col2: 'value2' }],
                downloadFilename: 'test.csv',
                onDownloadComplete: jest.fn(),
                showResetMenuItem: true,
                isCSVExportUIButton: false,
                enableDownload: true,
                transposeColumnName: null,
                columnsReceived: [
                    { name: 'col1', alias: 'Column 1', hidden: false },
                    { name: 'col2', alias: 'Column 2', hidden: false }
                ],
                showTransposeMenuItem: true,
                showAboutMenuItem: true,
                gridID: 'grid123',
                ...stateOverrides
            },
            setState: mockSetState,
        });

        const { getByLabelText } = render(<GridToolBarMenu {...defaultProps} />);
        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);
    };

    it('renders Reset filters and Export to CSV items', () => {
        setup();

        expect(screen.getByText('Reset filters')).toBeInTheDocument();
        expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });

    it('calls handleResetGrid when Reset filters clicked', () => {
        setup();

        fireEvent.click(screen.getByText('Reset filters'));
        expect(defaultProps.handleResetGrid).toHaveBeenCalled();
    });

    it('calls eventExportToCSV with correct args', () => {
        setup();

        fireEvent.click(screen.getByText('Export CSV'));
        const callArgs = eventExportToCSV.mock.calls[0];

        expect(callArgs.slice(0, 4)).toEqual([
            [{ col1: 'value1', col2: 'value2' }],
            expect.any(Array),
            'test.csv',
            expect.any(Function),
        ]);
    });

    it('does not call export if no data', () => {
        setup({
            rowsData: [],
        });

        const exportBtn = screen.queryByText('Export CSV');
        if (exportBtn) {
            fireEvent.click(exportBtn);
        }

        expect(eventExportToCSV).not.toHaveBeenCalled();
    });

    it('hides Reset filters if showResetMenuItem is false', () => {
        setup({ showResetMenuItem: false });

        expect(screen.queryByText('Reset filters')).not.toBeInTheDocument();
    });

    it('shows About section items', () => {
        setup();
        const about = screen.queryByText('About');
        fireEvent.click(about);
        expect(screen.getByText('Grid Version: 1.2.5')).toBeInTheDocument();
        expect(screen.getByText('License: MIT')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
    });
});

describe('GridToolBarMenu – Transpose action', () => {
    const mockSetState = jest.fn();
    const defaultProps = {
        handleResetGrid: jest.fn(),
        vertical: false,
        borderRadius: '4px',
        noBorder: false,
        height: '100%',
        top: '10px',
        boxShadow: '0 0 10px #ccc',
        padding: '10px',
        searchColsRef: { current: [] },
        globalSearchQueryRef: { current: '' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const setup = (stateOverrides = {}) => {
        useGridConfig.mockReturnValue({
            state: {
                columns: [
                    { name: 'col1', alias: 'Column 1', hidden: false, hideable: false },
                    { name: 'col2', hidden: false, hideable: false },
                ],
                rowsData: [{ col1: 'a', col2: 'b' }],
                transposeColumnName: null,
                enableCellEditProp: true,
                enableRowSelectionProp: true,
                deleteButtonEnabledProp: true,
                editButtonEnabledProp: true,
                columnsReceived: [
                    { name: 'col1', alias: 'Column 1', hidden: false },
                    { name: 'col2', hidden: false }
                ],
                showTransposeMenuItem: true,
                showAboutMenuItem: false,
                showResetMenuItem: false,
                isCSVExportUIButton: false,
                enableDownload: false,
                downloadFilename: '',
                onDownloadComplete: null,
                gridID: 'grid-1',
                ...stateOverrides
            },
            setState: mockSetState,
        });

        return render(<GridToolBarMenu {...defaultProps} />);
    };

    it('sets transposeColumnName and resets search refs', async () => {
        const searchColsRef = defaultProps.searchColsRef;
        const globalSearchQueryRef = defaultProps.globalSearchQueryRef;

        searchColsRef.current = ['something'];
        globalSearchQueryRef.current = 'searchTerm';

        setup();

        const menuButton = screen.getByRole('button', { name: /open menu/i });
        fireEvent.click(menuButton);

        const transposeMenuLabel = await screen.findByText(/Transpose By/i);
        fireEvent.click(transposeMenuLabel);

        const col1Item = await screen.findByText('Column 1');
        fireEvent.click(col1Item);

        expect(mockSetState).toHaveBeenCalledTimes(1);

        const stateUpdater = mockSetState.mock.calls[0][0];

        const prevState = {
            transposeColumnName: null,
            enableCellEditProp: true,
            enableRowSelectionProp: true,
            deleteButtonEnabledProp: true,
            editButtonEnabledProp: true,
            columns: [
                { name: 'col1', alias: 'Column 1', hidden: false },
                { name: 'col2', hidden: false }
            ]
        };

        const newState = stateUpdater(prevState);

        expect(newState.transposeColumnName).toBe('col1');

        expect(newState.enableCellEdit).toBe(false);
        expect(newState.enableRowSelection).toBe(false);
        expect(newState.deleteButtonEnabled).toBe(false);
        expect(newState.editButtonEnabled).toBe(false);

        expect(newState.searchValues).toEqual({});
        expect(newState.globalSearchInput).toBe('');

        expect(searchColsRef.current).toEqual([]);
        expect(globalSearchQueryRef.current).toBe('');
    });

    it('toggles off transpose if clicking same column', async () => {
        setup({ transposeColumnName: 'col2' });

        const menuButton = screen.getByRole('button', { name: /open menu/i });
        fireEvent.click(menuButton);

        const transposeMenuLabel = await screen.findByText(/Transpose By/i);
        fireEvent.click(transposeMenuLabel);

        const col2Item = await screen.findByText('col2');
        fireEvent.click(col2Item);

        expect(mockSetState).toHaveBeenCalledTimes(1);
        const updater = mockSetState.mock.calls[0][0];

        const prevState = {
            transposeColumnName: 'col2',
            enableCellEditProp: true,
            enableRowSelectionProp: true,
            deleteButtonEnabledProp: true,
            editButtonEnabledProp: true,
            columns: [
                { name: 'col1', alias: 'Column 1', hidden: false },
                { name: 'col2', hidden: false }
            ]
        };

        const nextState = updater(prevState);

        expect(nextState.transposeColumnName).toBeNull();

        expect(nextState.enableCellEdit).toBe(prevState.enableCellEditProp);
        expect(nextState.enableRowSelection).toBe(prevState.enableRowSelectionProp);
        expect(nextState.deleteButtonEnabled).toBe(prevState.deleteButtonEnabledProp);
        expect(nextState.editButtonEnabled).toBe(prevState.editButtonEnabledProp);

        expect(nextState.searchValues).toEqual({});
        expect(nextState.globalSearchInput).toBe('');

    });
});

describe('GridToolBarMenu — Column Visibility "Show All" toggle logic', () => {
    const mockSetState = jest.fn();
    const defaultProps = {
        handleResetGrid: jest.fn(),
        vertical: false,
        borderRadius: '4px',
        noBorder: false,
        height: '100%',
        top: '10px',
        boxShadow: '0 0 10px #ccc',
        padding: '10px',
        searchColsRef: { current: [] },
        globalSearchQueryRef: { current: '' }
    };

    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
    });

    const setup = (stateOverrides = {}) => {
        useGridConfig.mockReturnValue({
            state: {
                columns: [
                    { name: 'col1', alias: 'Column 1', hidden: false, hideable: false },
                    { name: 'col2', alias: 'Column 2', hidden: false, hideable: true }
                ],
                rowsData: [],
                showResetMenuItem: true,
                isCSVExportUIButton: false,
                enableDownload: false,
                transposeColumnName: null,
                columnsReceived: [],
                showTransposeMenuItem: false,
                showAboutMenuItem: false,
                gridID: 'grid-xyz',
                ...stateOverrides
            },
            setState: mockSetState
        });

        render(<GridToolBarMenu {...defaultProps} />);
    };

    it('updates only the column whose hideable differs from shouldHide and leaves others unchanged', () => {
        setup();

        const button = screen.getByRole('button', { name: /open menu/i });
        fireEvent.click(button);

        const colVis = screen.getByText(/Column Visibility/i);
        fireEvent.click(colVis);

        const showAll = screen.getByText('Show All');
        fireEvent.click(showAll);

        expect(hideLoader).toHaveBeenCalledWith('grid-xyz');
        expect(showLoader).toHaveBeenCalledWith('grid-xyz');

        jest.runAllTimers();

        expect(mockSetState).toHaveBeenCalledTimes(1);
        const updater = mockSetState.mock.calls[0][0];

        const prev = {
            columns: [
                { name: 'col1', hideable: false, hidden: false },
                { name: 'col2', hideable: true, hidden: false }
            ]
        };

        const next = updater(prev);

        expect(next.columns.length).toBe(2);

        const [nc1, nc2] = next.columns;

        expect(nc1.hideable).toBe(false);
        expect(nc2.hideable).toBe(false);

        expect(nc2).not.toBe(prev.columns[1]);
        expect(nc1).toBe(prev.columns[0]);
    });
});