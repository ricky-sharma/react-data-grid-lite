# Advanced Usage
---

## 📑 Concatenating Columns

In some scenarios, you may want to combine data from multiple columns into a single column for display and editing within your data grid. The `react-data-grid-lite` component supports this via the `concatColumns` property.

This feature is useful when you want to show a combined value, such as **Department and Title**, as a single field (e.g., `"HR - Manager"`) instead of displaying them separately. The `concatColumns` property lets you specify which columns to concatenate, the separator between values, and how each field is edited.


### ⚙️ Configuration

You define a concatenated column by specifying the base column (which will show the combined value) and the `concatColumns` config describing:

* Which columns to combine
* The separator between values
* Editor configurations for each concatenated field (optional)

```javascript
export const columns = [
  { name: 'ID', width: '80px' },
  { name: 'Name', alias: 'Full Name' },
  {
    alias: 'Department - Title',
    name: 'Department',
    concatColumns: {
      columns: ['Department', 'Title'],        // Columns to concatenate
      separator: ' - ',                        // Separator string
      editor: [                               // Editor config for each field (optional)
        {
          type: 'select',
          values: [
            { label: 'HR', value: 'HR' },
            { label: 'Engineering', value: 'Engineering' },
            { label: 'Marketing', value: 'Marketing' }
          ]
        },
        {
          type: 'select',
          values: [
            { label: 'Manager', value: 'Manager' },
            { label: 'Lead', value: 'Lead' },
            { label: 'Intern', value: 'Intern' }
          ]
        }
      ]
    }
  },
  { name: 'Title' },
  { name: 'Email' },
  { name: 'Salary', formatting: { type: 'currency' } }
];
```

### 📝 Explanation:

* **`name: 'Department'`**
  The main column to display the concatenated value.

* **`alias: 'Department - Title'`**
  The header label for the concatenated column.

* **`concatColumns.columns`**
  An array of the column names whose values will be combined.

* **`concatColumns.separator`**
  The string that separates the concatenated values in the display.

* **`concatColumns.editor`**
  An array specifying editors for each concatenated field. Editors can be shorthand strings (e.g., `'text'`, `'select'`) or detailed objects with dropdown values.

### 📊 Example Dataset

| ID | Name       | Department  | Title   | Email                                                   | Salary |
| -- | ---------- | ----------- | ------- | ------------------------------------------------------- | ------ |
| 1  | John Doe   | HR          | Manager | [john.doe@example.com](mailto:john.doe@example.com)     | \$5000 |
| 2  | Jane Smith | Engineering | Lead    | [jane.smith@example.com](mailto:jane.smith@example.com) | \$5500 |

### Resulting Display

| Department - Title |
| ------------------ |
| HR - Manager       |
| Engineering - Lead |

When you edit the **Department - Title** column, it shows two select dropdowns side-by-side (or in sequence), letting users update **Department** and **Title** individually.

#### 🔄 Use Cases

* **Full Name**: Combine `FirstName` and `LastName` columns for display and editing as one field.
* **Full Address**: Concatenate street, city, and country columns.
* **Product Details**: Combine product name and variant (e.g., color or size).
* **Department and Role**: As shown, combine department and job title for concise display.


#### 🔄 Additional Notes

* **Custom Separators**
  You can change the separator string to anything: spaces, commas, slashes, etc.

* **Editor Defaults**
  If you don’t provide `concatColumns.editor`, each field defaults to a text input when editable.

* **Data Integrity**
  The concatenated column does not create a new column in your dataset. Instead, it displays combined values from existing columns and updates them individually when edited.


#### 📌 Important

> Concatenation is purely a display and editing convenience. Your underlying data structure remains unchanged. When a concatenated cell is edited, each part updates its respective original column.
---

<br><br>
## 📐 How Column Width is Computed (for Version 1.1.0 and Above)

The grid intelligently calculates column widths based on a mix of fixed, flexible, and fallback strategies. Here's how it works:

### 🧾 General Rules

* **All column widths are ultimately returned in `px`**.
* **Invalid, negative, or missing widths** fall back to the default value defined as `Fallback_Column_Width` in `constants.js`.
* **Percentage (`%`) widths are converted to pixels** based on the container width.


### 🖥️ Desktop Mode

#### 🔹 Scenario 1: All Columns Have Fixed Widths

* If all visible columns have defined widths:

  * If the total fixed width exceeds the container, columns retain their set widths.
  * If the total is less than the container width, all columns are evenly stretched.

#### 🔹 Scenario 2: Mixed Fixed and Flexible Columns

* Fixed-width columns retain their pixel values.
* Remaining width is evenly distributed among flexible columns.
* If a flexible column lacks a valid width, it receives an equal share of the remaining space.
* Each flexible column will receive **at least the default value specified by `Fallback_Column_Width`**.

#### 🔹 Scenario 3: All Columns Are Flexible (No Valid Widths)

* The container width is evenly divided among all visible columns.
* Each column receives at least the default value specified by `Fallback_Column_Width`.


### ⚠️ Fallbacks & Edge Cases

* If no visible columns are found, a default width of `100%` is returned.
* If a column has a `%` width like `"20%"`, it's converted to pixels based on the container size.
* Widths like `"abc"`, `"-100px"`, `null`, or `undefined` are treated as invalid and **fall back to the default value specified by** `Fallback_Column_Width`.
  
<br><br>
---

## 📏 **Column Width Calculation – Explained Simply (for Version 1.0.5 and Below)**

This logic automatically adjusts column widths based on how the grid is set up:

1. **Fixed + Flexible Columns**
   If some columns have fixed widths and others don’t, it calculates the remaining space and distributes it evenly among the flexible columns.

2. **All Columns Fixed Width**
   If all visible columns have fixed widths but don’t fill the grid, it stretches them to fit the full width.

3. **All Columns Flexible**
   If no fixed widths are defined, the columns are given equal space in percentages, and adjusted to avoid leaving empty space.

4. **Mobile Devices**
   On smaller screens, columns are either given a fixed mobile-friendly width or stretched to fit the screen without breaking layout.

5. **Responsive to Container Width**
   The logic automatically recalculates widths based on the container’s size and optional buttons.
   
<br><br>


## Performance Tips

- Use pagination to limit rows rendered at a time.
- Consider lazy loading or virtualized lists for extremely large datasets.

<br><br>


## Export & Download

- Use `onDownloadComplete` to trigger analytics or email notifications.
- CSV export respects current sorting and filtering.
