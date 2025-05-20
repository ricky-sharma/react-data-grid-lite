---

# React Data Grid Lite

![Version](https://img.shields.io/github/package-json/v/ricky-sharma/react-data-grid-lite)
![License](https://img.shields.io/github/license/ricky-sharma/react-data-grid-lite)
![Last Commit](https://img.shields.io/github/last-commit/ricky-sharma/react-data-grid-lite)
![Forks](https://img.shields.io/github/forks/ricky-sharma/react-data-grid-lite?style=social)
![Download ZIP](https://img.shields.io/badge/Download-ZIP-blue?style=flat&logo=github)

A lightweight and customizable React data grid component designed for high performance and ease of use. The DataGrid component is a highly customizable, feature-rich table component designed to display tabular data in a React application. It is intended for use cases where large datasets need to be presented with advanced features such as pagination, sorting, searching, row interactions, and more.

Moreover, the component is fully compatible with older versions of React, ensuring flexibility and ease of integration for projects that may not be using the latest React release. Whether you are building a simple data table or a complex enterprise-level UI, the `DataGrid` component can be seamlessly adapted to your needs. 

---

### **Key Highlights:**

* **Lightweight**: The component is optimized for small bundle size, ensuring fast load times and minimal impact on your application's overall performance.
* **Backward Compatibility**: It supports older React versions, allowing you to use it in legacy applications without upgrading to the latest React version.

---

## 📦 Installation

```bash
npm install react-data-grid-lite
```

or

```bash
yarn add react-data-grid-lite
```

---

## 🚀 Usage

```jsx
import React, { useState } from 'react';
import DataGrid from 'react-data-grid-lite';

const columns = [
  { name: 'id', width:'50px' },
  { name: 'name', alias:'Full Name' },
  { name: 'age' }
];

const rows = [
  { id: 1, name: 'John Doe', age: 28 },
  { id: 2, name: 'Jane Smith', age: 34 },
  { id: 3, name: 'Sam Johnson', age: 22 }
];

const options = {
    editButton: {
        event: (e, row) => {
               alert('Edit Button clicked!'),
               console.log(row)
        }
    },
    deleteButton: {
        event: (e, row) => {
            alert('Delete Button clicked!'),
            console.log(row)
        }
    },
    downloadFilename: "test.csv"
}

function App() {
  return (
    <div>
      <h1>Data Grid Example</h1>
      <DataGrid
          columns={columns}
          data={rows}
          options={options}
          pageSize={5}
      />
    </div>
  );
}

export default App;
```

---

## 🔧 Props

| **Prop**              | **Type**            | **Description**                                                                                                             | **Default Value** | **Required** |
| --------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------ |
| `columns`             | `Array`             |Array of column definitions. Each column can have properties like `name`, `width`, 'alias', 'searchEnable', 'hidden'  etc.   |     `null`        | Yes          |
| `data`                | `Array`             | Array of objects representing the rows of data to display.                                                                  |     `null`        | Yes          |
| `pageSize`            | `Number`            | Number of rows per page for pagination. If `null` or not provided, pagination is disabled.                                  |     `null`        | No           |
| `options`             | `Object`            | An object for additional customization. Contains options like `gridClass`, `enableGlobalSearch`, etc.                       |       -           | No           |
| `width`               | `String` / `Number` | The width of the grid. Can be a pixel value (e.g., `'500px'`) or a percentage (e.g., `'100%'`).                             |    `'100%'`       | No           |
| `height`              | `String` / `Number` | The height of the grid. Can be a pixel value (e.g., `'300px'`) or a percentage (e.g., `'100%'`).                            |    `'300px'`      | No           |
| `maxWidth`            | `String` / `Number` | The maximum width of the grid.                                                                                              |    `'100vw'`      | No           |
| `maxHeight`           | `String` / `Number` | The maximum height of the grid.                                                                                             |    `'300px'`      | No           |
| `onRowClick`          | `Function`          | Callback function triggered when a row is clicked. The clicked row data is passed as an argument.                           |        -          | No           |
| `onRowHover`          | `Function`          | Callback function triggered when a row is hovered over.                                                                     |        -          | No           |
| `onRowOut`            | `Function`          | Callback function triggered when the mouse leaves a hovered row.                                                            |        -          | No           |
---
### **`columns` Prop Structure**

The `columns` prop defines the layout and behavior of each column in the `DataGrid`. It is an **array** of column objects, where each object represents a column's configuration.

| **Field**       | **Type**            | **Description**                                                                                                                                           | **Default Value** | **Required** |
| --------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------ |
| `name`          | `String`            | The display name of the column header, also acts as key or identifier for the column used to access corresponding data in each row.                       |        -          |  Yes         |
| `alias`         | `String`            | Provides an alternative name or alias for the column key. This alias can be used in column headers and other UI elements to make the grid more intuitive. |        -          |  No          |
| `width`         | `Number` / `String` | The width of the column. Can be a fixed pixel value (e.g., `100px`) or a percentage (e.g., `'20%'`). Default value is calculated dynamically.             |        -          |  No          | 
| `formatting`    | `Object`            | Formatting settings for the column. Includes the `type` (e.g., `currency`, `date`) and `format` (the format string, such as `$0,0.00`).                   |        -          |  No          |
| `searchEnable`  | `Boolean`           | Determines whether the search textbox is enabled for a specific column                                                                                    |       true        |  No          |
| `hidden`        | `Boolean`           | Whether the column should be hidden.                                                                                                                      |       false       |  No          |
| `concatColumns` | `Object`            | Specifies columns to concatenate into this column. It includes: `columns` (array of column keys to concatenate) and `separator` (the separator string).   |        -          |  No          |

---

#### **Example of `columns` Array:**

```jsx
const columns = [
  {
    name: 'ID',
    width: 50,
    formatting: { type: 'number', format: '0,0' },
  },
  {
    name: 'Name',
    alias: 'Full Name',
    width: '30%',
  },
  {
    name: 'DOB',
    alias: 'Birth Date',
    formatting: { type: 'Date', format: 'dd MMM yyyy'}
  },
  {
    name: 'row-identifier',
    hidden: true
  },

];
```
---
### **2. `options` Prop Structure**

The `options` prop is an **object** that provides additional configuration settings to further customize the behavior of the `DataGrid` component. These settings control various aspects of the grid, such as styling, button visibility, search options, and download functionality.

| **Field**            | **Type**  | **Description**                                                                                                                               | **Required** |
| -------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `gridClass`          | `String`  | Custom CSS class for the grid container.                                                                                                      | No           |
| `headerClass`        | `String`  | Custom CSS class for the header row.                                                                                                          | No           |
| `rowClass`           | `String`  | Custom CSS class for each row in the grid.                                                                                                    | No           |
| `enableColumnSearch` | `Boolean` | Whether to enable column-wise search functionality (search per individual column).                                                            | No           |
| `enableGlobalSearch` | `Boolean` | Whether to enable global search across all columns.                                                                                           | No           |
| `editButton`         | `Object`  | Configuration for enabling an edit button on each row. Includes an `event` field which is the function triggered when the button is clicked.  | No           |
| `deleteButton`       | `Object`  | Configuration for enabling a delete button on each row. Includes an `event` field which is the function triggered when the button is clicked. | No           |
| `enableDownload`     | `Boolean` | Whether to enable the download functionality (export data as CSV).                                                                            | No           |
| `downloadFilename`   | `String`  | The filename used when downloading the grid data (CSV format).                                                                                | No           |

---

#### **Example of `options` Object:**

```jsx
const options = {
  gridClass: 'custom-grid-class',
  headerClass: 'custom-header-class',
  rowClass: 'custom-row-class',
  enableColumnSearch: true,
  enableGlobalSearch: true,
  editButton: {
    event: (row) => { console.log('Edit row:', row); }
  },
  deleteButton: {
    event: (row) => { console.log('Delete row:', row); }
  },
  enableDownload: true,
  downloadFilename: 'data-grid-export.csv'
};
```

---

## 📑 Concatenating Columns

In some scenarios, you may want to combine data from multiple columns into a single column for display in your data grid. The `react-data-grid-lite` component supports this functionality by allowing you to concatenate columns.

This feature is useful when you want to show a combined value, such as **Department and Title**, as a single field (e.g., "HR-Manager") instead of displaying them separately. The `concatColumns` property helps you achieve this by specifying which columns to concatenate and what separator to use between their values.

### ⚠️ **Important Warning**:

> **Concatenating columns does not create a new column in the dataset**. Instead, the concatenated value will be displayed in the column you specify. This means that one of the columns in the dataset will be used to store the concatenated result, rather than introducing a completely new column in the dataset.


### ⚙️ Configuration

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

### 📝 Explanation:

* **`name: 'Department'`**: The primary column name, which will be used to access the data for concatenation.
* **`alias: 'Department-Title'`**: This alias defines the name that will appear in the header of the concatenated column.
* **`concatColumns`**: This property is used to specify which columns you want to concatenate.

  * **`columns: ['Department', 'Title']`**: Lists the columns to concatenate. In this case, it concatenates values from the **Department** and **Title** columns.
  * **`separator: '-'`**: Defines the separator to use between the concatenated values. Here, it’s a hyphen (`-`), so the combined value will be displayed as `Department-Title` (e.g., `HR-Manager`).

### 📊 Example:

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

### 🔄 Use Cases:

* **Combining First Name and Last Name**: You could concatenate a **FirstName** and **LastName** column into a **Full Name** column.
* **Combining Address Fields**: If your dataset has separate columns for street, city, and country, you can concatenate them into a single **Full Address** column.
* **Concatenating Department and Role**: Combining values like **Department** and **Title** into a more descriptive field, like **Department-Title**.

This feature simplifies the grid by consolidating data into a single column while preserving the original columns for internal use or further customization.

---

### ⚙️ Additional Notes:

* **Custom Separator**: You can adjust the separator based on your preference. For example, use a space (`' '`) or comma (`','`) depending on how you want the concatenated data to appear.
---

### 🚀 Try It Out!

Feel free to fork the repository and experiment with the grid's behavior for concatenating columns:

* Fork the repo: ![Fork Badge](https://img.shields.io/github/forks/ricky-sharma/react-data-grid-lite?style=social)
* Download ZIP: ![Download Badge](https://img.shields.io/badge/Download-ZIP-blue?style=flat\&logo=github)

Let me know if you'd like any further adjustments or clarification! Happy coding! 🎉

---

### Summary of Changes:

* **Icons**: Added icons for key sections (⚙️, 📝, 📊, 🔄) to visually enhance the readability of the section.
* **Badges**: Added badges for "Fork" and "Download" at the end to encourage engagement with the repo.
* **Clarifications**: Slightly modified the explanations and examples to make the concept more digestible.

---

## 🛠️ Development

To contribute to this project:

1. Clone the repository:

   ```bash
   git clone https://github.com/ricky-sharma/react-data-grid-lite.git
   cd react-data-grid-lite
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. To build the project:

   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

#React #ReactDataGrid #DataGrid #ReactTable #ReactComponents #GridComponent #DataGridLite #Pagination #Sorting #Filtering #ColumnSearch #ReactUI #ReactGrid #DataTable #TableComponent #DataGridFeatures #ReactPagination #ColumnSorting #ReactFiltering #ReactTableComponent #ResponsiveDataGrid #ReactSearchableGrid #SmallBundleSize #LegacyReactSupport #GridWithSortingAndFiltering #ReactJS #DataManagement #TableWithPagination #CustomizableGrid
