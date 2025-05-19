---

# React Data Grid Lite

A lightweight and customizable React data grid component designed for high performance and ease of use.

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
               alert('Edit Button clicked!'),
               console.log(row)
        }
    },
    deleteButton: {
        event: (e, row) => {
            alert('Delete Button clicked!'),
            console.log(row)
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

| Prop                | Type            | Description                                                                                                 |
| ------------------- | --------------- | ----------------------------------------------------------------------------------------------------------- |
| `columns`           | `Array<Object>` | An array of column definitions. Each object should have `key` and `name` properties.                        |
| `data`              | `Array<Object>` | An array of row data objects. Each object should have keys matching the column `key`s.                      |
|                     |                 | An array of row IDs that are currently selected.                                                            |
|                     |                 | Callback function that is called when the selection changes. Receives the new selected rows as an argument. |

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
