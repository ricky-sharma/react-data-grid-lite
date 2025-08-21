import React from 'react';
import { capitalize } from '../helpers/common';
import { useGridConfig } from '../hooks/use-grid-config';
import HideViewIcon from '../icons/hideview-Icon';
import Menu from './custom-fields/menu';

const ColumnMenu = ({ column }) => {
    const { setState = () => { } } = useGridConfig() ?? {};
    const columnName = column?.name;
    const columnAlias = column?.alias;
    const items = [
        {
            name: `Hide ${capitalize(columnAlias ?? columnName)}`,
            tooltip: `Hide "${capitalize(columnAlias ?? columnName)}" column`,
            icon: <HideViewIcon />,
            action: () =>
                setState((prev) => ({
                    ...prev,
                    columns: prev.columns.map((c) =>
                        c.name === columnName ? { ...c, hideable: !c.hideable } : c
                    ),
                }))
        },
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
            fontSize="24px"
            noBorder="true"
            usePortal={true}
        />
    )
}

export default ColumnMenu;