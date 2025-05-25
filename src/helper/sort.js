export function dynamicSort(...fields) {
    const normalize = (val) => {
        if (val == null) return '';
        if (typeof val === 'number') return val;
        if (val instanceof Date) return val.getTime();

        if (typeof val === 'string') {
            const parsedDate = Date.parse(val);
            if (!isNaN(parsedDate)) return new Date(parsedDate).getTime();

            // Try numeric/currency
            const numeric = val.replace(/[^0-9.\-]+/g, '');
            if (!isNaN(numeric) && numeric.trim() !== '' && !val.includes('-')) {
                return parseFloat(numeric);
            }

            return val.trim().toLowerCase(); // Proper string handling (UUIDs, emails)
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
