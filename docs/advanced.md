# Advanced Usage
---

## 📑 Concatenating Columns

In some scenarios, you may want to combine data from multiple columns into a single column for display in your data grid. The `react-data-grid-lite` component supports this functionality by allowing you to concatenate columns.

This feature is useful when you want to show a combined value, such as **Department and Title**, as a single field (e.g., "HR-Manager") instead of displaying them separately. The `concatColumns` property helps you achieve this by specifying which columns to concatenate and what separator to use between their values.

#### ⚙️ Configuration

To concatenate columns, you can use the `concatColumns` property within the column definition using one of the column as concatenated column. Here's how you can define a concatenated column in the grid:

```javascript
export const columns = [
    { name: 'ID', width: '80px'},
    { name: 'Name', alias: 'Full Name' },
    {
        alias: 'Department-Title', name: 'Department',
        concatColumns: {
            columns: ['Department', 'Title'],  // Columns to concatenate
            separator: '-'                     // Separator to use between values
        }
    },
    { name: 'Title' },
    { name: 'Email' },
    { name: 'Salary', formatting: { type: 'currency' }}
];
```

#### 📝 Explanation:

* **`name: 'Department'`**: The primary column name, which will be used to access the data for concatenation.
* **`alias: 'Department-Title'`**: This alias defines the name that will appear in the header of the concatenated column.
* **`concatColumns`**: This property is used to specify which columns you want to concatenate.

  * **`columns: ['Department', 'Title']`**: Lists the columns to concatenate. In this case, it concatenates values from the **Department** and **Title** columns.
  * **`separator: '-'`**: Defines the separator to use between the concatenated values. Here, it’s a hyphen (`-`), so the combined value will be displayed as `Department-Title` (e.g., `HR-Manager`).

#### 📊 Example:

Given the following data:

| ID | Name       | Department | Title     | Email                                                   | Salary |
| -- | ---------- | ---------- | --------- | ------------------------------------------------------- | ------ |
| 1  | John Doe   | HR         | Manager   | [john.doe@example.com](mailto:john.doe@example.com)     | \$5000 |
| 2  | Jane Smith | IT         | Developer | [jane.smith@example.com](mailto:jane.smith@example.com) | \$5500 |

With the configuration above, the **Department-Title** column will display:

| **Department-Title** |
| -------------------- |
| HR-Manager           |
| IT-Developer         |

The values of **Department** and **Title** are concatenated with the hyphen (`-`) separator.

##### 🔄 Use Cases:

* **Combining First Name and Last Name**: You could concatenate a **FirstName** and **LastName** column into a **Full Name** column.
* **Combining Address Fields**: If your dataset has separate columns for street, city, and country, you can concatenate them into a single **Full Address** column.
* **Concatenating Department and Role**: Combining values like **Department** and **Title** into a more descriptive field, like **Department-Title**.

This feature simplifies the grid by consolidating data into a single column while preserving the original columns for internal use or further customization.

##### 🔄 Additional Notes:

* **Custom Separator**: You can adjust the separator based on your preference. For example, use a space (`' '`) or comma (`','`) depending on how you want the concatenated data to appear.

#### 📌 **Important**:

> **Concatenating columns does not create a new column in the dataset**. Instead, the concatenated value will be displayed in the column you specify. This means that one of the columns in the dataset will be used to store the concatenated result, rather than introducing a completely new column in the dataset.

<br><br>


## 📏 **Column Width Calculation – Explained Simply**

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
