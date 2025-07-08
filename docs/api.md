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
|    `columns`          | `Array`             | Array of column definitions. Each column can have properties like `name`, `width`, 'alias', 'enableSearch', 'hidden'  etc.  |       -           | Yes          |
|    `currentPage`      | `String` / `Number` | Loads the data grid with the specified page number. Useful with query string params for deep linking or bookmarking. Supported in `version 1.1.2` and above.|       -           | No           |
|    `data`             | `Array`             | Array of objects representing the rows of data to display.                                                                  |       -           | Yes          |
|    `height`           | `String` / `Number` | The height of the grid. Can be a pixel value (e.g., `'300px'`) or a percentage (e.g., `'100%'`). Recommended for optimal display of the column. |    `'60vh'`       | No           |
|    `id`               | `string`            | Unique ID for the DataGrid component. Defaults to a random ID in the format id-<randomNumber> if not provided. This feature is supported in `version 1.0.5` and above.|       -           | No           |
|    `maxHeight`        | `String` / `Number` | The maximum height of the grid.                                                                                             |    `'100vh'`      | No           |
|    `maxWidth`         | `String` / `Number` | The maximum width of the grid.                                                                                              |    `'100vw'`      | No           |
|    `onCellUpdate`     | `Function`          | Callback triggered when a cell edit is saved (e.g., on Enter key press or on cell blur). Receives an object containing details of the updated row and changed cells. Supported in `version 1.1.5` and above.|        -          | No           |
|    `onColumnDragEnd`  | `Function`          | Callback function triggered after a column is dragged and dropped. Supported in `v1.1.4` and above.                       |        -          | No           |
|    `onColumnResized`  | `Function`          | Callback function triggered after a column is resized. Supported in `v1.1.0` and above.                                   |        -          | No           |
|    `onPageChange`     | `Function`          | Callback function triggered when the user navigates to a different page.                                                    |        -          | No           |
|    `onRowClick`       | `Function`          | Callback function triggered when a row is clicked. The clicked row data is passed as an argument.                           |        -          | No           |
|    `onRowHover`       | `Function`          | Callback function triggered when a row is hovered over.                                                                     |        -          | No           |
|    `onRowOut`         | `Function`          | Callback function triggered when the mouse leaves a hovered row.                                                            |        -          | No           |
|    `onSearchComplete` | `Function`          | Callback function triggered after a search operation.                                                                       |        -          | No           |
|    `onSortComplete`   | `Function`          | Callback function triggered after sorting finishes.                                                                         |        -          | No           |
|    `options`          | `Object`            | An object for additional customization. Contains options like `gridClass`, `enableGlobalSearch`, etc.                       |       -           | No           |
|    `pageSize`         | `String` / `Number` | Number of rows per page for pagination. If `null` or not provided, pagination is disabled.                                  |       -           | No           |
|    `theme`            | `string` (`'blue-core'` \| `'dark-stack'` \| `'medi-glow'` \| `''`)           | Applies a predefined visual theme to the grid. Affects header background, grid body background, borders, and control colors. Use an empty string to apply the default neutral style. Supported in `v1.1.1` and above.|  `''` (empty string)   | No           |
|    `width`            | `String` / `Number` | The width of the grid. Can be a pixel value (e.g., `'500px'`) or a percentage (e.g., `'100%'`). Recommended for optimal display of the column. The width can be set to `'inherit'` to match the width of the containing element.|    `'90vw'`       | No           |

<br><br>

## 📊 **`columns` Prop Structure**

The `columns` prop defines the layout and behavior of each column in the `DataGrid`. It is an **array** of column objects, where each object represents a column's configuration.

