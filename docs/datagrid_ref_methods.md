### 📦 Imperative Grid API (`ref` methods)

The **DataGrid** component exposes a set of **imperative methods** through a `ref` using React’s `useImperativeHandle` hook. This allows parent or consuming components to programmatically interact with and control the grid beyond the declarative prop-based API.

By using these methods, you can perform actions such as retrieving filtered or selected rows, resetting the grid, or getting the current page — all from outside the DataGrid component itself.

#### How to Use

To access these methods, create a React ref and attach it to your `<DataGrid />` component:

```jsx
import { useRef } from 'react';

const gridRef = useRef();

<DataGrid
  ref={gridRef}
  /* other props */
 />
```

You can then call any exposed method via `gridRef.current` after the grid mounts.

---

#### 🔍 Available Methods

##### `getFilteredRows()`

Returns an array of rows currently displayed in the grid, reflecting any applied search, filter, or sorting criteria.

```js
const filteredRows = gridRef.current.getFilteredRows();
```

---

##### `getFilteredSelectedRows()`

Returns an array of rows that are **both selected and currently visible** in the filtered view.

```js
const selectedFilteredRows = gridRef.current.getFilteredSelectedRows();
```

---

##### `getAllSelectedRows()`

Returns an array of **all selected rows**, including those that might be filtered out or on other pages.

```js
const allSelectedRows = gridRef.current.getAllSelectedRows();
```

---

##### `getCurrentPage()`

Returns the current page number that the grid is displaying.

```js
const currentPage = gridRef.current.getCurrentPage();
```

---

##### `resetGrid()`

Resets the grid to its initial state by:

* Clearing all selected rows
* Resetting pagination to the first page
* Clearing any applied filters and sorting

```js
gridRef.current.resetGrid();
```

---

##### `clearSelectedRows()`

Clears the current selection of rows in the grid — **without affecting** filters, pagination, or sorting.

```js
gridRef.current.clearSelectedRows();
```

---

### Why Use These Methods?

These imperative APIs are particularly useful when you need to:

* Export selected rows to a file
* Sync grid state with other UI components
* Implement custom toolbar buttons that reset or modify grid state
* Perform bulk operations based on current selection or filters

They give you full control over the grid’s behavior from parent components, making your DataGrid implementation more flexible and powerful.