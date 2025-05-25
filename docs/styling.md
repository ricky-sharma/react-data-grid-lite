# Styling & Theming

## ⚙️ Custom CSS Classes for Grid

The `react-data-grid-lite` component allows you to apply custom CSS classes to various parts of the grid, such as the entire grid container, the header row, and each individual row. You can use the following props to add custom styles:

| **Prop Name** | **Type** | **Description**                            | **Required** |
| ------------- | -------- | ------------------------------------------ | ------------ |
| `gridClass`   | `String` | Custom CSS class for the grid container.   | No           |
| `headerClass` | `String` | Custom CSS class for the header row.       | No           |
| `rowClass`    | `String` | Custom CSS class for each row in the grid. | No           |


#### 📝 Example:

![image](https://github.com/user-attachments/assets/cd62c3cb-dfc4-48fc-b0d0-e7392faf7518)


Here’s how you can use these props to add custom styles:

```javascript
<DataGrid
  options={
    gridClass: "my-custom-grid",
    headerClass: "my-custom-header",
    rowClass: "my-custom-row"
  }
  columns={columns}
  data={data}
/>
```

In this example, `my-custom-grid`, `my-custom-header`, and `my-custom-row` would be the CSS classes you define in your stylesheet.

```css
/*Custom Styles*/
.my-custom-grid {
    background-color: #c0cad3 !important;
    border: 3px solid #c0cad3 !important;
    box-shadow: 0 0 0 3px #c0cad3 !important;
}

.my-custom-header {
    background-color: #667 !important;
    color: #ffffff !important;
}

.my-custom-row:nth-child(even) {
    background-color: #e7e0e4 !important;
}

.my-custom-row:nth-child(odd) {
    background-color: #f3f4f9 !important;
}

.my-custom-row {
    border-bottom: 1px solid #4f4d4d !important;
}

    .my-custom-row:hover {
        background-color: #e0e0e0 !important;
    }
```

#### 🔄 Additional Notes:

* Ensure that the custom styles don’t conflict with the default styles of the grid to maintain proper layout and functionality.

While the `gridClass`, `headerClass`, and `rowClass` props allow you to apply custom CSS classes to the grid and its elements, the styles might not be perfectly aligned with your desired layout or design out-of-the-box. Depending on your project’s design system or CSS framework, you may need to adjust or override these styles to ensure they work as intended.

---
