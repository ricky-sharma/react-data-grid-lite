## 🔤 Format Guide

This guide explains how to use the `formatting` option in column definitions to customize how values are displayed in the grid.

---

### ✅ How to Use

Use the `formatting` key inside each column to define how values should appear:

```js
const columns = [
  {
    name: 'Amount',
    formatting: { type: 'number', format: '0,0.00' }, // → "1,234.56"
  },
  {
    name: 'Salary',
    formatting: { type: 'currency', format: 'USD' }, // → "$5,000.00"
  },
  {
    name: 'Joining Date',
    formatting: { type: 'date', format: 'MMMM dd, yyyy' }, // → "January 01, 2024"
  },
  {
    name: 'Active',
    formatting: { type: 'boolean' }, // → "Yes" / "No"
  }
];
```

The grid automatically formats values based on `type` and `format`.

---

### ✅ Supported Types

| Type       | Description                     | Example Format    | Notes                              |
| ---------- | ------------------------------- | ----------------- | ---------------------------------- |
| `number`   | Formats numeric values          | `'0,0'`, `'0.00'` | Adds commas and/or decimals        |
| `currency` | Localized currency formatting   | `'USD'`, `'INR'`  | Requires valid ISO 4217 code       |
| `date`     | Formats date strings            | `'MM/dd/yyyy'`    | Delegates to internal `formatDate` |
| `percent`  | Formats decimals as percentages | –                 | Multiplies value by 100            |
| `boolean`  | Formats true/false as Yes / No  | –                 | Case-insensitive                   |

---

### 📌 Common Format Tokens (for dates)

| Token  | Meaning              | Example                 |
| ------ | -------------------- | ----------------------- |
| `yyyy` | 4-digit year         | `2023`                  |
| `MM`   | 2-digit month        | `01`                    |
| `MMM`  | Abbreviated month    | `Jan`                   |
| `MMMM` | Full month name      | `January`               |
| `dd`   | 2-digit day of month | `02`                    |
| `do`   | Ordinal day          | `2nd`                   |
| `HH`   | 24-hour format       | `15`                    |
| `hh`   | 12-hour format       | `03`                    |
| `mm`   | Minutes              | `04`                    |
| `ss`   | Seconds              | `00`                    |
| `S`    | Milliseconds         | `0`                     |
| `a`    | AM/PM                | `PM`                    |
| `EEE`  | Abbreviated weekday  | `Mon`                   |
| `EEEE` | Full weekday name    | `Monday`                |
| `Z`    | Timezone offset      | `+0000`                 |
| `ZZZZ` | Timezone full name   | `Eastern Standard Time` |
