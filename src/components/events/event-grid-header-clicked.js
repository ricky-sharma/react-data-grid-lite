import { isNull } from '../../helpers/common';
import { dynamicSort } from '../../helpers/sort';

/**
 * Handles sorting logic when a table header is clicked.
 */
export const eventGridHeaderClicked = (e, name, state, setState) => {
    if (!e || !Array.isArray(name)) return;

    const iconElement = e.currentTarget?.querySelector('.sort-icon-wrapper')?.querySelector('i');
    if (!iconElement) return;

    const newIcon = document.createElement('i');
    newIcon.classList.add('updown-icon');

    let sortColumn = [];
    let sortType = 'desc';

    if (iconElement.classList.contains('icon-sort-up') || iconElement.classList.contains('icon-sort')) {
        newIcon.classList.add('icon-sort-down');
        sortColumn = name.map((item) => `-${item}`);
    } else {
        newIcon.classList.add('icon-sort-up');
        sortColumn = name.map((item) => `${item}`);
        sortType = 'asc';
    }
    const theadRow = document.getElementById(`thead-row-${state.gridID}`);
    if (!isNull(theadRow)) {
        const sortIcons = theadRow.getElementsByTagName('i');
        Array.from(sortIcons).forEach((si) => {
            if (si.classList.contains("icon-sort-up")
                || si.classList.contains("icon-sort-down")) {
                si.classList.remove('icon-sort-up', 'icon-sort-down');
                if (!si.classList.contains('icon-sort')) {
                    si.classList.add('icon-sort', 'inactive');
                }
            }
        });
    }
    const wrapper = iconElement?.closest('.sort-icon-wrapper');
    if (wrapper && iconElement?.parentNode === wrapper) {
        wrapper.removeChild(iconElement);
        wrapper.appendChild(newIcon);
    }
    const sortedData = state.rowsData?.slice().sort(dynamicSort(...sortColumn));
    setState((prev) => ({
        ...prev,
        rowsData: sortedData,
        sortType,
        toggleState: !prev.toggleState
    }));
};
