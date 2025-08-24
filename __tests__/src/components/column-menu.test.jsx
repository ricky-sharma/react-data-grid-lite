import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ColumnMenu from '../../../src/components/column-menu';
import { useGridConfig } from '../../../src/hooks/use-grid-config';
import { SortColumn } from '../../../src/components/events/event-grid-header-clicked';

jest.mock('../../../src/hooks/use-grid-config');
jest.mock('../../../src/components/events/event-grid-header-clicked', () => ({
    SortColumn: jest.fn().mockResolvedValue([])
}));

describe('ColumnMenu Component', () => {
    let mockSetState;

    const mockColumn = {
        name: 'testColumn',
        alias: 'Test Column',
        sortOrder: '',
        concatColumns: {
            columns: ['testColumn']
        }
    };

    const containerDiv = document.createElement('div');

    beforeEach(() => {
        jest.useFakeTimers();
        mockSetState = jest.fn();
        useGridConfig.mockReturnValue({
            state: {
                rowsData: [],
                columns: [mockColumn],
                toggleState: false,
                gridID: 'testGrid',
                showToolbarMenu: true
            },
            setState: mockSetState
        });
        containerDiv.className = 'react-data-grid-lite';
        document.body.appendChild(containerDiv);
    });

    afterEach(() => {
        document.body.removeChild(containerDiv);
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it('renders menu items correctly after opening the menu', async () => {
        const { getByLabelText } = render(
            <ColumnMenu column={mockColumn} sortable={true} />,
            {
                container: containerDiv,
            }
        );
        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        await waitFor(() => {
            expect(screen.getByText('Hide column')).toBeInTheDocument();
            expect(screen.getByText('Sort ascending')).toBeInTheDocument();
            expect(screen.getByText('Sort descending')).toBeInTheDocument();
        });
    });

    it('hides column on Hide click', async () => {
        const mockColumn = {
            name: 'testColumn',
            sortOrder: ''
        };
        const { getByLabelText } = render(
            <ColumnMenu column={mockColumn} sortable={true} />,
            {
                container: containerDiv,
            }
        );
        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        fireEvent.click(screen.getByText('Hide column'));
        await waitFor(() => {
            expect(mockSetState).toHaveBeenCalled();
        });
    });

    it('calls SortColumn on Sort Ascending click', async () => {
        const mockRowsData = [{ id: 1 }, { id: 2 }];
        const sortedData = [{ id: 2 }, { id: 1 }];
        SortColumn.mockResolvedValue(sortedData);
        const state = {
            rowsData: mockRowsData,
            columns: [mockColumn],
            toggleState: false,
            gridID: 'testGrid',
            showToolbarMenu: true
        }

        useGridConfig.mockReturnValue({
            state,
            setState: mockSetState
        });

        const { getByLabelText } = render(
            <ColumnMenu column={mockColumn} sortable={true} />,
            { container: containerDiv }
        );

        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        fireEvent.click(await screen.findByText('Sort ascending'));

        await waitFor(() => {
            expect(SortColumn).toHaveBeenCalledWith(state, mockSetState, 'testColumn', ['testColumn'], 'asc');
        });
    });

    it('calls SortColumn on Sort Ascending click without concat columns', async () => {
        const mockColumn = {
            name: 'testColumn',
            sortOrder: ''
        };
        const mockRowsData = [{ id: 1 }, { id: 2 }];
        const sortedData = [{ id: 2 }, { id: 1 }];
        SortColumn.mockResolvedValue(sortedData);

        const state = {
            rowsData: mockRowsData,
            columns: [mockColumn],
            toggleState: false,
            gridID: 'testGrid',
            showToolbarMenu: true
        }

        useGridConfig.mockReturnValue({
            state,
            setState: mockSetState
        });

        const { getByLabelText } = render(
            <ColumnMenu column={mockColumn} sortable={true} />,
            { container: containerDiv }
        );

        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        fireEvent.click(await screen.findByText('Sort ascending'));

        await waitFor(() => {
            expect(SortColumn).toHaveBeenCalledWith(state, mockSetState, 'testColumn', ['testColumn'], 'asc');
        });
    });

    it('does not sort if already sorted in asc order', async () => {
        const sortedColumn = { ...mockColumn, sortOrder: 'asc' };
        const { getByLabelText } = render(
            <ColumnMenu column={sortedColumn} sortable={true} />,
            {
                container: containerDiv,
            }
        );
        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);
        fireEvent.click(screen.getByText('Sort ascending'));

        await waitFor(() => {
            expect(SortColumn).not.toHaveBeenCalled();
        });
    });

    it('calls SortColumn on Sort Descending click', async () => {
        const mockRowsData = [{ id: 1 }, { id: 2 }];
        const sortedData = [{ id: 1 }, { id: 2 }];
        SortColumn.mockResolvedValue(sortedData);

        const state = {
            rowsData: mockRowsData,
            columns: [mockColumn],
            toggleState: false,
            gridID: 'testGrid',
            showToolbarMenu: true
        }

        useGridConfig.mockReturnValue({
            state,
            setState: mockSetState
        });

        const { getByLabelText } = render(
            <ColumnMenu column={mockColumn} sortable={true} />,
            { container: containerDiv }
        );

        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        fireEvent.click(await screen.findByText('Sort descending'));

        await waitFor(() => {
            expect(SortColumn).toHaveBeenCalledWith(state, mockSetState, 'testColumn', ['testColumn'], 'desc');
        });
    });

    it('calls SortColumn on Sort Descending click without concat columns', async () => {
        const mockColumn = {
            name: 'testColumn',
            sortOrder: ''
        };
        const mockRowsData = [{ id: 1 }, { id: 2 }];
        const sortedData = [{ id: 1 }, { id: 2 }];
        SortColumn.mockResolvedValue(sortedData);

        const state = {
            rowsData: mockRowsData,
            columns: [mockColumn],
            toggleState: false,
            gridID: 'testGrid',
            showToolbarMenu: true
        }

        useGridConfig.mockReturnValue({
            state,
            setState: mockSetState
        });

        const { getByLabelText } = render(
            <ColumnMenu column={mockColumn} sortable={true} />,
            { container: containerDiv }
        );

        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        fireEvent.click(await screen.findByText('Sort descending'));

        await waitFor(() => {
            expect(SortColumn).toHaveBeenCalledWith(state, mockSetState, 'testColumn', ['testColumn'], 'desc');
        });
    });

    it('does not sort if already sorted in desc order', async () => {
        const sortedColumn = { ...mockColumn, sortOrder: 'desc' };
        const { getByLabelText } = render(
            <ColumnMenu column={sortedColumn} sortable={true} />,
            {
                container: containerDiv,
            }
        );
        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);
        fireEvent.click(screen.getByText('Sort descending'));
        await waitFor(() => {
            expect(SortColumn).not.toHaveBeenCalled();
        });
    });

    it('does not show sort options when sortable is false', async () => {
        useGridConfig.mockReturnValue({
            state: null,
            setState: null
        });

        const { getByLabelText } = render(
            <ColumnMenu column={mockColumn} sortable={false} />,
            {
                container: containerDiv,
            }
        );
        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        await waitFor(() => {
            expect(screen.queryByText('Sort ascending')).not.toBeInTheDocument();
            expect(screen.queryByText('Sort descending')).not.toBeInTheDocument();
        });
    });

    it('toggles column hideable on Hide click', async () => {
        const mockColumn = {
            name: 'testColumn',
            alias: 'Test Column',
            hideable: false,
        };

        const mockColumns = [{
            name: 'testColumn',
            alias: 'Test Column',
            hideable: false,
            sortOrder: ''
        },
        {
            name: 'testColumn2',
            alias: 'Test Column2',
            sortOrder: '',
            concatColumns: {
                columns: ['testColumn2']
            }
        }];

        useGridConfig.mockReturnValue({
            state: {
                rowsData: [],
                columns: mockColumns,
                toggleState: false,
                gridID: 'testGrid',
                showToolbarMenu: true
            },
            setState: jest.fn()
        });

        const { getByLabelText } = render(
            <ColumnMenu column={mockColumn} sortable={true} />,
            { container: containerDiv }
        );

        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        const hideItem = await screen.findByText('Hide column');
        fireEvent.click(hideItem);

        expect(useGridConfig().setState).toHaveBeenCalledWith(expect.any(Function));
        const prevState = {
            columns: [mockColumn],
            rowsData: [],
            toggleState: false
        };
        const nextState = useGridConfig().setState.mock.calls[0][0](prevState);
        expect(nextState.columns[0].hideable).toBe(true);
    });

    it('does not crash when useGridConfig returns null', () => {
        useGridConfig.mockReturnValue(null);

        const column = { name: 'testCol', alias: 'Test Column' };
        const { getByLabelText } = render(
            <ColumnMenu column={column} sortable={false} />,
            {
                container: containerDiv,
            }
        );
        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        expect(screen.getByText('Enable editing')).toBeInTheDocument();
        expect(screen.queryByText('Hide column')).not.toBeInTheDocument();
    });
});

