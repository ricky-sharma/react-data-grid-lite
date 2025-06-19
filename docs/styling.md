# Styling & Theming

## 🎨 Theming Support

The grid provides several built-in **visual themes** to help match your application's branding and improve usability across different domains. These themes improve readability and help visually align the grid with the surrounding application UI.

Apply a theme by passing the `theme` prop to the grid component:

```jsx
<Grid theme="blue-core" />
```

---

### 🧱 What Themes Affect

Each theme customizes the following UI aspects:

* **Header Background Color** – applies to column headers
* **Grid Body Background Color** – applies to outer grid container
* **Text & Control Color** – used in controls like the pagination, dropdown, etc.

---

### 🎨 Available Themes

| Theme Name   | Header Background | Body Background | Text / Control Color | Description                                                              |
| ------------ | ----------------- | --------------- | -------------------- | ------------------------------------------------------------------------ |
| `blue-core`  | `#1F3B4D`         | `#E5E8EC`       | `#1F3B4D`            | Professional and clean blue-gray theme, great for enterprise dashboards. |
| `dark-stack` | `#2D2D2D`         | `#F5F5F5`       | `#2D2D2D`            | Modern grayscale palette ideal for minimal UI and clean layouts.         |
| `medi-glow`  | `#256D4F`         | `#E8F5E9`       | `#256D4F`            | Soft green tone suitable for healthcare, wellness, and eco-focused UIs.  |
| *(default)*  | `#667`            | `#E0E0E0`       | `#667`               | Neutral base styling used when no theme is specified.                    |

---

### 📝 Notes

* The `theme` prop accepts one of the predefined theme names.
* When no `theme` is passed, the default neutral styling is applied.
* These themes adjust key colors via CSS with `!important` to maintain consistency across browsers.
* You can extend or override styles using your own custom classes if needed.

---
### 🎛️ Overriding Themes with Class Props

You can override or extend theme styling using the following optional props:

| Prop Name     | Type     | Description                                                                             |
| ------------- | -------- | --------------------------------------------------------------------------------------- |
| `gridClass`   | `string` | Applies a custom class to the outer grid container.                                     |
| `headerClass` | `string` | Overrides header styling. Useful for setting your own background or text color.         |
| `rowClass`    | `string` | Applies custom styles to each data row. Can be used to add hover effects, borders, etc. |

These props are especially useful if you want to:

* Apply branding-specific colors or layout tweaks
* Layer custom styles on top of a base theme
* Disable or override theme values selectively

<br><br>

## ⚙️ Custom CSS Classes for Grid

The `react-data-grid-lite` component allows you to apply custom CSS classes to various parts of the grid, such as the entire grid container, the header row, and each individual row. You can use the following props to add custom styles:

| **Prop Name** | **Type** | **Description**                            | **Required** |
| ------------- | -------- | ------------------------------------------ | ------------ |
| `gridClass`   | `String` | Custom CSS class for the grid container.   | No           |
| `headerClass` | `String` | Custom CSS class for the header row.       | No           |
| `rowClass`    | `String` | Custom CSS class for each row in the grid. | No           |


#### 📝 Example:

![image](https://github.com/user-attachments/assets/8bebdae1-4ae1-4725-bffa-4790c7761feb)


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
