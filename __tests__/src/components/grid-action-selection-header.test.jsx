import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import GridActionSelectionHeader from '../../../src/components/grid-action-selection-header';
import { Button_Column_Key, Selection_Column_Key } from '../../../src/constants';

describe('GridActionSelectionHeader', () => {
    const baseProps = {
        keyIndex: 0,
        isActionColumnLeft: false,
        isActionColumnRight: false,
        isSelectionColumnLeft: false,
        isSelectionColumnRight: false,
        isMobile: false,
        enableRtl: false,
        setState: jest.fn(),
        onSelectAll: jest.fn(),
    };

    const stateWithRows = {
        selectedRows: [1, 2],
        firstRow: 0,
        currentPageRows: 2,
        rowsData: [
            { __$index__: 1 },
            { __$index__: 2 }
        ]
    };

    const stateWithPartialSelection = {
        selectedRows: [1],
        firstRow: 0,
        currentPageRows: 2,
        rowsData: [
            { __$index__: 1 },
            { __$index__: 2 }
        ]
    };

    it('renders button column header with ActionIcon', () => {
        render(
            <table>
                <thead>
                    <tr>
                        <GridActionSelectionHeader
                            {...baseProps}
                            header={Button_Column_Key}
                            state={stateWithRows}
                        />
                    </tr>
                </thead>
            </table>
        );

        expect(screen.getByRole('columnheader')).toHaveAttribute('title', 'Actions');
        expect(screen.getByRole('columnheader')).toHaveAttribute('aria-label', 'Actions');
        expect(screen.getByRole('columnheader').querySelector('svg')).toBeInTheDocument();
    });

    it('renders selection column header with checkbox selected', () => {
        render(
            <table>
                <thead>
                    <tr>
                        <GridActionSelectionHeader
                            {...baseProps}
                            header={Selection_Column_Key}
                            state={stateWithRows}
                        />
                    </tr>
                </thead>
            </table>
        );

        const checkbox = screen.getByRole('checkbox');
        expect(screen.getByRole('columnheader')).toHaveAttribute('title', 'Select all rows');
        expect(checkbox).toBeChecked();
    });

    it('renders selection column header with checkbox unselected', () => {
        render(
            <table>
                <thead>
                    <tr>
                        <GridActionSelectionHeader
                            {...baseProps}
                            header={Selection_Column_Key}
                            state={stateWithPartialSelection}
                        />
                    </tr>
                </thead>
            </table>
        );

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
    });

    it('triggers handleHeaderSelectAllChange on checkbox change', () => {
        const setStateMock = jest.fn();
        const onSelectAllMock = jest.fn();

        render(
            <table>
                <thead>
                    <tr>
                        <GridActionSelectionHeader
                            {...baseProps}
                            header={Selection_Column_Key}
                            state={stateWithRows}
                            setState={setStateMock}
                            onSelectAll={onSelectAllMock}
                        />
                    </tr>
                </thead>
            </table>
        );

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(setStateMock).toHaveBeenCalled();
        expect(onSelectAllMock).toHaveBeenCalled();
    });

    it('renders visual span when column is aligned to left', () => {
        render(
            <table>
                <thead>
                    <tr>
                        <GridActionSelectionHeader
                            {...baseProps}
                            header={Button_Column_Key}
                            state={stateWithRows}
                            isActionColumnLeft={true}
                        />
                    </tr>
                </thead>
            </table>
        );

        expect(screen.getByRole('columnheader').querySelector('span')).toBeInTheDocument();
    });
});

describe('GridActionSelectionHeader – span condition for Selection_Column_Key on right', () => {
    const baseProps = {
        keyIndex: 0,
        isActionColumnLeft: false,
        isSelectionColumnLeft: false,
        isActionColumnRight: true,
        isSelectionColumnRight: true,
        isMobile: false,
        enableRtl: false,
        setState: jest.fn(),
        onSelectAll: jest.fn(),
        header: Selection_Column_Key,
        state: {
            selectedRows: [],
            firstRow: 0,
            currentPageRows: 0,
            rowsData: []
        }
    };

    it('does not render <span> if header !== Selection_Column_Key', () => {
        render(
            <table>
                <thead>
                    <tr>
                        <GridActionSelectionHeader
                            {...baseProps}
                            header="Some_Other_Header"
                        />
                    </tr>
                </thead>
            </table>
        );

        const span = screen.getByRole('columnheader').querySelector('span');
        expect(span).not.toBeInTheDocument();
    });
});
