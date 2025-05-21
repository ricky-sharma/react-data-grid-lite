//      Usage Example
//      var People = [
//          { name: "Name", surname: "Surname" },
//          { name: "AAA", surname: "ZZZ" },
//          { name: "Name", surname: "AAA" }
//          ];
//      People.sort(dynamicSort("name"));
//      People.sort(dynamicSort("-surname"));
export function dynamicSort(property) {
    let sortOrder = -1;
    if (property[0] === "-") {
        sortOrder = 1;
        property = property.substr(1);
    }

    return (a, b) => {
        let valA = a[property];
        let valB = b[property];

        // Handle null or undefined
        if (valA == null && valB == null) return 0;
        if (valA == null) return sortOrder;
        if (valB == null) return -sortOrder;

        // Convert to comparable values
        const parseCurrency = (val) => {
            if (typeof val === 'string') {
                const cleaned = val.replace(/[^0-9.-]+/g, '');
                const num = parseFloat(cleaned);
                if (!isNaN(num)) return num;
            }
            return val;
        };

        valA = parseCurrency(valA);
        valB = parseCurrency(valB);

        const isNumA = typeof valA === 'number' && !isNaN(valA);
        const isNumB = typeof valB === 'number' && !isNaN(valB);

        if (isNumA && !isNumB) return -1 * sortOrder;
        if (!isNumA && isNumB) return 1 * sortOrder;
        if (isNumA && isNumB) return (valA - valB) * sortOrder;

        // Try date parsing
        const dateA = new Date(valA);
        const dateB = new Date(valB);
        const isDateA = !isNaN(dateA);
        const isDateB = !isNaN(dateB);

        if (isDateA && isDateB) {
            return (dateA - dateB) * sortOrder;
        }

        // Case-insensitive string comparison
        return String(valA).localeCompare(String(valB), undefined, {
            sensitivity: 'base',
            numeric: true
        }) * sortOrder;
    };
}

//      Usage Example
//      People.sort(dynamicSortMultiple("name", "-surname"));
export function dynamicSortMultiple(...props) {
    return (obj1, obj2) => {
        let i = 0, result = 0;
        while (result === 0 && i < props.length) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    };
}