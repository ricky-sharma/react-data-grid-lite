
[![npm](https://img.shields.io/npm/v/react-data-grid-lite.svg)](https://www.npmjs.com/package/react-data-grid-lite)
![License](https://img.shields.io/github/license/ricky-sharma/react-data-grid-lite)
![Last Commit](https://img.shields.io/github/last-commit/ricky-sharma/react-data-grid-lite)
[![Download Badge](https://img.shields.io/badge/Download-ZIP-blue?style=flat&logo=github)](https://github.com/ricky-sharma/react-data-grid-lite/archive/refs/heads/master.zip)
![Forks](https://img.shields.io/github/forks/ricky-sharma/react-data-grid-lite?style=social)
![npm](https://img.shields.io/npm/dt/react-data-grid-lite)

# React Data Grid Lite
[![🚀 Live Demo & Docs](https://img.shields.io/badge/🚀%20Live%20Demo%20%26%20Docs-Click%20Here-blueviolet?style=for-the-badge)](https://ricky-sharma.github.io/react-data-grid-lite/)

A lightweight and customizable React data grid component designed for high performance and ease of use. The DataGrid component is a highly customizable, feature-rich table component designed to display tabular data in a React application. It is intended for use cases where large datasets need to be presented with advanced features such as pagination, sorting, searching, row interactions, and more.

✅ **Key Features**  
⚡ **Lightweight** – Small bundle size, fast loading  
📦 **API-ready** – Works with any JSON API  
🛠️ **Dynamic columns** – Auto-adapts to data schema  
🔍 **Search & aliases** – Fast filtering, custom labels  
📌 **Fixed columns** – Lock columns during scroll  
📏 **Resizable columns** – User can drag to resize  
📱 **Responsive layout** – Adapts to all screen sizes  
🧾 **CSV export** – Download full data grid  
✏️ **Row actions** – Built-in edit/delete hooks  
🧩 **Merged columns** – Combine multiple fields  
📊 **Analytics events** – Track user interactions  
🎨 Theming – Pre-built themes & easy customization  
🧩 Actions align – Fix column left or right via prop  
🧪 Fully tested – Robust unit coverage and fixes  

<br><br>
<p align="center">
  <img src="https://github.com/user-attachments/assets/bf6ef7d8-1475-4554-8177-de1f794edb4b" alt="react-data-grid-lite 19 July -2" width="95%" />
</p>



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

function App() {
  return (
    <div>
      <h1>Data Grid Example</h1>
      <DataGrid
          columns={columns}
          data={rows}
      />
    </div>
  );
}

export default App;
```

<br><br>
## React Compatibility Table

The `react-data-grid-lite` library is compatible with the following versions of React:

| **React Version** | **Compatibility**  |
| ----------------- | ------------------ |
| **React 19+**     | ✅ Fully Compatible |
| **React 18+**     | ✅ Fully Compatible |
| **React 17+**     | ✅ Fully Compatible |

<br><br>
## 🗂️ Documentation

- [API Reference](https://github.com/ricky-sharma/react-data-grid-lite/blob/master/docs/api.md)

<br><br>
## 🚀 Try It Out!

Feel free to fork the repository and experiment with the grid's behavior for concatenating columns. Let me know if you'd like any further adjustments or clarification! Happy coding! 🎉
<br><br>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
<br><br>
## 🙋‍♂️ Available for freelance work!
Reach out via [LinkedIn](https://www.linkedin.com/in/vinay-sharma-2022354) or check out my projects on [GitHub](https://github.com/ricky-sharma).
