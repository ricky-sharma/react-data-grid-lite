
[![npm](https://img.shields.io/npm/v/react-data-grid-lite.svg)](https://www.npmjs.com/package/react-data-grid-lite)
![License](https://img.shields.io/github/license/ricky-sharma/react-data-grid-lite)
![Last Commit](https://img.shields.io/github/last-commit/ricky-sharma/react-data-grid-lite)
[![Download Badge](https://img.shields.io/badge/Download-ZIP-blue?style=flat&logo=github)](https://github.com/ricky-sharma/react-data-grid-lite/archive/refs/heads/master.zip)
![Forks](https://img.shields.io/github/forks/ricky-sharma/react-data-grid-lite?style=social)
![npm](https://img.shields.io/npm/dt/react-data-grid-lite)

# React Data Grid Lite

A lightweight and customizable React data grid component designed for high performance and ease of use. The DataGrid component is a highly customizable, feature-rich table component designed to display tabular data in a React application. It is intended for use cases where large datasets need to be presented with advanced features such as pagination, sorting, searching, row interactions, and more.

### ✅ Key Features
* ⚡ **Lightweight**: The component is optimized for small bundle size, ensuring fast load times.
* 📦 **Remote API support**: Plug in any JSON API.
* 🛠️ **Flexible column logic**: Auto-adapts to the API schema.
* 🔍 **Searchable and alias columns**: Improves UX and readability.
* 🧾 **CSV export**: Download the entire grid.
* ✏️ **Edit/Delete** buttons: Easily hook into row-level actions.
<br><br>
![react-data-grid-lite](https://github.com/user-attachments/assets/948c8601-0c36-42d7-8cbf-b7753c634182)

<br><br>
## 🗂️ Documentation

- [API Reference](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/api.md)
- [Events](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/events.md)
- [Styling](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/styling.md)
- [Advanced Usage](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/advanced.md)
- [Format Guide](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/format_guide.md)
- [Examples](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/examples.md)
<br><br>

## 📦 Installation

```bash
npm install react-data-grid-lite
```

or

```bash
yarn add react-data-grid-lite
```

<br><br>

## 🚀 Usage

```jsx
import React from 'react';
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
            console.log(row);
        }
    },
    deleteButton: {
        event: (e, row) => {
            console.log(row);
        }
    }
}

function App() {
  return (
    <div>
      <h1>Data Grid Example</h1>
      <DataGrid
          columns={columns}
          data={rows}
          options={options}
          pageSize={10}
      />
    </div>
  );
}

export default App;
```

<br><br>
<img src="https://github.com/user-attachments/assets/8bebdae1-4ae1-4725-bffa-4790c7761feb" width="1000" />
<br><br>
## React Compatibility Table

The `react-data-grid-lite` library is compatible with the following versions of React:

| **React Version** | **Compatibility**  |
| ----------------- | ------------------ |
| **React 18**      | ✅ Fully Compatible |
| **React 19**      | ✅ Fully Compatible |

<br><br>

## 🚀 Try It Out!

Feel free to fork the repository and experiment with the grid's behavior for concatenating columns. Let me know if you'd like any further adjustments or clarification! Happy coding! 🎉
<br><br>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
<br><br>
## 🙋‍♂️ Available for freelance work!
Reach out via [LinkedIn](https://www.linkedin.com/in/vinay-sharma-2022354) or check out my projects on [GitHub](https://github.com/ricky-sharma).

---

#React #ReactDataGrid #DataGrid #ReactTable #ReactComponents #GridComponent #DataGridLite #Pagination #Sorting #Filtering #ColumnSearch #ReactUI #ReactGrid #DataTable #TableComponent #DataGridFeatures #ReactPagination #ColumnSorting #ReactFiltering #ReactTableComponent #ResponsiveDataGrid #ReactSearchableGrid #SmallBundleSize #LegacyReactSupport #GridWithSortingAndFiltering #ReactJS #DataManagement #TableWithPagination #CustomizableGrid
