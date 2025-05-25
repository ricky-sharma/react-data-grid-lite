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
Triggered after CSV file download.  
- `e`: Event object  
- `filename`: Name of the downloaded file  
- `blob`: Blob object of the file  
Useful for logging or triggering post-download workflows.

<br><br>
## Row-Level Action Events

### `editButtonEvent(e, row)`

Triggered when the **Edit** button in a row is clicked.

* `e`: Click event object
* `row`: Data object representing the clicked row
  Use this to open edit forms or modals tied to specific row data.


### `deleteButtonEvent(e, row)`

Fired when the **Delete** button in a row is clicked.

* `e`: Click event
* `row`: The row data being deleted
  Typically used to confirm and process row deletions.


### `onRowClick(e, row)`

Called when any part of a row (not a specific button) is clicked.

* `e`: Click event
* `row`: The full row data
  Useful for row-level selection, navigation, or detailed views.


### `onRowHover(e, row)`

Triggered when the mouse hovers over a row.

* `e`: Mouse event
* `row`: Row under the cursor
  Ideal for showing tooltips, highlights, or preview actions.


### `onRowOut(e, row)`

Fired when the mouse leaves a row area.

* `e`: Mouse event
* `row`: Row from which the cursor exited
  Often used to reset styles or hide tooltips.
