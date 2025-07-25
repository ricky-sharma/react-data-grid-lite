/* eslint-disable react/prop-types */
import React from 'react';

const ColumnSortIcon = ({ columns = [], header }) => {
    const currentColumn = Array.isArray(columns)
        ? columns.find(entry => entry?.name === header?.name)
        : null;

    const sortOrder = typeof currentColumn?.sortOrder === 'string'
        ? currentColumn.sortOrder
        : null;

    const getIconClass = () => {
        if (sortOrder === 'asc') return 'icon-sort-up';
        if (sortOrder === 'desc') return 'icon-sort-down';
        return 'inactive icon-sort';
    };
    return (
        <div className="sort-icon-wrapper alignCenter">
            <i className={`updown-icon ${getIconClass()}`} />
        </div>
    );
};

export default ColumnSortIcon;
