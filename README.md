[![npm](https://img.shields.io/npm/v/react-data-grid-lite.svg)](https://www.npmjs.com/package/react-data-grid-lite)
![License](https://img.shields.io/github/license/ricky-sharma/react-data-grid-lite)
![Last Commit](https://img.shields.io/github/last-commit/ricky-sharma/react-data-grid-lite)
[![Download Badge](https://img.shields.io/badge/Download-ZIP-blue?style=flat&logo=github)](https://github.com/ricky-sharma/react-data-grid-lite/archive/refs/heads/master.zip)
![npm](https://img.shields.io/npm/dt/react-data-grid-lite)
![](https://komarev.com/ghpvc/?username=ricky-sharma&color=dc143c)

<a href="https://codesandbox.io/s/github/ricky-sharma/react-data-grid-lite/tree/master/example" target="_blank" rel="noopener noreferrer">
  <img 
    src="https://codesandbox.io/static/img/play-codesandbox.svg" 
    alt="Open in CodeSandbox" 
    height="28" 
    style="vertical-align: middle;"
  />
</a>

# React Data Grid Lite
[![🚀 Live Demo & Docs](https://img.shields.io/badge/🚀%20Live%20Demo%20%26%20Docs-Click%20Here-blueviolet?style=for-the-badge)](https://ricky-sharma.github.io/react-data-grid-lite/)

A lightweight and customizable React data grid component designed for high performance and ease of use.

The DataGrid component is a highly customizable, feature-rich table built with React, designed to display tabular data and easily integrate into any application. It is intended for use cases where large datasets need to be presented with advanced features such as pagination, sorting, searching, row interactions, **AI-powered search**, and more.

With built-in support for OpenAI (or other LLMs via configurable endpoints), the grid can semantically interpret user queries and return intelligent, filtered results—ideal for enhancing user experience in modern data-driven applications.


✅ Key Features  
⚡ Lightweight – Fast, small bundle  
📦 API-ready – Plug into any JSON API  
🛠️ Smart columns – Auto schema detection  
🔍 Fast search – Filter with custom labels & aliases  
🤖 AI search – Semantic query support (OpenAI/LLM)  
📌 Fixed & resizable columns  
📱 Responsive – Mobile-friendly layout  
🧾 CSV export – One-click data download  
✏️ Inline editing – Keyboard & touch support  			   
🎨 Custom cells – Render anything  
🧩 Merged columns – Combine multiple fields  
📊 Analytics-ready – Track user actions  
🎨 Theming – Easy styling & prebuilt themes  
🔄 Drag & reorder columns  
🧩 Align actions – left/right  
📂 Column Menu – Per-column sort, hide, and edit options  
🧰 Toolbar Menu – Compact 3-dot menu for export, reset, and more  
🧪 Fully tested – Robust unit tests  

<br><br>

<p align="center">
  <img src="https://github.com/user-attachments/assets/4516b8d8-130e-45ff-a76c-1b5d013f5bf1" alt="React Data Grid Lite Image" width="100%" />
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

This component has the following peer dependencies that need to be installed as well:

```json
{
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
    "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
  }
}

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
  { id: 2, name: 'Jane Smith', age: 34 }
];

function App() {
  return (
      <DataGrid columns={columns} data={rows} />
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


