import { isNull } from '../../helper/common';
import { dynamicSort } from '../../helper/sort';

/**
 * Handles sorting logic when a table header is clicked.
 *
 * @param {Event} e - The click event
 * @param {Array} name - The name of the column/s
 * @param {object} context - The class component's context (this)
 * @param {Event} onSortComplete - This event is triggered after the data has been sorted.
 */
export const eventGridHeaderClicked = (
    e,
    name,
    context,
    onSortComplete = () => { }
) => {
    if (!e || !Array.isArray(name) || typeof context !== 'object') {
        return;
    }
    if (e.target.nodeName === "DIV" || e.target.nodeName === "I" || e.target.nodeName === "H4") {
        let sortColumn = [];
        let sortType = 'desc';
        let element = e.target.nodeName === "I" ? e.target :
            e.target.nodeName === "H4" ? e.target.parentElement.querySelector("i") :
                e.target.querySelector("i");
        const i = document.createElement("i");
        i.classList.add("fa", "updown-icon");

        if (!isNull(element)) {
            if (element.classList.contains("fa-sort-up") || element.classList.contains("fa-sort")) {
                i.classList.add("fa-sort-down");
                sortColumn = name.map((item) => `-${item}`);
            } else {
                i.classList.add("fa-sort-up");
                sortColumn = name.map((item) => `${item}`);
                sortType = 'asc';
            }
        } else {
            i.classList.add("fa-sort-down");
            sortColumn = name;
        }

        const theadRow = document.getElementById(`thead-row-${context.state.gridID}`);
        if (!isNull(theadRow)) {
            const sortIcons = theadRow.getElementsByTagName("i");
            if (!isNull(sortIcons)) {
                Array.from(sortIcons).forEach((si) => {
                    si.classList.remove("fa-sort-up", "fa-sort-down");
                    if (!si.classList.contains("fa-sort")) {
                        si.classList.add("fa-sort", "inactive");
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

        let data = context.state.rowsData;
        data?.sort(dynamicSort(...sortColumn))
        context.setState({
            rowsData: data,
            toggleState: !context.state.toggleState,
        }, () => {
            if (typeof onSortComplete === 'function')
                onSortComplete(
                    e,
                    name,
                    data,
                    sortType
                );
        });
    }
};
