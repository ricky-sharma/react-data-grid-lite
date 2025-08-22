import React from 'react';
import { capitalize, isNull } from '../helpers/common';
import { useGridConfig } from '../hooks/use-grid-config';
import DownArrowIcon from '../icons/down-arrow-icon';
import HideViewIcon from '../icons/hideview-Icon';
import UpArrowIcon from '../icons/up-arrow-icon';
import Menu from './custom-fields/menu';
import { sortData } from './events/event-grid-header-clicked';

const SortColumn = (state, setState, sortable, columnName, colObject, sortOrder) => {
    if (typeof sortData === 'function' && sortable === true) {
        let timeout;
        const processSort = async () => {
            const data = state?.rowsData;
            const sortedRows = await sortData(colObject, sortOrder, data);
            timeout = setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    rowsData: sortedRows,
                    columns: prev?.columns?.map(col => ({
                        ...col,
                        sortOrder: col?.name === columnName ? sortOrder : ''
                    })),
                    toggleState: !prev?.toggleState
                }));
            }, 0);
        }
        processSort();
        return () => clearTimeout(timeout);
    }
}

const ColumnMenu = ({ column, sortable }) => {
    const { state = {}, setState = () => { } } = useGridConfig() ?? {};
    const columnName = column?.name;
    const columnAlias = column?.alias;
    const items = [
        {
            name: `Hide`,
            tooltip: `Hide "${capitalize(columnAlias ?? columnName)}" column`,
            icon: <HideViewIcon />,
            action: (e) => {
                e.stopPropagation();
                e.preventDefault();
                setState((prev) => ({
                    ...prev,
                    columns: prev.columns.map((c) =>
                        c.name === columnName ? { ...c, hideable: !c.hideable } : c
                    ),
                }))
            }
        },
        {
            name: `Sort Ascending`,
            tooltip: `Sort "${capitalize(columnAlias ?? columnName)}" column in ascending order`,
            icon: <UpArrowIcon />,
            hidden: !sortable,
            action: (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (column?.sortOrder === 'asc') return;
                const colObject = !isNull(column?.concatColumns?.columns) ?
                    column?.concatColumns?.columns : [column?.name];
                SortColumn(state, setState, sortable, columnName, colObject, 'asc');
            }
        },
        {
            name: `Sort Descending`,
            tooltip: `Sort "${capitalize(columnAlias ?? columnName)}" column in ascending order`,
            icon: <DownArrowIcon />,
            hidden: !sortable,
            action: (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (column?.sortOrder === 'desc') return;
                const colObject = !isNull(column?.concatColumns?.columns) ?
                    column?.concatColumns?.columns : [column?.name];
                SortColumn(state, setState, sortable, columnName, colObject, 'desc');
            }
        }
    ];

    return (
        <Menu
            key={columnName}
            menuId={columnName}
            items={items}
            width={"20px"}
            height={"24px"}
            margin={"0 5px 0 0"}
            borderRadius={"0"}
            noBorder="true"
            usePortal={true}
        />
    )
}

export default ColumnMenu;