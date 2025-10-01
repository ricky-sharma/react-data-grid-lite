import React, { useMemo } from 'react';
import { capitalize, isNull } from '../helpers/common';
import { useGridConfig } from '../hooks/use-grid-config';
import { useMoveColumn } from '../hooks/use-move-column';
import DownArrowIcon from '../icons/down-arrow-icon';
import HideViewIcon from '../icons/hideview-Icon';
import LockIcon from '../icons/lock-icon';
import MoveColumnIcon from '../icons/move-column-icon';
import MoveColumnLeftIcon from '../icons/move-column-left-icon';
import MoveColumnRightIcon from '../icons/move-column-right-icon';
import UnLockIcon from '../icons/unlock-icon';
import UpArrowIcon from '../icons/up-arrow-icon';
import { getMoveStatus } from '../utils/component-utils';
import Menu from './custom-fields/menu';
import { SortColumn } from './events/event-grid-header-clicked';

const ColumnMenu = ({ column, sortable }) => {
    const { state, setState } = useGridConfig() ?? {};
    const { moveColumn } = useMoveColumn(state, setState);
    const columnName = column?.name;
    const columnAlias = column?.alias;
    const editable = typeof column?.editable === "boolean"
        ? column?.editable : state?.enableCellEdit;
    const columnIndex = useMemo(() => {
        return state?.columns.findIndex(
            col => !col.hidden && !col.hideable && col.name === columnName
        );
    }, [state?.columns, columnName]);
    const draggable = (typeof column?.draggable === 'boolean' ?
        column.draggable : state?.enableColumnDrag)
    const items = [
        {
            name: editable === true ? 'Disable editing' : `Enable editing`,
            tooltip: editable === true ?
                `Disable "${capitalize(columnAlias ?? columnName)}" column editing` :
                `Enable "${capitalize(columnAlias ?? columnName)}" column editing`,
            icon: editable === true ? <LockIcon /> : <UnLockIcon />,
            hidden: state?.transposeColumnName !== null,
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
            type: 'divider',
            hidden: !sortable || state?.transposeColumnName !== null
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
        },
        {
            type: 'divider',
            hidden: !draggable && !state?.showToolbarMenu
        },
        {
            name: 'Move',
            minWidth: '120px',
            hidden: !draggable,
            icon: <MoveColumnIcon />,
            tooltip: `Move "${capitalize(columnAlias ?? columnName)}" column left/right`,
            subItems: [
                (() => {
                    const leftStatus = getMoveStatus(
                        'left',
                        column,
                        state?.columns,
                        state?.enableColumnDrag,
                        state?.enableRtl);
                    return {
                        name: 'Left',
                        icon: <MoveColumnLeftIcon />,
                        tooltip: leftStatus.tooltip,
                        disabled: leftStatus.disabled,
                        action: () => {
                            if (leftStatus.disabled) return;

                            const newOrder = moveColumn(state?.enableRtl ? 'right' : 'left', columnName);
                            if (newOrder && typeof state?.onColumnDragEnd === 'function') {
                                state.onColumnDragEnd(columnName, newOrder);
                            }
                        }
                    };
                })(),
                (() => {
                    const rightStatus = getMoveStatus(
                        'right',
                        column,
                        state?.columns,
                        state?.enableColumnDrag,
                        state?.enableRtl);
                    return {
                        name: 'Right',
                        icon: <MoveColumnRightIcon />,
                        tooltip: rightStatus.tooltip,
                        disabled: rightStatus.disabled,
                        action: () => {
                            if (rightStatus.disabled) return;
                            const newOrder = moveColumn(state?.enableRtl ? 'left' : 'right', columnName);
                            if (newOrder && typeof state?.onColumnDragEnd === 'function') {
                                state.onColumnDragEnd(columnName, newOrder);
                            }
                        }
                    };
                })()
            ]
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
        }
    ];

    return (
        <Menu
            key={columnName}
            menuId={columnName}
            items={items}
            width={"20px"}
            height={"100%"}
            margin={"0 5px 0 0"}
            borderRadius={"0"}
            noBorder="true"
            usePortal={true}
            columnIndex={columnIndex}
        />
    )
}

export default ColumnMenu;