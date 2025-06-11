# Event Callbacks

### `onSortComplete(e, sortColumns, sortedData, sortType)`  
Triggered after sorting completes.  
- `e`: Event object  
- `sortColumns`: Array of sorted column keys  
- `sortedData`: The sorted data array  
- `sortType`: `'asc'` or `'desc'`

### `onSearchComplete(e, query, columns, result, matchCount)`  
Fired after search operation finishes.  
- `e`: Event object  
- `query`: Search string  
- `columns`: Columns searched  
- `result`: Filtered rows  
- `matchCount`: Number of matches

### `onPageChange(e, currentPage, previousPage, currentPageRows, currentPageFirstRow)`  
Fired when pagination changes.  
- `e`: Event object  
- `currentPage`: Current active page number  
- `previousPage`: Previous active page number  
- `currentPageRows`: Number of rows on current page  
- `currentPageFirstRow`: Index of first row on current page

### `onDownloadComplete(e, filename, blob)`  
Triggered after CSV file download. Useful for logging or triggering post-download workflows.
- `e`: Event object  
- `filename`: Name of the downloaded file  
- `blob`: Blob object of the file

### `onColumnResized(e, newWidth, columnName)` — *Supported in `v1.1.0` and above* 

This event handler is called **after a column has been resized**. This function allows you to respond to column resize events, such as updating UI elements or saving user preferences.
* `e` — The original event object from the resize action.
* `newWidth` — The new width of the column in pixels as a string with `px` suffix (e.g., `"150px"`). If the new width is `null` or invalid, it defaults to `0`.
* `columnName` — The unique identifier (name) of the resized column.

<br><br>
## Row-Level Action Events

### `editButtonEvent(e, row)`

Triggered when the **Edit** button in a row is clicked. Use this to open edit forms or modals tied to specific row data.

* `e`: Click event object
* `row`: Data object representing the clicked row

### `deleteButtonEvent(e, row)`

Fired when the **Delete** button in a row is clicked. Typically used to confirm and process row deletions.

* `e`: Click event
* `row`: The row data being deleted

### `onRowClick(e, row)`

Called when any part of a row (not a specific button) is clicked. Useful for row-level selection, navigation, or detailed views.

* `e`: Click event
* `row`: The full row data

### `onRowHover(e, row)`

Triggered when the mouse hovers over a row. Ideal for showing tooltips, highlights, or preview actions.

* `e`: Mouse event
* `row`: Row under the cursor

### `onRowOut(e, row)`

Fired when the mouse leaves a row area. Often used to reset styles or hide tooltips.

* `e`: Mouse event
* `row`: Row from which the cursor exited

