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

    const getOffset = (date, timeZone) => {
        const options = {
            timeZone,
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };

        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(date);
        const tzName = parts.find(p => p.type === 'timeZoneName')?.value;

        return tzName.includes('DT') ? 'DST' : 'Non-DST';
    };

    const isDST = (date, timeZone) => {
        return getOffset(date, timeZone) === 'DST';
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
            const dtf = new Intl.DateTimeFormat('en-US', {
                timeZone,
                hour12: false,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });

            const parts = dtf.formatToParts(d);
            const get = (type) => Number(parts.find(p => p.type === type)?.value);

            const tzY = get('year');
            const tzM = get('month');
            const tzD = get('day');
            const tzH = get('hour');
            const tzMin = get('minute');
            const tzS = get('second');

            const tzDate = new Date(Date.UTC(tzY, tzM - 1, tzD, tzH, tzMin, tzS));

            const offsetMinutes = Math.round((tzDate - d) / (60 * 1000));

            const sign = offsetMinutes >= 0 ? '+' : '-';
            const absOffset = Math.abs(offsetMinutes);
            const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
            const minutes = String(absOffset % 60).padStart(2, '0');

            return `${sign}${hours}${minutes}`;
        },
        ZZZZ: () => d.toLocaleString(locale, { timeZoneName: 'long', timeZone }),
        DST: () => isDST(d, timeZone) ? 'DST' : 'Non-DST',
    };

    return formatString.replace(/yyyy|MMMM|MMM|MM|dd|HH|mm|ss|S|EEEE|EEE|a|do|hh|ZZZZ|Z|DST/g, (match) => {
        return formatters[match]?.();
    });
};
