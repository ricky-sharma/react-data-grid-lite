import { isNull } from '../../helpers/common';
import { dynamicSort } from '../../helpers/sort';

/*
 * Handles sorting logic when a table header is clicked.
 */
export const eventGridHeaderClicked = (
    e,
    name,
    state,
    setState
) => {
    if (!e || !Array.isArray(name)) {
        return;
    }
    if (e.target.nodeName === "DIV" || e.target.nodeName === "I" || e.target.nodeName === "H4") {
        let sortColumn = [];
        let sortType = 'desc';
        let element = e.target.nodeName === "I" ? e.target :
            e.target.nodeName === "H4" ? e.target.parentElement.querySelector("i") :
                e.target.querySelector("i");
        const i = document.createElement("i");
        i.classList.add("updown-icon");

        if (!isNull(element)) {
            if (element.classList.contains("icon-sort-up") || element.classList.contains("icon-sort")) {
                i.classList.add("icon-sort-down");
                sortColumn = name.map((item) => `-${item}`);
            } else {
                i.classList.add("icon-sort-up");
                sortColumn = name.map((item) => `${item}`);
                sortType = 'asc';
            }
        } else {
            i.classList.add("icon-sort-down");
            sortColumn = name;
        }

        const theadRow = document.getElementById(`thead-row-${state.gridID}`);
        if (!isNull(theadRow)) {
            const sortIcons = theadRow.getElementsByTagName("i");
            if (!isNull(sortIcons)) {
                Array.from(sortIcons).forEach((si) => {
                    if (si.classList.contains("icon-sort-up")
                        || si.classList.contains("icon-sort-down")) {
                        si.classList.remove("icon-sort-up", "icon-sort-down");
                        if (!si.classList.contains("icon-sort")) {
                            si.classList.add("icon-sort", "inactive");
                        }
                    }
                });
            }
        }

        if (e.target.nodeName === "I") {
            const parent = e.target.parentNode;
            if (!isNull(element)) parent?.removeChild(element);
            parent?.appendChild(i);
        } else if (e.target.nodeName === "H4") {
            const parent = e.target.parentNode.querySelector("div");
            if (!isNull(parent) && !isNull(element)) parent?.removeChild(element);
            parent?.appendChild(i);
        }
        else {
            const icon = e.currentTarget.querySelector("i");
            if (!isNull(icon)) {
                const parent = icon.parentNode
                if (!isNull(element)) parent?.removeChild(element);
                parent.appendChild(i);
            }
        }
        let data = state.rowsData;
        data?.sort(dynamicSort(...sortColumn))
        setState(prev => ({
            ...prev,
            rowsData: data,
            sortType: sortType,
            toggleState: !prev.toggleState
        }));
    }
};
