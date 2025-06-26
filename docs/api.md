# API Reference

### 🗂️ Documentation
- [Events](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/events.md)
- [Styling](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/styling.md)
- [Advanced Usage](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/advanced.md)
- [Format Guide](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/format_guide.md)
- [Examples](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/examples.md)
- [Project ReadMe](https://github.com/ricky-sharma/react-data-grid-lite#readme)

---

## 🔧 Props

| **Prop**              | **Type**            | **Description**                                                                                                             | **Default Value** | **Required** |
| --------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------ |
|    `id`               | `string`            | Unique ID for the DataGrid component. Defaults to a random ID in the format id-<randomNumber> if not provided. This feature is supported in version 1.0.5 and above.|       -           | No           |
|    `columns`          | `Array`             | Array of column definitions. Each column can have properties like `name`, `width`, 'alias', 'enableSearch', 'hidden'  etc.  |       -           | Yes          |
|    `data`             | `Array`             | Array of objects representing the rows of data to display.                                                                  |       -           | Yes          |
|    `pageSize`         | `String` / `Number` | Number of rows per page for pagination. If `null` or not provided, pagination is disabled.                                  |       -           | No           |
|    `currentPage`      | `String` / `Number` | Loads the data grid with the specified page number. Useful with query string params for deep linking or bookmarking. Supported in version `1.1.2` and above.|       -           | No           |
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
|    `onColumnResized`  | `Function`          | Callback function triggered after a column is resized. Supported in **v1.1.0 and above**.                                   |        -          | No           |
|    `theme`            | `string` (`'blue-core'` \| `'dark-stack'` \| `'medi-glow'` \| `''`)           | Applies a predefined visual theme to the grid. Affects header background, grid body background, borders, and control colors. Use an empty string to apply the default neutral style. Supported in **v1.1.1 and above**.|  `''` (empty string)   | No           |

<br><br>
## 📊 **`columns` Prop Structure**

The `columns` prop defines the layout and behavior of each column in the `DataGrid`. It is an **array** of column objects, where each object represents a column's configuration.

| **Field**       | **Type**            | **Description**                                                                                                                                           | **Default Value** | **Required** |
| --------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------ |
| `name`          | `String`            | The display name of the column header. It also serves as the key or identifier for accessing the corresponding data in each row. This value must be unique.|        -          |  Yes         |
| `alias`         | `String`            | Provides an alternative name or alias for the column key. This alias can be used in column headers and other UI elements to make the grid more intuitive. |        -          |  No          |
| `width`         | `Number` / `String` | The width of the column. Can be a fixed pixel value (e.g., `100px`) or a percentage (e.g., `'20%'`). Default value is calculated dynamically.             |        -          |  No          | 
| `formatting`    | `Object`            | Formatting settings for the column. Includes the `type` (e.g., `currency`, `date`) and `format` (the format string, such as `$0,0.00`).                   |        -          |  No          |
| `enableSearch`  | `Boolean`           | Enables or disables the search textbox for a specific column. Overrides the `enableGlobalSearch` setting. Renamed from `searchEnable` in v1.1.2 and above.|     `undefined`   |  No          |
| `hidden`        | `Boolean`           | Whether the column should be hidden.                                                                                                                      |       false       |  No          |
| `concatColumns` | `Object`            | Specifies columns to concatenate into this column. It includes: `columns` (array of column keys to concatenate) and `separator` (the separator string).   |        -          |  No          |
| `fixed`         | `Boolean`           | Specifies whether the column should be fixed. When enabled, the column will remain aligned to the left side of the grid based on its position in the column configuration. Supported in version `1.1.0` and above.|        false      |  No          |
| `class`         | `String`            | Custom CSS class applied to each data cell in the column. Supported in version `1.1.0` and above.                                                         |         -          |  No          |
| `resizable`     | `Boolean`           | Enables or disables resizing for a specific column. This setting overrides the `enableColumnResize` option. Supported in version `1.1.0` and above.       |     `undefined`    |  No          |
| `render`        | `function(formattedRow, baseRow) => React.ReactNode`| Custom render function for the column. Receives `formattedRow` (the transformed row data after formatting and concatenation) and `baseRow` (the original, unformatted row data). Should return a React node to be rendered in the cell. Available in version `1.1.3` and above.|     -    |  No          |


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
    name: 'status',
    alias: 'Status',
    render: (formattedRow, baseRow) => 
            <span className={`status-${formattedRow.status}`}>{formattedRow.status}</span>
  },
  {
    name: 'row-identifier',
    hidden: true
  }
];
```

<br>

### 🔍 Render Function Signature

```jsx
render: (formattedRow: object, baseRow: object) => React.ReactNode
```

| Parameter    | Type     | Description                           |
| ------------ | -------- | ------------------------------------- |
| `formattedRow`    | `object` | the transformed row data after formatting and concatenation                |
| `baseRow` | `object` | the original, unformatted row data |

<br>

#### Use Case Examples for Render Function

##### ✅ Custom Cell Rendering

```js
const columns = [
  {
    name: 'name',
    alias: 'Full Name',
    render: (row) => <strong>{row.name}</strong>
  },
  {
    name: 'email',
    alias: 'Email',
    render: (formattedRow) => (
        {% raw %}<a href={`mailto:${formattedRow.email}`} style={{ color: blue }}>
                {formattedRow.email}
        </a>{% endraw %}
    )
  },
  {
    name: 'status',
    alias: 'Active',
	formatting: { type: 'boolean' },
    render: (formattedRow, baseRow) => (
      <span
      {% raw %}style={{
          padding: '4px 8px',
          borderRadius: '12px',
          backgroundColor: baseRow.status === 'true' ? `#d4edda` : `#f8d7da`,
          color: baseRow.status === 'true' ? `#155724` : `#721c24`
        }}        {% endraw %}
      >
        {formattedRow.status}
      </span>
    )
  }
];

