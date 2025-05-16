//      Usage Example
//      var People = [
//          { Name: "Name", Surname: "Surname" },
//          { Name: "AAA", Surname: "ZZZ" },
//          { Name: "Name", Surname: "AAA" }
//          ];
//      People.sort(DynamicSort("Name"));
//      People.sort(DynamicSort("-Surname"));
export function DynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return (a, b) => {
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

//      Usage Example
//      People.sort(DynamicSortMultiple("Name", "-Surname"));
export function DynamicSortMultiple() {
    let props = arguments;
    return (obj1, obj2) => {
        let i = 0, result = 0, numberOfProperties = props.length;
        while (result === 0 && i < numberOfProperties) {
            result = DynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}