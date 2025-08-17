# Event Callbacks

### `onSortComplete(e, sortColumns, sortedData, sortOrder)`

Triggered after sorting completes.

- `e` (`React.SyntheticEvent`) : Event object  
- `sortColumns`: Array of sorted column keys  
- `sortedData`: The sorted data array  
- `sortOrder`: `'asc'` or `'desc'`

### `onSearchComplete(e, query, columns, result, matchCount)`

Fired after search operation finishes.

- `e` (`React.SyntheticEvent`) : Event object  
- `query`: Search string  
- `columns`: Columns searched  
- `result`: Filtered rows  
- `matchCount`: Number of matches

### `onPageChange(e, currentPage, previousPage, currentPageRows, currentPageFirstRow)`

Fired when pagination changes.

- `e` (`React.SyntheticEvent`) : Event object  
- `currentPage`: Current active page number  
- `previousPage`: Previous active page number  
- `currentPageRows`: Number of rows on current page  
- `currentPageFirstRow`: Index of first row on current page

### `onDownloadComplete(e, filename, blob)`

Triggered after CSV file download. Useful for logging or triggering post-download workflows.

- `e` (`React.SyntheticEvent`) : Event object  
- `filename`: Name of the downloaded file  
- `blob`: Blob object of the file

### `onColumnResized(e, newWidth, columnName)`

This event handler is called **after a column has been resized**. This function allows you to respond to column resize events, such as updating UI elements or saving user preferences.

* `e` (`React.SyntheticEvent`) : The original event object from the resize action.
* `newWidth` : The new width of the column in pixels as a string with `px` suffix (e.g., `"150px"`). If the new width is `null` or invalid, it defaults to `0`.
* `columnName` : The unique identifier (`name`) of the resized column.
* `gridID` : The unique identifier (`id`) for the DataGrid component.

### `onColumnDragEnd(columnName, newColumnOrder)`

This callback is triggered when a column is dropped after a drag. It provides:

* `columnName`: The unique identifier (`name`) of the column that was dragged.
* `newColumnOrder`: an array of **rendered column objects**, each containing:
  * `name`: unique identifier for the column
  * `order`: the new position (starting from 1)
  * `alias` (optional): user-friendly name or alternative label

### `onSelectAll(event, selectedRows, isSelected)` — *Supported in `v1.2.2` and above*

Callback function triggered when the selection column header is clicked to select or deselect all rows on the current page.

* `event` (`React.SyntheticEvent`) : The event object triggered by the user interaction.
* `selectedRows` (`RowData[]`) : An array of data objects representing the currently selected (or deselected) rows.
* `isSelected` (`boolean`) : Indicates whether rows are now selected (`true`) or deselected (`false`).

<br><br>

## Row-Level Action Events

### `onRowSelect(event, row, isSelected)` — *Supported in `v1.2.2` and above*

Callback function triggered when a single row is selected or deselected via the selection column.

* `event` (`React.SyntheticEvent`) : The event object triggered by the user interaction.
* `row` (`RowData`) : The data object for the selected or deselected row.
* `isSelected` (`boolean`) : Indicates whether the row is now selected (`true`) or deselected (`false`).

### `editButtonEvent(e, row)`

Triggered when the **Edit** button in a row is clicked. Use this to open edit forms or modals tied to specific row data.

* `e` (`React.SyntheticEvent`) : Click event object
* `row`: Data object representing the clicked row

### `deleteButtonEvent(e, row)`

Fired when the **Delete** button in a row is clicked. Typically used to confirm and process row deletions.

* `e` (`React.SyntheticEvent`) : Click event
* `row`: The row data being deleted

### `onRowClick(e, row)`

Called when any part of a row (not a specific button) is clicked. Useful for row-level selection, navigation, or detailed views.

* `e` (`React.SyntheticEvent`) : Click event
* `row`: The full row data

### `onRowHover(e, row)`

Triggered when the mouse hovers over a row. Ideal for showing tooltips, highlights, or preview actions.

* `e` (`React.SyntheticEvent`) : Mouse event
* `row`: Row under the cursor

### `onRowOut(e, row)`

Fired when the mouse leaves a row area. Often used to reset styles or hide tooltips.

* `e` (`React.SyntheticEvent`) : Mouse event
* `row`: Row from which the cursor exited

### `onCellUpdate(cellUpdate)`

Fired when cell editing is saved (e.g., by pressing `Enter`). Useful for persisting changes, triggering validations, or syncing with a backend.

* `cellUpdate`: An object containing details about the updated row and columns.

#### `cellUpdate` structure:

* `rowIndex`: *(number)* — Index of the updated row
* `editedColumns`: *(Array<{ colName: string, value: any }>)* —
  A list of updated columns and their new values.

  > 💡 Normally contains a single column update, but for concatenated columns, it may include **multiple fields** with their respective values.
* `updatedRow`: *(object)* — The full row data after changes


#### Example usage:

```jsx
onCellUpdate={(cellUpdate) => {
  console.log('Row index:' + cellUpdate.rowIndex);
  console.log(cellUpdate.editedColumns);
  console.log(cellUpdate.updatedRow);
}}
```

#### Example: `cellUpdate` object

**Normal (single column) update:**

```js
{
  rowIndex: 2,
  editedColumns: [
    { colName: 'lastName', value: 'Doe' }
  ],
  updatedRow: {
    id: 3,
    firstName: 'John',
    lastName: 'Doe',
    age: 30
  }
}
```

**Concatenated column update:**

```js
{
  rowIndex: 4,
  editedColumns: [
    { colName: 'firstName', value: 'Jane' },
    { colName: 'lastName', value: 'Smith' }
  ],
  updatedRow: {
    id: 5,
    firstName: 'Jane',
    lastName: 'Smith',
    age: 27
  }
}
```