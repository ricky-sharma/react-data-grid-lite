export const formatDate = (date, formatString, locale = 'en-US', timeZone = 'UTC') => {
    const d = new Date(date);
    if (isNaN(d)) return '';

    // Function to pad numbers (for two-digit format)
    const pad = (n) => (n < 10 ? '0' + n : n);

    // Check if DST is active in the given time zone
    const isDST = (date, timeZone) => {
        const jan = new Date(date.getFullYear(), 0, 1);
        const jul = new Date(date.getFullYear(), 6, 1);

        const janOffset = new Date(jan.toLocaleString('en-US', { timeZone })).getTimezoneOffset();
        const julOffset = new Date(jul.toLocaleString('en-US', { timeZone })).getTimezoneOffset();
        const currentOffset = new Date(date.toLocaleString('en-US', { timeZone })).getTimezoneOffset();

        return currentOffset < Math.max(janOffset, julOffset);
    };

    // Map of format tokens to functions
    const formatters = {
        yyyy: () => d.getFullYear(),
        MM: () => pad(d.getMonth() + 1),
        dd: () => pad(d.getDate()),
        HH: () => pad(d.getHours()),
        mm: () => pad(d.getMinutes()),
        ss: () => pad(d.getSeconds()),
        S: () => d.getMilliseconds(), // Milliseconds
        EEEE: () => d.toLocaleString(locale, { weekday: 'long' }), // Full weekday name
        EEE: () => d.toLocaleString(locale, { weekday: 'short' }), // Abbreviated weekday name
        a: () => (d.getHours() >= 12 ? 'PM' : 'AM'), // AM/PM marker
        MMMM: () => d.toLocaleString(locale, { month: 'long' }), // Full month name
        MMM: () => d.toLocaleString(locale, { month: 'short' }), // Abbreviated month name
        do: () => {
            const day = d.getDate();
            if (day >= 11 && day <= 13) return day + 'th'; // Special case for 11th, 12th, 13th
            switch (day % 10) {
                case 1: return day + 'st';
                case 2: return day + 'nd';
                case 3: return day + 'rd';
                default: return day + 'th';
            }
        },
        hh: () => pad((d.getHours() % 12) || 12), // 12-hour format
        Z: () => {
            const offset = new Date(d.toLocaleString('en-US', { timeZone })).getTimezoneOffset();
            const hours = Math.floor(Math.abs(offset) / 60);
            const minutes = Math.abs(offset) % 60;
            const sign = offset > 0 ? '-' : '+';
            return `${sign}${pad(hours)}${pad(minutes)}`; // Timezone offset (e.g., -0400)
        },
        ZZZZ: () => d.toLocaleString(locale, { timeZoneName: 'long', timeZone }), // Full timezone name (e.g., Pacific Standard Time)
        DST: () => isDST(d, timeZone) ? 'DST' : 'Non-DST', // Custom DST handler
    };

    // Replace format tokens with their corresponding values
    return formatString.replace(/yyyy|MM|dd|HH|mm|ss|S|EEEE|EEE|a|MMMM|MMM|do|hh|Z|ZZZZ|DST/g, (match) => {
        if (formatters[match]) {
            return formatters[match]();
        }
        return match; // Return the token if no formatter exists for it
    });
};