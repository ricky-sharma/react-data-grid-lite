# API Reference

---

## 🔧 Props

| **Prop**              | **Type**            | **Description**                                                                                                             | **Default Value** | **Required** |
| --------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------ |
|    `columns`          | `Array`             |Array of column definitions. Each column can have properties like `name`, `width`, 'alias', 'searchEnable', 'hidden'  etc.   |     `null`        | Yes          |
|    `data`             | `Array`             | Array of objects representing the rows of data to display.                                                                  |     `null`        | Yes          |
|    `pageSize`         | `Number`            | Number of rows per page for pagination. If `null` or not provided, pagination is disabled.                                  |     `null`        | No           |
|    `options`          | `Object`            | An object for additional customization. Contains options like `gridClass`, `enableGlobalSearch`, etc.                       |       -           | No           |
|    `width`            | `String` / `Number` | The width of the grid. Can be a pixel value (e.g., `'500px'`) or a percentage (e.g., `'100%'`). Recommended for optimal display of the column. The width can be set to `'inherit'` to match the width of the containing element.|    `'90vw'`       | No           |
|    `height`           | `String` / `Number` | The height of the grid. Can be a pixel value (e.g., `'300px'`) or a percentage (e.g., `'100%'`). Recommended for optimal display of the column. |    `'60vh'`       | No           |
|    `maxWidth`         | `String` / `Number` | The maximum width of the grid.                                                                                              |    `'100vw'`      | No           |
|    `maxHeight`        | `String` / `Number` | The maximum height of the grid.                                                                                             |    `'100vh'`      | No           |
|    `onRowClick`       | `Function`          | Callback function triggered when a row is clicked. The clicked row data is passed as an argument.                           |        -          | No           |
|    `onRowHover`       | `Function`          | Callback function triggered when a row is hovered over.                                                                     |        -          | No           |
|    `onRowOut`         | `Function`          | Callback function triggered when the mouse leaves a hovered row.                                                            |        -          | No           |
|    `onSortComplete`   | `Function`          | Callback function triggered after sorting finishes.                                                                         |        -          | No           |
|    `onSearchComplete` | `Function`          | Callback function triggered after a search operation.                                                                       |        -          | No           |
|    `onPageChange`     | `Function`          | Callback function triggered when the user navigates to a different page.                                                    |        -          | No           |

<br><br>
## 📊 **`columns` Prop Structure**

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
<br><br>
## ⚙️ **`options` Prop Structure**

The `options` prop is an **object** that provides additional configuration settings to further customize the behavior of the `DataGrid` component. These settings control various aspects of the grid, such as styling, button visibility, search options, and download functionality.

| **Field**            | **Type**  | **Description**                                                                                                           | **Default Value** | **Required** |
| -------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------|------------------ | ------------ |
| `gridClass`          | `String`  | Custom CSS class for the grid container.                                                                                  |       -           | No           |
| `headerClass`        | `String`  | Custom CSS class for the header row.                                                                                      |       -           | No           |
| `rowClass`           | `String`  | Custom CSS class for each row in the grid.                                                                                |       -           | No           |
| `enableColumnSearch` | `Boolean` | Whether to enable column-wise search functionality (search per individual column).                                        |      true         | No           |
| `enableGlobalSearch` | `Boolean` | Whether to enable global search across all columns.                                                                       |      true         | No           |
| `editButton`         | `Object`  | Configuration for enabling an edit button on each row. Includes an `event` field which is the function triggered when the button is clicked.|        -     | No           |
| `deleteButton`       | `Object`  | Configuration for enabling a delete button on each row. Includes an `event` field which is the function triggered when the button is clicked.|       -      | No           |
| `enableDownload`     | `Boolean` | Whether to enable the download functionality (export data as CSV).                                                        |      true         | No           |
| `downloadFilename`   | `String`  | The filename used when downloading grid data in CSV format. The default value is `'export-{yyyy-MM-dd HH:mm:ss}'`         |       -           | No           |
| `onDownloadComplete` | `Function`| Callback function that enables post-download handling such as logging, notifications, or emailing downloaded files.       |       -           | No           |


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