describe('More ColumnMenu tests', () => {
    const baseColumn = {
        name: 'testCol',
        alias: 'Test Column',
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

    const setup = (columnOverrides = {}, sortable = true, stateOverrides = {}) => {
        const column = { ...baseColumn, ...columnOverrides };

        const mockSetState = jest.fn();
        const mockState = {
            enableCellEdit: false,
            columns: [{ name: 'testCol', editable: true, hideable: false }],
            showToolbarMenu: true,
            ...stateOverrides,
        };

        useGridConfig.mockReturnValue({
            state: mockState,
            setState: mockSetState,
        });

        const { getByLabelText } = render(
            <ColumnMenu column={column} sortable={sortable} />,
            { container: containerDiv }
        );

        const menuButton = getByLabelText('Open menu');
        fireEvent.click(menuButton);

        return { mockSetState };
    };

    it('renders all visible menu items when sortable is true', async () => {
        setup(
            { editable: true, alias: null },
            true,
            {
                columns: [
                    { name: 'testCol', editable: true, hideable: false },
                    { name: 'testCol2', editable: true, hideable: false }]
            });
        await waitFor(() => {
            expect(screen.getByText('Disable editing')).toBeInTheDocument();
            expect(screen.getByText('Hide column')).toBeInTheDocument();
            expect(screen.getByText('Sort ascending')).toBeInTheDocument();
            expect(screen.getByText('Sort descending')).toBeInTheDocument();
        });
    });

    it('renders without sort options when sortable is false', async () => {
        setup({}, false);
        await waitFor(() => {
            expect(screen.queryByText('Sort ascending')).not.toBeInTheDocument();
            expect(screen.queryByText('Sort descending')).not.toBeInTheDocument();
        });
    });

    it('calls setState to toggle editable on "Disable editing"', () => {
        const { mockSetState } = setup({ editable: true });

        const editButton = screen.getByText('Disable editing');
        fireEvent.click(editButton);

        expect(mockSetState).toHaveBeenCalled();
        const updateFn = mockSetState.mock.calls[0][0];
        const result = updateFn({
            columns: [{ name: 'testCol', editable: true }],
        });

        expect(result.columns[0].editable).toBe(false);
    });

    it('calls setState to toggle hideable on "Hide column"', () => {
        const { mockSetState } = setup(
            {},
            true,
            {
                columns: [
                    { name: 'testCol', editable: true, hideable: false },
                    { name: 'testCol2', editable: true, hideable: false }]
            });

        const hideButton = screen.getByText('Hide column');
        fireEvent.click(hideButton);

        expect(mockSetState).toHaveBeenCalled();
        const updateFn = mockSetState.mock.calls[0][0];
        const result = updateFn({
            columns: [{ name: 'testCol', hideable: false }],
        });

        expect(result.columns[0].hideable).toBe(true);
    });

    it('calls SortColumn for ascending sort', async () => {
        setup({ sortOrder: 'desc' });

        const ascSortButton = screen.getByText('Sort ascending');
        fireEvent.click(ascSortButton);
        await waitFor(() => {
            expect(SortColumn).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Function),
                'testCol',
                ['testCol'],
                'asc'
            );
        });
    });

    it('calls SortColumn for descending sort', async () => {
        setup({ sortOrder: 'asc' });

        const descSortButton = screen.getByText('Sort descending');
        fireEvent.click(descSortButton);
        await waitFor(() => {
            expect(SortColumn).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Function),
                'testCol',
                ['testCol'],
                'desc'
            );
        });
    });

    it('does not call SortColumn if already sorted asc', async () => {
        setup({ sortOrder: 'asc' });

        const ascSortButton = screen.getByText('Sort ascending');
        fireEvent.click(ascSortButton);
        await waitFor(() => {
            expect(SortColumn).not.toHaveBeenCalled();
        });
    });

    it('does not call SortColumn if already sorted desc', async () => {
        setup({ sortOrder: 'desc' });

        const descSortButton = screen.getByText('Sort descending');
        fireEvent.click(descSortButton);
        await waitFor(() => {
            expect(SortColumn).not.toHaveBeenCalled();
        });
    });

    it('uses alias in tooltip when present', () => {
        setup();
        const tooltip = screen.getByTitle('Enable "Test Column" column editing');
        expect(tooltip).toBeInTheDocument();
    });

    it('uses name in tooltip when alias not present', () => {
        setup({ alias: undefined });
        const tooltip = screen.getByTitle('Enable "TestCol" column editing');
        expect(tooltip).toBeInTheDocument();
    });

    it('only updates editable property for matching column', () => {
        const { mockSetState } = setup(
            { editable: true },
            true,
            {
                columns: [
                    { name: 'testCol', editable: true },
                    { name: 'otherCol', editable: true },
                ],
            }
        );

        const editButton = screen.getByText('Disable editing');
        fireEvent.click(editButton);

        expect(mockSetState).toHaveBeenCalled();

        const updaterFn = mockSetState.mock.calls[0][0];
        const updatedState = updaterFn({
            columns: [
                { name: 'testCol', editable: true },
                { name: 'otherCol', editable: true },
            ],
        });

        expect(updatedState.columns).toEqual([
            { name: 'testCol', editable: false },
            { name: 'otherCol', editable: true },
        ]);
    });

    it('only Hide the matching column', () => {
        const { mockSetState } = setup(
            { editable: true },
            true,
            {
                columns: [
                    { name: 'testCol', editable: true },
                    { name: 'otherCol', editable: true },
                ],
            }
        );

        const editButton = screen.getByText('Hide column');
        fireEvent.click(editButton);

        expect(mockSetState).toHaveBeenCalled();

        const updaterFn = mockSetState.mock.calls[0][0];
        const updatedState = updaterFn({
            columns: [
                { name: 'testCol', hideable: false },
                { name: 'otherCol', hideable: false },
            ],
        });

        expect(updatedState.columns).toEqual([
            { name: 'testCol', hideable: true },
            { name: 'otherCol', hideable: false },
        ]);
    });
});