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
        property = property.slice(1);
    }

    return (a, b) => {
        let valA = a?.[property];
        let valB = b?.[property];

        // Handle null or undefined
        if (valA == null && valB == null) return 0;
        if (valA == null) return sortOrder;
        if (valB == null) return -sortOrder;

        // Normalize: Trim and lowercase for consistency
        const normalize = (val) =>
            typeof val === 'string' ? val.trim().toLowerCase() : val;

        valA = normalize(valA);
        valB = normalize(valB);

        // If both are numbers
        if (!isNaN(valA) && !isNaN(valB)) {
            return (parseFloat(valA) - parseFloat(valB)) * sortOrder;
        }

        // If both are valid Dates (and not UUID-like strings)
        const dateA = new Date(valA);
        const dateB = new Date(valB);
        const isDateA = !isNaN(dateA) && /^\d{4}-/.test(valA);
        const isDateB = !isNaN(dateB) && /^\d{4}-/.test(valB);

        if (isDateA && isDateB) {
            return (dateA - dateB) * sortOrder;
        }

        // Final fallback: strict lexicographic (for UUIDs, emails, etc.)
        return valA.localeCompare(valB) * sortOrder;
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