| **Field**       | **Type**            | **Description**                                                                                                                                           | **Default Value** | **Required** |
| --------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------ |
| `alias`         | `String`            | Provides an alternative name or alias for the column key. This alias can be used in column headers and other UI elements to make the grid more intuitive. |        -          |  No          |
| `class`         | `String`            | Custom CSS class applied to each data cell in the column. Supported in `version 1.1.0` and above.                                                         |         -         |  No          |
| `concatColumns` | `Object`            | Specifies columns to concatenate into this column. It includes: `columns` (array of column keys to concatenate) and `separator` (the separator string).   |        -          |  No          |
| `draggable`     | `Boolean`           | Enables or disables dragging for an individual column. Overrides the global `enableColumnDrag` setting. Fixed columns can be reordered among themselves, and non-fixed columns among their own group. Supported in `version 1.1.4` and above.|       false       |  No          |
| `editable`      | `Boolean`           | Enables or disables cell editing for a specific column. Overrides the enableCellEdit setting. Cell editing is fully accessible via keyboard, touch, and mouse. Press Enter to save changes or Esc to cancel. When a change is saved, the `onCellUpdate` callback is fired. Supported in `version 1.1.5` and above.|       false        |  No          |
| `editor`        | `String` / `Object` / `Array` | Enables inline editing for the column. Can be a shorthand string (`'text'`, `'number'`) or an object (`'select'`) with detailed configuration. When used with `concatColumns`, this can be an array matching the column parts.<br><br>💡 **Default behavior:** If `editor` is not provided but `editable: true` is set (or `enableCellEdit` is enabled globally), the field defaults to a `'text'` input editor. Supported in `version 1.1.5` and above.| `'text'` (if `editable` is `true`) | No       |
| `enableSearch`  | `Boolean`           | Enables or disables the search textbox for a specific column. Overrides the `enableColumnSearch` setting. Renamed from `searchEnable` in `v1.1.2` and above.|       true        |  No          |
| `fixed`         | `Boolean`           | Specifies whether the column should be fixed. When enabled, the column will remain aligned to the left side of the grid based on its position in the column configuration. Supported in `version 1.1.0` and above.|        false      |  No          |
| `formatting`    | `Object`            | Formatting settings for the column. Includes the `type` (e.g., `currency`, `date`) and `format` (the format string, such as `$0,0.00`).                   |        -          |  No          |
| `hidden`        | `Boolean`           | Whether the column should be hidden.                                                                                                                      |       false       |  No          |
| `name`          | `String`            | The display name of the column header. It also serves as the key or identifier for accessing the corresponding data in each row. This value must be unique.|        -         |  Yes         |
| `order`         | `Number`            | Specifies the display order of the column (integer value), starting from 1. Supported in version `1.1.4` and above.                                       |        -          |  No          | 
| `render`        | `function(formattedRow, baseRow) => React.ReactNode`| Custom render function for the column. Receives `formattedRow` (the transformed row data after formatting and concatenation) and `baseRow` (the original, unformatted row data). Should return a React node to be rendered in the cell. Available in version `1.1.3` and above.|     -    |  No          |
| `resizable`     | `Boolean`           | Enables or disables resizing for a specific column. This setting overrides the `enableColumnResize` option. Supported in version `1.1.0` and above.       |       false       |  No          |
| `width`         | `Number` / `String` | The width of the column. Can be a fixed pixel value (e.g., `100px`) or a percentage (e.g., `'20%'`). Default value is calculated dynamically.             |        -          |  No          | 


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

### Editor Shorthand Values

| Value        | Description                         |
| ------------ | ----------------------------------- |
| `'text'`     | Basic text input (default)          |
| `'number'`   | Numeric input                       |


### Full Editor Object Format

| Property    | Type                                                               | Description                                            |
| ----------- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| `type`      | `'text'` \| `'number'` \| `'select'`                               | Input type                                             |
| `values`    | `Array<string>` \| `Array<{ label: string, value: any }>`          | Required for `'select'` type                           |


#### ✅ Example: Simple Column with a Select Editor

```jsx
{
  name: 'Role',
  editable: true,
  editor: {
    type: 'select',
    values: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' }
    ]
  }
}
```