const data = [
  { name: 'Alice Johnson', email: 'alice@example.com', status: 'true' },
  { name: 'Bob Smith', email: 'bob@example.com', status: 'false' }
];

const App = () => (
  <DataGrid
    columns={columns}
    data={data}
    pageSize={10}
  />
);
```

##### ✅ Add Action Buttons in Column Cells

```jsx
{
  name: 'actions',
  alias: 'Actions',
  render: (row) => (
    <button onClick={() => alert(`Edit ${row.name}`)}>Edit</button>
  )
}
```
---

<br><br>

## ⚙️ **`options` Prop Structure**

The `options` prop is an **object** that provides additional configuration settings to further customize the behavior of the `DataGrid` component. These settings control various aspects of the grid, such as styling, button visibility, search options, and download functionality.

| **Field**            | **Type**  | **Description**                                                                                                           | **Default Value** | **Required** |
| -------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------|------------------ | ------------ |
| `gridClass`          | `String`  | Custom CSS class for the grid container.                                                                                  |       -           | No           |
| `headerClass`        | `String`  | Custom CSS class for the header row.                                                                                      |       -           | No           |
| `rowClass`           | `String`  | Custom CSS class for each row in the grid.                                                                                |       -           | No           |
| `enableColumnSearch` | `Boolean` | Whether to enable column-wise search functionality (search per individual column).                                        |      true         | No           |
| `enableGlobalSearch` | `Boolean` | Enables global search across all columns. Column-level search settings override this option.                              |      true         | No           |
| `editButton`         | `Object`  | Configuration for enabling an edit button on each row. Includes an `event` field which is the function triggered when the button is clicked.|        -     | No           |
| `deleteButton`       | `Object`  | Configuration for enabling a delete button on each row. Includes an `event` field which is the function triggered when the button is clicked.|       -      | No           |
| `enableDownload`     | `Boolean` | Whether to enable the download functionality (export data as CSV).                                                        |      true         | No           |
| `downloadFilename`   | `String`  | The filename used when downloading grid data in CSV format. The default value is `'export-{yyyy-MM-dd HH:mm:ss}'`         |       -           | No           |
| `onDownloadComplete` | `Function`| Callback function that enables post-download handling such as logging, notifications, or emailing downloaded files.       |       -           | No           |
| `enableColumnResize` | `Boolean` | Enables column resizing across all columns. Column-level `resizable settings` override this option. Supported in version `1.1.0` and above.|      false        | No           |
| `actionColumnAlign`  | `string` (`'left'` \| `'right'` \| `''`)  | Controls alignment of the Actions column. Set to `'left'` or `'right'` to fix its position. Leave empty to allow the column to scroll with the rest of the table. Supported in **v1.1.1 and above**.|      `''` (empty string)        | No           |


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
