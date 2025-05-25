export const formatDate = (date, formatString, locale = 'en-US', timeZone = 'UTC') => {
    // Fallback for missing or invalid date
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d)) return '';

    // Fallback for missing or empty format string
    if (!formatString || typeof formatString !== 'string' || formatString.trim() === '') {
        formatString = 'yyyy-MM-dd'; // Default format fallback
    }

    const pad = (n) => (n < 10 ? '0' + n : n);

    const isDST = (date, timeZone) => {
        const jan = new Date(date.getFullYear(), 0, 1);
        const jul = new Date(date.getFullYear(), 6, 1);

        const janOffset = new Date(jan.toLocaleString('en-US', { timeZone })).getTimezoneOffset();
        const julOffset = new Date(jul.toLocaleString('en-US', { timeZone })).getTimezoneOffset();
        const currentOffset = new Date(date.toLocaleString('en-US', { timeZone })).getTimezoneOffset();

        return currentOffset < Math.max(janOffset, julOffset);
    };

    const formatters = {
        yyyy: () => d.getFullYear(),
        MM: () => pad(d.getMonth() + 1),
        dd: () => pad(d.getDate()),
        HH: () => pad(d.getHours()),
        mm: () => pad(d.getMinutes()),
        ss: () => pad(d.getSeconds()),
        S: () => d.getMilliseconds(),
        EEEE: () => d.toLocaleString(locale, { weekday: 'long' }),
        EEE: () => d.toLocaleString(locale, { weekday: 'short' }),
        a: () => (d.getHours() >= 12 ? 'PM' : 'AM'),
        MMMM: () => d.toLocaleString(locale, { month: 'long' }),
        MMM: () => d.toLocaleString(locale, { month: 'short' }),
        do: () => {
            const day = d.getDate();
            if (day >= 11 && day <= 13) return day + 'th';
            switch (day % 10) {
                case 1: return day + 'st';
                case 2: return day + 'nd';
                case 3: return day + 'rd';
                default: return day + 'th';
            }
        },
        hh: () => pad((d.getHours() % 12) || 12),
        Z: () => {
            const offset = new Date(d.toLocaleString('en-US', { timeZone })).getTimezoneOffset();
            const hours = Math.floor(Math.abs(offset) / 60);
            const minutes = Math.abs(offset) % 60;
            const sign = offset > 0 ? '-' : '+';
            return `${sign}${pad(hours)}${pad(minutes)}`;
        },
        ZZZZ: () => d.toLocaleString(locale, { timeZoneName: 'long', timeZone }),
        DST: () => isDST(d, timeZone) ? 'DST' : 'Non-DST',
    };

    return formatString.replace(/yyyy|MM|dd|HH|mm|ss|S|EEEE|EEE|a|MMMM|MMM|do|hh|Z|ZZZZ|DST/g, (match) => {
        return formatters[match] ? formatters[match]() : match;
    });
};
