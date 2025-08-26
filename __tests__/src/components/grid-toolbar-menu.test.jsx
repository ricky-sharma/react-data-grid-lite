import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GridToolBarMenu from '../../../src/components/grid-toolbar-menu';
import { useGridConfig } from '../../../src/hooks/use-grid-config';
import { eventExportToCSV } from '../../../src/components/events/event-export-csv-clicked';
import { Export_To_CSV_Text } from '../../../src/constants';

jest.mock('../../../src/hooks/use-grid-config');
jest.mock('../../../src/components/events/event-export-csv-clicked', () => ({
    eventExportToCSV: jest.fn(),
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

        const columnVisibilityButton = screen.getByText('Column visibility');
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
            <GridToolBarMenu handleResetGrid={handleResetGrid}/>,
            {
                container: containerDiv,
            }
        );
        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        expect(screen.getByText('Column visibility')).toBeInTheDocument();
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

        expect(screen.getByText('Column visibility')).toBeInTheDocument();
    });
});
