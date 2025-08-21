import React from 'react';
import { useGridConfig } from '../hooks/use-grid-config';
import HideViewIcon from '../icons/hideview-Icon';
import Menu from './custom-fields/menu';

const ColumnMenu = ({ column }) => {
    const { setState = () => { } } = useGridConfig() ?? {};
    const items = [
        {
            name: 'Hide Column',
            tooltip: `Toggle visibility of ${column?.alias ?? column?.name} column`,
            icon: <HideViewIcon />,
            action: () =>
                setState((prev) => ({
                    ...prev,
                    columns: prev.columns.map((c) =>
                        c.name === column.name ? { ...c, hideable: !c.hideable } : c
                    ),
                }))
        },
    ];

    return (
        <Menu items={items} width="28px" fontSize="24px" noBorder="true" />
    )
}

export default ColumnMenu;