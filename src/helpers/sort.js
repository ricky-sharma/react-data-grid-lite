/* eslint-disable no-useless-escape */
export function dynamicSort(columnTypes, ...fields) {
    const normalize = (val, columnType) => {
        if (val == null) return '';

        const type = columnType?.trim().toLowerCase();

        if (type === 'number') {
            if (typeof val === 'number') return val;
            const parsed = parseFloat(val);
            return isNaN(parsed) ? val : parsed;
        }

        if (type === 'date') {
            if (val instanceof Date) return val?.getTime?.();
            const parsed = Date.parse(val);
            return isNaN(parsed) ? val : new Date(parsed)?.getTime?.();
        }

        if (type === 'currency' || type === 'string') {
            const numeric = val?.replace?.(/[^0-9.\-]+/g, '');
            if (
                !isNaN(numeric) &&
                numeric?.trim() !== '' &&
                /^[\d.,\s$€£¥₹\-]+$/.test(val)
            ) {
                return parseFloat(numeric);
            }
            return val?.toString().toLowerCase();
        }

        if (typeof val === 'number') return val;
        if (val instanceof Date) return val?.getTime?.();
        return val?.toString().toLowerCase();
    };

    const collator = typeof Intl !== 'undefined' && typeof Intl.Collator === 'function'
        ? new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
        : null;

    return (a, b) => {
        for (let field of fields) {
            let desc = false;
            if (field.startsWith('-')) {
                desc = true;
                field = field.substring(1);
            }
            const columnType = columnTypes?.[field];
            const aVal = normalize(a[field], columnType);
            const bVal = normalize(b[field], columnType);

            let result;
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                result = aVal - bVal;
            } else {
                if (collator) {
                    result = collator.compare(String(aVal), String(bVal));
                } else {
                    result = String(aVal).localeCompare(String(bVal));
                }
            }

            if (result !== 0) return desc ? -result : result;
        }

        return 0;
    };
}
