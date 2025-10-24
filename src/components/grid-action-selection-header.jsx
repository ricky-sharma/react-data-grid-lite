import React from 'react';
import {
    Button_Column_Key,
    Button_Column_Width,
    Selection_Column_Key,
    Selection_Column_Width
} from '../constants';
import ActionIcon from '../icons/action-icon';
import { getActionColumnStyle } from '../utils/grid-style-utils';
import Checkbox from './custom-fields/checkbox';
import { handleHeaderSelectAllChange } from './events/handle-header-selectall-change';

const GridActionSelectionHeader = ({
    header,
    keyIndex,
    state,
    setState,
    onSelectAll,
    isActionColumnLeft,
    isActionColumnRight,
    isSelectionColumnLeft,
    isSelectionColumnRight,
    isMobile,
    enableRtl
}) => {
    const selectedRows = new Set(state?.selectedRows);
    const firstRow = state?.firstRow ?? 0;
    const lastRow = firstRow + (state?.currentPageRows ?? 0);
    const currentPageRows = state?.rowsData?.slice(firstRow, lastRow) ?? [];
    const isAllSelected =
        currentPageRows?.length > 0
            ? currentPageRows.every(row => selectedRows.has(row?.__$index__))
            : false;

    const width = header === Button_Column_Key ? Button_Column_Width : Selection_Column_Width;

    const tooltip =
        header === Button_Column_Key ? 'Actions' : 'Select all rows';

    return (
        <th
            style={
                getActionColumnStyle(
                    header,
                    isActionColumnLeft,
                    isActionColumnRight,
                    isSelectionColumnLeft,
                    isSelectionColumnRight,
                    isMobile,
                    enableRtl,
                    true
                )
            }
            title={tooltip}
            key={keyIndex}
            role="columnheader"
            aria-label={tooltip}
        >
            <div
                style={{ width, maxWidth: width }}
                className="pd--0 emptyHeader alignCenter"
            >
                {header === Button_Column_Key && <ActionIcon />}
                {header === Selection_Column_Key && (
                    <Checkbox
                        isSelected={isAllSelected}
                        onChange={e =>
                            handleHeaderSelectAllChange(e, state, setState, onSelectAll)
                        }
                    />
                )}
            </div>
            {(isActionColumnLeft && header === Button_Column_Key) ||
                (isSelectionColumnLeft && header === Selection_Column_Key) ||
                (isActionColumnRight && isSelectionColumnRight && header === Selection_Column_Key) ? (
                <span style={{ zIndex: 11 }} />
            ) : null}
        </th>
    );
};

export default GridActionSelectionHeader;
