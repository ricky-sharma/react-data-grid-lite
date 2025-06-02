/* eslint-disable no-useless-escape */
export function dynamicSort(...fields) {
    const normalize = (val) => {
        if (val == null) return '';

        if (typeof val === 'number') return val;
        if (val instanceof Date) return val.getTime();

        if (typeof val === 'string') {
            const parsedDate = Date.parse(val);
            if (!isNaN(parsedDate)) return new Date(parsedDate).getTime();

            // Check for currency or numeric-like string
            const numeric = val.replace(/[^0-9.\-]+/g, '');
            if (
                !isNaN(numeric) &&
                numeric.trim() !== '' &&
                /^[\d.,\s$€£¥₹\-]+$/.test(val)
            ) {
                return parseFloat(numeric);
            }

            return val.trim().toLowerCase(); // fallback for strings (UUIDs, emails)
        }

        return String(val).toLowerCase();
    };


    return (a, b) => {
        for (let field of fields) {
            let desc = false;
            if (field.startsWith('-')) {
                desc = true;
                field = field.substring(1);
            }

            const aVal = normalize(a[field]);
            const bVal = normalize(b[field]);

            let result;

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                result = aVal - bVal;
            } else {
                // Ensure both are strings
                const aStr = String(aVal);
                const bStr = String(bVal);
                result = aStr.localeCompare(bStr);
            }

            if (result !== 0) return desc ? -result : result;
        }

        return 0;
    };
}
