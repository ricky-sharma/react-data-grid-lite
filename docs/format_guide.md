# 🔤 Formatting Guide

This guide explains how to use the `format` and `formatDate` functions to display values in various formats like numbers, currencies, dates, percentages, and booleans.

## 🧩 `format(value, type, format?, currencyCode?)`

Formats a value based on its `type`, with an optional `format` and `currencyCode`.

### ✅ Supported Types

| Type       | Description                                | Example Format                 | Notes                     |
| ---------- | ------------------------------------------ | ------------------------------ | ------------------------- |
| `number`   | Formats numeric values                     | `'0,0'`, `'0.00'`              | Adds commas or decimals   |
| `currency` | Formats value as currency                  | `'USD'`, `'EUR'`               | Requires `currencyCode`   |
| `date`     | Formats date strings                       | `'MM/DD/YYYY'`, `'yyyy-MM-dd'` | Delegates to `formatDate` |
| `percent`  | Formats decimal as percentage              | –                              | Multiplies by 100         |
| `boolean`  | Formats boolean values as `'Yes'` / `'No'` | –                              | Case-insensitive          |

---

### 📘 Examples

```js
format(123456.789, 'number', '0,0'); 
// → "123,457"

format(123456.789, 'number', '0.00'); 
// → "123456.79"

format(1500, 'currency', '', 'USD'); 
// → "$1,500.00"

format('2023-09-15', 'date', 'MMMM do, yyyy'); 
// → "September 15th, 2023"

format(0.45, 'percent'); 
// → "45%"

format(true, 'boolean'); 
// → "Yes"
```

---

## 📅 `formatDate(date, formatString, locale?, timeZone?)`

Formats a date string or `Date` object using a custom format string. Uses default locale `en-US` and time zone `UTC` unless specified.

### 📌 Supported Tokens

| Token  | Meaning                       | Example (Jan 2, 2023 @ 3:04 PM) |
| ------ | ----------------------------- | ------------------------------- |
| `yyyy` | 4-digit year                  | `2023`                          |
| `MM`   | 2-digit month                 | `01`                            |
| `MMM`  | Abbreviated month             | `Jan`                           |
| `MMMM` | Full month name               | `January`                       |
| `dd`   | Day of month (2 digits)       | `02`                            |
| `do`   | Day of month with ordinal     | `2nd`                           |
| `HH`   | 24-hour format                | `15`                            |
| `hh`   | 12-hour format                | `03`                            |
| `mm`   | Minutes                       | `04`                            |
| `ss`   | Seconds                       | `00`                            |
| `S`    | Milliseconds                  | `0`                             |
| `a`    | AM/PM                         | `PM`                            |
| `EEE`  | Abbreviated weekday           | `Mon`                           |
| `EEEE` | Full weekday name             | `Monday`                        |
| `Z`    | Timezone offset (e.g., +0530) | `+0000`                         |
| `ZZZZ` | Full time zone name           | `Coordinated Universal Time`    |
| `DST`  | Daylight saving time status   | `Non-DST` or `DST`              |

---

### 🗓️ Date Examples

```js
formatDate('2023-01-02T15:04:00Z', 'MMMM do, yyyy'); 
// → "January 2nd, 2023"

formatDate('2023-01-02T15:04:00Z', 'HH:mm:ss a'); 
// → "15:04:00 PM"

formatDate('2023-01-02', 'EEE, MMM dd yyyy', 'en-US'); 
// → "Mon, Jan 02 2023"

formatDate('2023-01-02', 'yyyy-MM-dd ZZZZ', 'en-US', 'America/New_York'); 
// → "2023-01-02 Eastern Standard Time"
```

---

## 🔁 Notes

* If `value` is already a formatted string (e.g., `$1,000.00`), the `format` function will attempt to parse it.
* For `currency`, ISO codes like `'USD'`, `'EUR'`, `'JPY'`,`'INR'`, etc. are valid.
* If `formatString` is missing in `formatDate`, it defaults to `'yyyy-MM-dd'`.