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

        // Handle mixed types: numbers before strings
        const isNumA = typeof valA === 'number' || (!isNaN(parseFloat(valA)) && isFinite(valA));
        const isNumB = typeof valB === 'number' || (!isNaN(parseFloat(valB)) && isFinite(valB));

        if (isNumA && !isNumB) return -1 * sortOrder;
        if (!isNumA && isNumB) return 1 * sortOrder;

        // Convert currency strings to numbers
        if (typeof valA === 'string' && typeof valB === 'string') {
            const numA = parseFloat(valA.replace(/[^0-9.-]+/g, ''));
            const numB = parseFloat(valB.replace(/[^0-9.-]+/g, ''));
            if (!isNaN(numA) && !isNaN(numB)) {
                valA = numA;
                valB = numB;
            } else {
                // Try parsing as dates
                const dateA = new Date(valA);
                const dateB = new Date(valB);
                if (!isNaN(dateA) && !isNaN(dateB)) {
                    valA = dateA;
                    valB = dateB;
                } else {
                    // Case-insensitive string comparison
                    return valA.localeCompare(valB, undefined, {
                        sensitivity: 'base',
                        numeric: true
                    }) * sortOrder;
                }
            }
        }

        // Default numeric or date comparison
        let result = (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
        return result * sortOrder;
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