#### 📝 Alternate (shorthand) version

```jsx
{
  name: 'firstName',
  editable: true,
  editor: 'text'
}
```

### Usage with `concatColumns`

| Field    | Type                      | Description                                                                                                                               |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `editor` | `Array<string \| object>` | Should match the order and count of fields in the `columns` array of `concatColumns`. Each item can be a string shorthand or full config. |

#### Example:

```jsx
{
  alias: 'Department-Title',
  name: 'Department',
  editable: true,
  concatColumns: {
    columns: ['Department', 'Title'],
    separator: ' - ',
    editor: [
      {
        type: 'select',
        values: [
          { label: 'Engineering', value: 'engineering' },
          { label: 'Marketing', value: 'marketing' },
          { label: 'HR', value: 'hr' }
        ]
      },
      {
        type: 'select',
        values: [
          { label: 'Manager', value: 'manager' },
          { label: 'Lead', value: 'lead' },
          { label: 'Intern', value: 'intern' }
        ]
      }
    ]
  }
}
```

<br><br>

## ⚙️ **`options` Prop Structure**

The `options` prop is an **object** that provides additional configuration settings to further customize the behavior of the `DataGrid` component. These settings control various aspects of the grid, such as styling, button visibility, search options, and download functionality.

| **Field**            | **Type**  | **Description**                                                                                                           | **Default Value** | **Required** |
| -------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------|------------------ | ------------ |
| `actionColumnAlign`  | `string` (`'left'` \| `'right'` \| `''`)  | Controls alignment of the Actions column. Set to `'left'` or `'right'` to fix its position. Leave empty to allow the column to scroll with the rest of the table. Supported in **v1.1.1 and above**.|      `''` (empty string)        | No           |
| `deleteButton`       | `Object`  | Configuration for enabling a delete button on each row. Includes an `event` field which is the function triggered when the button is clicked.|       -      | No           |
| `downloadFilename`   | `String`  | The filename used when downloading grid data in CSV format. The default value is `'export-{yyyy-MM-dd HH:mm:ss}'`         |       -           | No           |
| `editButton`         | `Object`  | Configuration for enabling an edit button on each row. Includes an `event` field which is the function triggered when the button is clicked.|        -     | No           |
| `enableCellEdit`     | `Boolean` | Enables cell editing for all columns. Column-level `editable` settings override this option. Cell editing is fully accessible via keyboard, touch, and mouse. Press `Enter` to save changes or `Esc` to cancel. When a change is saved, the `onCellUpdate` callback is fired. Supported in version `1.1.5` and above.|      false         | No           |
| `enableColumnDrag`   | `Boolean` | Enables column dragging for all columns. Column-level `draggable` settings override this option. Fixed columns can be reordered among themselves, and non-fixed columns among their own group. Supported in version `1.1.4` and above.|      false         | No           |
| `enableColumnResize` | `Boolean` | Enables column resizing across all columns. Column-level `resizable` settings override this option. Supported in version `1.1.0` and above.|      false        | No           |
| `enableColumnSearch` | `Boolean` | Whether to enable column-wise search functionality (search per individual column). Column-level search settings override this option.|      true         | No           |
| `enableDownload`     | `Boolean` | Whether to enable the download functionality (export data as CSV).                                                        |      true         | No           |
| `enableGlobalSearch` | `Boolean` | Enables global search across all columns.                                                                                 |      true         | No           |
| `gridClass`          | `String`  | Custom CSS class for the grid container.                                                                                  |       -           | No           |
| `headerClass`        | `String`  | Custom CSS class for the header row.                                                                                      |       -           | No           |
| `onDownloadComplete` | `Function`| Callback function that enables post-download handling such as logging, notifications, or emailing downloaded files.       |       -           | No           |
| `rowClass`           | `String`  | Custom CSS class for each row in the grid.                                                                                |       -           | No           |


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
