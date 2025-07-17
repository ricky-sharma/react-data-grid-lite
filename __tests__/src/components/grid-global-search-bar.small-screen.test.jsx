jest.resetModules();

jest.mock('./../../../src/hooks/use-window-width', () => ({
	useWindowWidth: jest.fn(() => 400),
}));

import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { GridConfigContext } from '../../../src/context/grid-config-context';
import GridGlobalSearchBar from './../../../src/components/grid-global-search-bar';

afterEach(() => {
	jest.clearAllMocks();
	jest.resetAllMocks();
	cleanup();
});

describe('GridGlobalSearchBar (small screen)', () => {
	it('hides Export_To_CSV_Text on small screens', () => {
		const mockState = {
			enableGlobalSearch: true,
			globalSearchInput: '',
			gridID: '1',
			columns: [{ name: 'col1' }],
			enableDownload: true,
			rowsData: [{ col1: 'value1' }],
			downloadFilename: 'my-data',
			onDownloadComplete: jest.fn(),
			showResetButton: true,
		};

		const mockSetState = jest.fn();

		render(
			<GridConfigContext.Provider value={{ state: mockState, setState: mockSetState }}>
				<GridGlobalSearchBar onSearchClicked={jest.fn()} handleResetSearch={jest.fn()} />
			</GridConfigContext.Provider>
		);

		const exportDiv = screen.getByTitle(/Export CSV/i);
		expect(exportDiv).toBeInTheDocument();
		expect(exportDiv.textContent).not.toMatch(/Export To CSV/i);
		expect(exportDiv.textContent.trim()).toBe('');
	});
});
