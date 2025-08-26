import React from 'react';
import { capitalize, isNull } from '../helpers/common';
import { useGridConfig } from '../hooks/use-grid-config';
import DownArrowIcon from '../icons/down-arrow-icon';
import HideViewIcon from '../icons/hideview-Icon';
import LockIcon from '../icons/lock-icon';
import UnLockIcon from '../icons/unlock-icon';
import UpArrowIcon from '../icons/up-arrow-icon';
import Menu from './custom-fields/menu';
import { SortColumn } from './events/event-grid-header-clicked';

const ColumnMenu = ({ column, sortable }) => {
    const { state, setState } = useGridConfig() ?? {};
    const columnName = column?.name;
    const columnAlias = column?.alias;
    const editable = typeof column?.editable === "boolean"
        ? column?.editable : state?.enableCellEdit;
    const items = [
        {
            name: editable === true ? 'Disable editing' : `Enable editing`,
            tooltip: editable === true ?
                `Disable "${capitalize(columnAlias ?? columnName)}" column editing` :
                `Enable "${capitalize(columnAlias ?? columnName)}" column editing`,
            icon: editable === true ? <LockIcon /> : <UnLockIcon />,
            action: (e) => {
                e.stopPropagation();
                e.preventDefault();
                setState?.((prev) => ({
                    ...prev,
                    columns: prev.columns.map((c) =>
                        c.name === columnName ? { ...c, editable: !editable } : c
                    ),
                }))
            }
        },
        {
            name: `Hide column`,
            tooltip: `Hide "${capitalize(columnAlias ?? columnName)}" column`,
            icon: <HideViewIcon height="20" width="20" />,
            hidden: !state?.showToolbarMenu,
            action: (e) => {
                e.stopPropagation();
                e.preventDefault();
                setState?.((prev) => ({
                    ...prev,
                    columns: prev.columns.map((c) =>
                        c.name === columnName ? { ...c, hideable: !c.hideable } : c
                    ),
                }))
            }
        },
        {
            name: `Sort ascending`,
            tooltip: `Sort "${capitalize(columnAlias ?? columnName)}" column in ascending order`,
            icon: <UpArrowIcon />,
            hidden: !sortable,
            action: (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (column?.sortOrder === 'asc') return;
                const colObject = !isNull(column?.concatColumns?.columns) ?
                    column?.concatColumns?.columns : [column?.name];
                SortColumn(state, setState, columnName, colObject, 'asc');
            }
        },
        {
            name: `Sort descending`,
            tooltip: `Sort "${capitalize(columnAlias ?? columnName)}" column in descending order`,
            icon: <DownArrowIcon />,
            hidden: !sortable,
            action: (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (column?.sortOrder === 'desc') return;
                const colObject = !isNull(column?.concatColumns?.columns) ?
                    column?.concatColumns?.columns : [column?.name];
                SortColumn(state, setState, columnName, colObject, 'desc');
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