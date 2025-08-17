# API Reference

### 🗂️ Documentation
- [AI Search Integration](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/ai_search_integration.md)
- [Events](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/events.md)
- [Styling](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/styling.md)
- [Advanced Usage](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/advanced.md)
- [Format Guide](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/format_guide.md)
- [Examples](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/examples.md)
- [Imperative Grid API](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/datagrid_ref_methods.md)
- [Project ReadMe](https://github.com/ricky-sharma/react-data-grid-lite#readme)

---

## 🔧 Props

| **Prop**              | **Type**            | **Description**                                                                                                             | **Default Value** | **Required** |
| --------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------ |
|    `columns`          | `Array`             | Array of column definitions. Each column can have properties like `name`, `width`, 'alias', 'enableSearch', 'hidden'  etc.  |       -           | Yes          |
|    `currentPage`      | `string` / `number` | Loads the data grid with the specified page number. Useful with query string params for deep linking or bookmarking.|       -           | No           |
|    `data`             | `Array`             | Array of objects representing the rows of data to display.                                                                  |       -           | Yes          |
|    `height`           | `string` / `number` | The height of the grid. Can be a pixel value (e.g., `'300px'`) or a percentage (e.g., `'100%'`). Recommended for optimal display of the column. |    `'60vh'`       | No           |
|    `id`               | `string`            | Unique ID for the DataGrid component. Defaults to a random ID in the format `id-<randomNumber>` if not provided.|       -           | No           |
|    `maxHeight`        | `string` / `number` | The maximum height of the grid.                                                                                             |    `'100vh'`      | No           |
|    `maxWidth`         | `string` / `number` | The maximum width of the grid.                                                                                              |    `'100vw'`      | No           |
|    `onCellUpdate`     | `function`          | Callback triggered when a cell edit is saved (e.g., on Enter key press or on cell blur). Receives an object containing details of the updated row and changed cells.|        -          | No           |
|    `onColumnDragEnd`  | `function`          | Callback function triggered after a column is dragged and dropped.                                                          |        -          | No           |
|    `onColumnResized`  | `function`          | Callback function triggered after a column is resized.                                                                      |        -          | No           |
|    `onPageChange`     | `function`          | Callback function triggered when the user navigates to a different page.                                                    |        -          | No           |
|    `onRowClick`       | `function`          | Callback function triggered when a row is clicked. The clicked row data is passed as an argument.                           |        -          | No           |
|    `onRowHover`       | `function`          | Callback function triggered when a row is hovered over.                                                                     |        -          | No           |
|    `onRowOut`         | `function`          | Callback function triggered when the mouse leaves a hovered row.                                                            |        -          | No           |
|    `onRowSelect`      | `function`          | Callback function triggered when a row is selected using the selection column. Available in version `1.2.2` and above.      |        -          | No           |
|    `onSearchComplete` | `function`          | Callback function triggered after a search operation.                                                                       |        -          | No           |
|    `onSelectAll`      | `function`          | Callback function triggered when all rows on the current page are selected by clicking the selection column header. Available in version `1.2.2` and above.|        -          | No           |
|    `onSortComplete`   | `function`          | Callback function triggered after sorting finishes.                                                                         |        -          | No           |
|    `options`          | `object`            | An object for additional customization. Contains options like `gridClass`, `enableGlobalSearch`, etc.                       |       -           | No           |
|    `pageSize`         | `string` / `number` | Number of rows per page for pagination. If `null` or not provided, pagination is disabled.                                  |       -           | No           |
|    `theme`            | `string` (`'blue-core'` \| `'dark-stack'` \| `'medi-glow'` \| `''`)           | Applies a predefined visual theme to the grid. Affects header background, grid body background, borders, and control colors. Use an empty string to apply the default neutral style.|  `''` (empty string)   | No           |
|    `width`            | `string` / `number` | The width of the grid. Can be a pixel value (e.g., `'500px'`) or a percentage (e.g., `'100%'`). Recommended for optimal display of the column. The width can be set to `'inherit'` to match the width of the containing element.|    `'90vw'`       | No           |

<br><br>

## 📊 **`columns` Prop Structure**

The `columns` prop defines the layout and behavior of each column in the `DataGrid`. It is an **array** of column objects, where each object represents a column's configuration.

| **Field**       | **Type**            | **Description**                                                                                                                                           | **Default Value** | **Required** |
| --------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------ |
| `alias`         | `string`            | Provides an alternative name or alias for the column key. This alias can be used in column headers and other UI elements to make the grid more intuitive. |         -          |  No          |
| `cellStyle`     | `object`            | Applies custom styles to the `<td>` cell. Useful for matching `headerStyle`-defined widths or aligning text consistently. Use with caution: this affects only row cells. Setting layout-affecting properties (e.g. `width`) differently from headers may cause misalignment. Supported in `version 1.1.10` and above.|        -          |  No          |
| `class`         | `string`            | Custom CSS class applied to each data cell in the column.                                                                                                 |         -         |  No          |
| `concatColumns` | `object`            | Specifies columns to concatenate into this column. It includes: `columns` (array of column keys to concatenate) and `separator` (the separator string).   |         -          |  No          |
| `draggable`     | `boolean`           | Enables or disables dragging for an individual column. Overrides the global `enableColumnDrag` setting. Fixed columns can be reordered among themselves, and non-fixed columns among their own group.|       -       |  No          |
| `editable`      | `boolean`           | Enables or disables cell editing for a specific column. Overrides the `enableCellEdit` setting. Cell editing is fully accessible via keyboard, touch, and mouse. A `<td>` cell enters edit mode when double-clicked with a mouse, by pressing **Enter** on the keyboard, or with a firm tap on mobile devices. To save changes, press **Enter** on the keyboard, click outside the cell (mouse), or tap outside (touch). Press **Esc** to cancel. When a change is saved, the `onCellUpdate` callback is fired.|       -         |  No          |
| `editor`        | `string` / `object` / `Array` | Enables inline editing for the column. Can be a shorthand string (`'text'`, `'number'`) or an object (`'select'`) with detailed configuration. When used with `concatColumns`, this can be an array matching the column parts.<br><br>💡 **Default behavior:** If `editor` is not provided but `editable: true` is set (or `enableCellEdit` is enabled globally), the field defaults to a `'text'` input editor.| `'text'` (if `editable` is `true`) | No       |
| `enableSearch`  | `boolean`           | Enables or disables the search textbox for a specific column. Overrides the `enableColumnSearch` setting.                                                 |        -        |  No          |
| `fixed`         | `boolean`           | Specifies whether the column should be fixed. When enabled, the column will remain aligned to the left side of the grid based on its position in the column configuration.|        false      |  No          |
| `formatting`    | `object`            | Formatting settings for the column. Includes the `type` (e.g., `currency`, `date`) and `format` (the format string, such as `$0,0.00`).                   |        -          |  No          |
| `headerStyle`   | `object`            |  Applies custom styles to the `<th>` (header) cell. Useful for matching `cellStyle`-defined widths or aligning text consistently. Supported in `version 1.1.10` and above.|        -          |  No          |
| `hidden`        | `boolean`           | Whether the column should be hidden.                                                                                                                      |       false       |  No          |
| `name`          | `string`            | The display name of the column header. It also serves as the key or identifier for accessing the corresponding data in each row. This value must be unique.|        -         |  Yes         |
| `order`         | `number`            | Specifies the display order of the column (integer value), starting from 1.                                                                               |        -          |  No          | 
| `render`        | `function(formattedRow, baseRow) => React.ReactNode`| Custom render function for the column. Receives `formattedRow` (the transformed row data after formatting and concatenation) and `baseRow` (the original, unformatted row data). Should return a React node to be rendered in the cell.|     -    |  No          |
| `resizable`     | `boolean`           | Enables or disables resizing for a specific column. This setting overrides the `enableColumnResize` option.                                               |        -          |  No          |
| `searchPlaceholder` | `string`        | Sets the placeholder text for individual column search input fields. Useful for customization or localization.                                            | `"Search column…"` | No       |
| `sortable`      | `boolean`           | Enables or disables sorting for an individual column. Overrides the global `enableSorting` setting. Supported in version `1.2.2` and above.               |        -          |  No          |
| `width`         | `number` / `string` | The width of the column. Can be a fixed pixel value (e.g., `100px`) or a percentage (e.g., `'20%'`). Default value is calculated dynamically.             |        -          |  No          | 


#### **Example of `columns` Array:**

```jsx
const columns = [
  {
    name: 'ID',
    formatting: { type: 'number', format: '0,0' },
    cellStyle: { textAlign: 'center', width: '70px' },
    headerStyle: { width: '70px' }
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
| `actionColumnAlign`  | `string` (`'left'` \| `'right'` \| `''`)  | Controls alignment of the Actions column. Set to `'left'` or `'right'` to fix its position. Leave empty to allow the column to scroll with the rest of the table.|      `'right'`        | No           |
| `aiSearch`           | `object`  | Configuration object to enable AI search functionality in the data grid. Supported in version `1.2.0` and above. For more details, refer to the [`AI Search Integration`](./ai_search_integration.md) document.|       -      | No           |
| `debug`              | `boolean` | Enables debug logging for development. When set to `true`, the grid will output console `error`, `warn`, and `info` logs — useful for debugging features like AI search. **Should be disabled in production** to avoid unnecessary console output. Available in version `1.2.1` and above.|      `false`       | No           |
| `deleteButton`       | `object`  | Configuration for enabling a delete button on each row. Includes an `event` field which is the function triggered when the button is clicked.|       -      | No           |
| `downloadFilename`   | `string`  | The filename used when downloading grid data in CSV format. The default value is `'export-{yyyy-MM-dd HH:mm:ss}'`         |       -           | No           |
| `editButton`         | `object`  | Configuration for enabling an edit button on each row. Includes an `event` field which is the function triggered when the button is clicked.|        -     | No           |
| `enableCellEdit`     | `boolean` | Enables cell editing for all columns. Column-level `editable` settings override this option. Cell editing is fully accessible via keyboard, touch, and mouse. A `<td>` cell enters edit mode when double-clicked with a mouse, by pressing **Enter** on the keyboard, or with a firm tap on mobile devices. To save changes, press **Enter** on the keyboard, click outside the cell (mouse), or tap outside (touch). Press **Esc** to cancel. When a change is saved, the `onCellUpdate` callback is fired.|      `false`         | No           |
| `enableColumnDrag`   | `boolean` | Enables column dragging for all columns. Column-level `draggable` settings override this option. Fixed columns can be reordered among themselves, and non-fixed columns among their own group.|      `false`         | No           |
| `enableColumnResize` | `boolean` | Enables column resizing across all columns. Column-level `resizable` settings override this option.|      `false`       | No           |
| `enableColumnSearch` | `boolean` | Whether to enable column-wise search functionality (search per individual column). Column-level search settings override this option.|      `true`        | No           |
| `enableDownload`     | `boolean` | Whether to enable the download functionality (export data as CSV).                                                        |      `true`       | No           |
| `enableGlobalSearch` | `boolean` | Enables global search across all columns.                                                                                 |      `true`       | No           |
| `enableRowSelection` | `boolean` | Enables the row selection column. Available in version `1.2.2` and above.                                                 |      `true`       | No           |
| `enableSorting`      | `boolean` | Enables sorting for all columns by default. Can be overridden by individual column-level `sortable` settings. Supported in version `1.2.2` and above.|      `true`       | No           |
| `globalSearchPlaceholder`| `string` | Sets the placeholder text for the global search input field in the toolbar. Useful for localization or customization.  | `"Search all columns…"` | No       |
| `gridBgColor`        | `string`  | Sets a custom background color for the grid container. Supported in version `1.1.11` and above.                           |       -           | No           |
| `gridClass`          | `string`  | Custom CSS class for the grid container.                                                                                  |       -           | No           |
| `headerBgColor`      | `string`  | Sets a custom background color for the header row. Supported in version `1.1.11` and above.                               |       -           | No           |
| `headerClass`        | `string`  | Custom CSS class for the header row.                                                                                      |       -           | No           |
| `onDownloadComplete` | `function`| Callback function that enables post-download handling such as logging, notifications, or emailing downloaded files.       |       -           | No           |
| `rowClass`           | `string`  | Custom CSS class for each row in the grid.                                                                                |       -           | No           |
| `rowHeight`          | `string` / `number`  | Sets the height of each data row. Accepts a pixel value (e.g., `'200px'`) or a percentage of the table body height (e.g., `'25%'`).|       -           | No           |
| `rowSelectColumnAlign`| `string` (`'left'` \| `'right'` \| `''`)  | Controls the alignment of the selection column. Set to `'left'` or `'right'` to fix its position. Leave empty (`''`) to allow the column to scroll with the rest of the table. Available in version `1.2.2` and above.|      `'left'`        | No           |
| `showFooter`         | `boolean` | Controls the visibility of the grid footer, which includes summary rows and pagination.| `true` | No       |
| `showNumberPagination`| `boolean` | Controls visibility of number-based pagination in the grid footer. Supported from version `1.2.1`.                       |      `true`       | No           |
| `showPageInfo`       | `boolean` | Controls visibility of page information (e.g. "1–10 of 50") in the grid footer. Supported from version `1.2.1`.           |      `true`       | No           |
| `showPageSizeSelector`| `boolean` | Controls visibility of the page size selector ("Rows per page") in the grid footer. Supported from version `1.2.1`.      |      `true`       | No           |
| `showResetButton`    | `boolean` | Controls the visibility of a reset button in the toolbar, allowing users to clear all filters and search.| `true` | No       |
| `showSelectPagination`| `boolean` | Controls visibility of the page selection dropdown in the grid footer. Supported from version `1.2.1`.                   |      `true`       | No           |
| `showToolbar`        | `boolean` | Controls the visibility of the react data grid lite toolbar, which includes actions like search and reset.| `true` | No       |

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