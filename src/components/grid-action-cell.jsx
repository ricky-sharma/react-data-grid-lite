import React from 'react';
import { useGridConfig } from '../hooks/use-grid-config';
import DeleteIcon from '../icons/delete-icon';
import EditIcon from '../icons/edit-icon';

const GridActionCell = ({
    buttonColWidth,
    isActionColumnLeft,
    isActionColumnRight,
    isMobile,
    baseRow
}) => {
    const { state = {} } = useGridConfig() ?? {};
    const {
        enableRtl,
        editButtonEnabled,
        deleteButtonEnabled,
        editButtonEvent,
        deleteButtonEvent
    } = state;
    const left = isActionColumnLeft && !isMobile ? 0 : '';
    const right = isActionColumnRight && !isMobile ? '-0.5px' : '';
    const position = (isActionColumnLeft || isActionColumnRight) && !isMobile ? 'sticky' : '';
    const zIndex = (isActionColumnLeft || isActionColumnRight) && !isMobile ? 6 : '';
    const boxShadow = isActionColumnLeft && !isMobile
        ? (enableRtl ? '#e0e0e0 0.6px 0 0 0 inset' : '#e0e0e0 -0.6px 0 0 0 inset')
        : isActionColumnRight && !isMobile
            ? (enableRtl ? '#e0e0e0 -0.6px 0 0 0 inset' : '#e0e0e0 0.6px 0 0 0 inset')
            : '';

    return (
        <td
            key="gridButtons"
            className="alignCenter"
            onClick={e => e.stopPropagation()}
            style={{
                width: buttonColWidth,
                maxWidth: buttonColWidth,
                minWidth: buttonColWidth,
                left: enableRtl ? right : left,
                right: enableRtl ? left : right,
                position,
                zIndex,
                backgroundColor: 'inherit',
                boxShadow,
                contain: 'layout paint'
            }}
        >
            <div
                className="mg--0 pd--0 button-column alignCenter"
                style={{ width: buttonColWidth }}
            >
                {editButtonEnabled && (
                    <div
                        className="pd--0 mg--0 icon-div alignCenter grid-icon-div"
                        title="Edit"
                        onClick={e => editButtonEvent(e, baseRow)}
                        role="button"
                        tabIndex="0"
                        onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') editButtonEvent(e, baseRow);
                        }}
                    >
                        <EditIcon />
                    </div>
                )}
                {deleteButtonEnabled && (
                    <div
                        className="pd--0 mg--0 icon-div alignCenter grid-icon-div"
                        title="Delete"
                        onClick={e => deleteButtonEvent(e, baseRow)}
                        role="button"
                        tabIndex="0"
                        onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') deleteButtonEvent(e, baseRow);
                        }}
                    >
                        <DeleteIcon />
                    </div>
                )}
            </div>
        </td>
    );
};

export default GridActionCell;