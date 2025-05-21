
[![npm](https://img.shields.io/npm/v/react-data-grid-lite.svg)](https://www.npmjs.com/package/react-data-grid-lite)
![License](https://img.shields.io/github/license/ricky-sharma/react-data-grid-lite)
![Last Commit](https://img.shields.io/github/last-commit/ricky-sharma/react-data-grid-lite)
[![Download Badge](https://img.shields.io/badge/Download-ZIP-blue?style=flat&logo=github)](https://github.com/ricky-sharma/react-data-grid-lite/archive/refs/heads/master.zip)
![Forks](https://img.shields.io/github/forks/ricky-sharma/react-data-grid-lite?style=social)
![npm](https://img.shields.io/npm/dt/react-data-grid-lite)

[![Edit react-data-grid-lite example on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/ricky-sharma/react-data-grid-lite/tree/master/example)

# React Data Grid Lite

A lightweight and customizable React data grid component designed for high performance and ease of use. The DataGrid component is a highly customizable, feature-rich table component designed to display tabular data in a React application. It is intended for use cases where large datasets need to be presented with advanced features such as pagination, sorting, searching, row interactions, and more.

Moreover, the component is fully compatible with older versions of React, ensuring flexibility and ease of integration for projects that may not be using the latest React release. Whether you are building a simple data table or a complex enterprise-level UI, the `DataGrid` component can be seamlessly adapted to your needs. 

### **Key Highlights:**

* **Lightweight**: The component is optimized for small bundle size, ensuring fast load times and minimal impact on your application's overall performance.
* **Backward Compatibility**: It supports older React versions, allowing you to use it in legacy applications without upgrading to the latest React version.
---

![react-data-grid-lite](https://github.com/user-attachments/assets/948c8601-0c36-42d7-8cbf-b7753c634182)

---

## React Compatibility Table

The `react-data-grid-lite` library is compatible with the following versions of React:

| **React Version** | **Compatibility**  |
| ----------------- | ------------------ |
| **React 18**      | ✅ Fully Compatible |
| **React 19**      | ✅ Fully Compatible |

### Notes:

* **React 18**: Fully compatible with **React 18**, with all major features fully supported.
* **React 19**: Fully compatible with **React 19**, and all features are tested and supported.

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
            alert('Edit Button clicked!');
            console.log(row);
        }
    },
    deleteButton: {
        event: (e, row) => {
            alert('Delete Button clicked!');
            console.log(row);
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
| `width`               | `String` / `Number` | The width of the grid. Can be a pixel value (e.g., `'500px'`) or a percentage (e.g., `'100%'`).                             |    `'90vw'`       | No           |
| `height`              | `String` / `Number` | The height of the grid. Can be a pixel value (e.g., `'300px'`) or a percentage (e.g., `'100%'`).                            |    `'300px'`      | No           |
| `maxWidth`            | `String` / `Number` | The maximum width of the grid.                                                                                              |    `'100vw'`      | No           |
| `maxHeight`           | `String` / `Number` | The maximum height of the grid.                                                                                             |    `'300px'`      | No           |
| `onRowClick`          | `Function`          | Callback function triggered when a row is clicked. The clicked row data is passed as an argument.                           |        -          | No           |
| `onRowHover`          | `Function`          | Callback function triggered when a row is hovered over.                                                                     |        -          | No           |
| `onRowOut`            | `Function`          | Callback function triggered when the mouse leaves a hovered row.                                                            |        -          | No           |

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
### **`options` Prop Structure**

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

### 📡 Example: Consuming Remote API Data

This example shows how to fetch and display data from a remote API using `react-data-grid-lite`. It demonstrates how to:

* Dynamically build column definitions from API response keys.
* Transform and format certain columns (e.g. combining names).
* Exclude or hide sensitive or unnecessary fields.
* Render the data in a performant, paginated grid with actions.

### 🔗 API Used

**[fakerapi.it](https://fakerapi.it)** – Returns fake user data for testing:

```
GET https://fakerapi.it/api/v1/users?_quantity=1000
```

### 🧩 Dynamic Column Mapping

Column definitions are generated by inspecting API response keys and applying logic to:

* **Rename** columns (e.g. `firstname` → `Name`)
* **Combine** fields (e.g. `firstname + lastname`)
* **Hide** sensitive or redundant columns (e.g. `password`, `macaddress`)

This approach is flexible and adapts to schema changes without hardcoding each field.

#### 🚀 Code

```jsx
import React, { useEffect, useState } from 'react';
import DataGrid from 'react-data-grid-lite';

function App() {
    const [users, setUsers] = useState([]);
    const [userColumns, setUserColumns] = useState({});

    useEffect(() => {
        fetch('https://fakerapi.it/api/v1/users?_quantity=1000')
            .then(response => response.json())
            .then(data => {
                const Columns = Object.keys(data.data[0])
                setUserColumns(Columns.map((val) => {
                    if (val.toLowerCase() === 'id')
                        return {
                            name: val,
                            alias: 'ID'
                        }
                    else if (val.toLowerCase() === 'uuid')
                        return {
                            name: val,
                            alias: 'UUID'                           
                        }
                    else if (val.toLowerCase() === 'email')
                        return {
                            name: val,
                            alias: 'Email'
                        }
                    else if (val.toLowerCase() === 'image')
                        return {
                            name: val,
                            alias: 'Image'
                        }
                    else if (val.toLowerCase() === 'firstname')
                        return {
                            name: val,
                            alias: 'Name',
                            cssClass: 'nameColumn',
                            concatColumns: {
                                columns: ['firstname', 'lastname']
                            }
                        }
                    else if (
                        val.toLowerCase() === 'lastname' ||
                        val.toLowerCase() === 'username' ||
                        val.toLowerCase() === 'ip' ||
                        val.toLowerCase() === 'macaddress' ||
                        val.toLowerCase() === 'password'
                    )
                        return {
                            name: val,
                            hidden: true
                        }
                    else
                        return { name: val }
                }));
                setUsers(data.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <h1>React Data Grid Lite Example</h1>
            </div>
            <div>
                <DataGrid
                    columns={userColumns}
                    data={users}
                    pageSize={20}
                    height={"600px"}
                    maxHeight={"600px"}
                />
            </div>
        </div>
    );
}

export default App;
```

### ✅ Key Features

* 📦 **Remote API support**: Plug in any JSON API.
* 🛠️ **Flexible column logic**: Auto-adapts to the API schema.
* 🔍 **Searchable and alias columns**: Improves UX and readability.
* 🧾 **CSV export**: Download the entire grid.
* ✏️ **Edit/Delete** buttons: Easily hook into row-level actions.

---

## 📑 Concatenating Columns

In some scenarios, you may want to combine data from multiple columns into a single column for display in your data grid. The `react-data-grid-lite` component supports this functionality by allowing you to concatenate columns.

This feature is useful when you want to show a combined value, such as **Department and Title**, as a single field (e.g., "HR-Manager") instead of displaying them separately. The `concatColumns` property helps you achieve this by specifying which columns to concatenate and what separator to use between their values.

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

#### 🔄 Use Cases:

* **Combining First Name and Last Name**: You could concatenate a **FirstName** and **LastName** column into a **Full Name** column.
* **Combining Address Fields**: If your dataset has separate columns for street, city, and country, you can concatenate them into a single **Full Address** column.
* **Concatenating Department and Role**: Combining values like **Department** and **Title** into a more descriptive field, like **Department-Title**.

This feature simplifies the grid by consolidating data into a single column while preserving the original columns for internal use or further customization.

##### 🔄 Additional Notes:

* **Custom Separator**: You can adjust the separator based on your preference. For example, use a space (`' '`) or comma (`','`) depending on how you want the concatenated data to appear.

#### 📌 **Important**:

> **Concatenating columns does not create a new column in the dataset**. Instead, the concatenated value will be displayed in the column you specify. This means that one of the columns in the dataset will be used to store the concatenated result, rather than introducing a completely new column in the dataset.


---

## ⚙️ Custom CSS Classes for Grid

The `react-data-grid-lite` component allows you to apply custom CSS classes to various parts of the grid, such as the entire grid container, the header row, and each individual row. You can use the following props to add custom styles:

| **Prop Name** | **Type** | **Description**                            | **Required** |
| ------------- | -------- | ------------------------------------------ | ------------ |
| `gridClass`   | `String` | Custom CSS class for the grid container.   | No           |
| `headerClass` | `String` | Custom CSS class for the header row.       | No           |
| `rowClass`    | `String` | Custom CSS class for each row in the grid. | No           |


#### 📝 Example:

Here’s how you can use these props to add custom styles:

```javascript
<DataGrid
  options={
    gridClass: "my-custom-grid",
    headerClass: "my-custom-header",
    rowClass: "my-custom-row"
  }
  columns={columns}
  data={data}
/>
```

In this example, `my-custom-grid`, `my-custom-header`, and `my-custom-row` would be the CSS classes you define in your stylesheet.

```css
/*Custom Styles*/
.my-custom-grid {
    background-color: #c0cad3 !important;
    border: 3px solid #c0cad3 !important;
    box-shadow: 0 0 0 3px #c0cad3 !important;
}

.my-custom-header {
    background-color: #cfcfcf !important;
}

.my-custom-row:nth-child(even) {
    background-color: #e7e0e4 !important;
}

.my-custom-row:nth-child(odd) {
    background-color: #f3f4f9 !important;
}

.my-custom-row {
    border-bottom: 1px solid #4f4d4d !important;
}

    .my-custom-row:hover {
        background-color: #e0e0e0 !important;
    }
```
![image](https://github.com/user-attachments/assets/6b722933-000e-4e03-9f8d-bb0338318991)

#### 🔄 Additional Notes:

* Ensure that the custom styles don’t conflict with the default styles of the grid to maintain proper layout and functionality.

While the `gridClass`, `headerClass`, and `rowClass` props allow you to apply custom CSS classes to the grid and its elements, the styles might not be perfectly aligned with your desired layout or design out-of-the-box. Depending on your project’s design system or CSS framework, you may need to adjust or override these styles to ensure they work as intended.

---

### 🚀 Try It Out!

Feel free to fork the repository and experiment with the grid's behavior for concatenating columns:

* Fork the repo: ![Fork Badge](https://img.shields.io/github/forks/ricky-sharma/react-data-grid-lite?style=social)
[![Download Badge](https://img.shields.io/badge/Download-ZIP-blue?style=flat&logo=github)](https://github.com/ricky-sharma/react-data-grid-lite/archive/refs/heads/master.zip)

Let me know if you'd like any further adjustments or clarification! Happy coding! 🎉

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
