# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<br>

## ✨ v1.2.1 – Released 2025-08-10

### ✨ Features

* **Add ErrorBoundary to DataGrid**

  * Prevents the entire app from crashing due to unhandled errors inside the grid.
  * Provides a fallback UI and improved resilience.

* **Logging Enhancements**

  * Introduced `logDebug(debug, type, ...args)` utility for level-based, prefixed logging.
  * Supports log levels: `'log'`, `'warn'`, `'error'`, `'info'`; gracefully falls back to `console.log`.
  * Logging is automatically disabled when `debug` is false.
  * Exposed a new `debug` prop for grid users to enable debug logging (e.g., in production troubleshooting).
  * Integrated debug control through grid config and internal hooks.
  * Full Jest test coverage for `logDebug`, including edge cases and fallback scenarios.

* **Pagination Improvements**

  * Added a **"Rows per page" selector** to the DataGrid.

    * Allows users to select from predefined options (5, 10, 25, 50, 100, 250, 500).
    * Pagination updates dynamically based on the selected value.
    * Enhances performance and UX on large datasets.

* **Grid Footer Customization**

  * Introduced new props for fine-grained control over the footer:

    * `showPageInfo`
    * `showPageSizeSelector`
    * `showNumberPagination`
    * `showSelectPagination`

### ♻️ Refactor

* Improved UI alignment and layout for a cleaner experience.
* Removed redundant code and improved overall readability and maintainability.

### ✅ Tests

* Extended and updated unit tests for all new features and configuration options.
* Verified pagination behavior and logging functionality under various conditions.

<br><br>

### 🔖 v1.2.0 – Released 2025-08-06

### ✨ Added

* **AI-powered search support** integrated into the DataGrid using the OpenAI API.
* Configurable options for AI integration: API key, model, endpoint URL, system prompt, and custom headers.
* Full JSON data filtering via AI, interpreting natural language queries for intelligent results.
* Seamless integration of AI search with existing search and pagination logic.
* Hooks and configuration options to allow users to customize or override AI search behavior.
* Fallback to local (non-AI) search if AI fails, is disabled, or returns an error.
* Comprehensive documentation added for setting up and using AI search.

### 🔧 Improved

* Global search integration refined to support AI search without interfering with local search behavior.
* Handled edge cases where data is modified during partial input in global search.
* Debounced input and improved search logic to prevent stale state or race conditions.

### ✅ Updated

* Unit tests expanded to cover AI search scenarios.
* Core logic refactored for cleaner integration between global and AI-powered search paths.

<br><br>

## 📝 v1.1.11 – Released 2025-08-03

🐛 Bug Fixes
- Fixed issue where sorting was reset when clicking on interactive custom fields
- Fixed issue where the search result was reset when interacting with custom field elements (e.g., checkboxes)
- Corrected cursor style when `onRowClick` is enabled
- Decreased row click delay from 400ms to 200ms for snappier interaction

🎨 UI & Theme Updates
- Changed default grid background color from `#f5f1f1` to `#ffffff`
- Updated default header background and font color from `#667` to `#0c0c0c`
- Improved visual consistency across the grid layout

✨ Features
- Added background color customization for grid layout
  - New props: `gridBgColor`, `headerBgColor`

🧪 Tests
- Updated test cases and performed related code cleanup
  
<br><br>

## ✨ v1.1.10 – Released 2025-07-31

### Features & Enhancements

* ✅ **Debounced search input** to improve performance during rapid typing on large datasets.
* ✅ **Improved column ordering logic**:

  * Columns with the same `order` value are now grouped and sorted alphabetically.
  * Columns with high `order` values (e.g. `99`) are now placed correctly at the end.
* 🎨 **New styling props**:

  * `cellStyle`: Apply custom styles directly to `<td>` cells.
  * `headerStyle`: Apply custom styles to `<th>` (header) cells.
* 💅 **UI enhancements**:

  * Added `box-shadow` to the grid table and outer container for improved visual styling.
  * General CSS styling refinements.

**Code Quality**

* 🧹 **ESLint config cleaned**:

  * Suppressions (`no-unused-vars`, `react/prop-types`, `react/display-name`, `no-prototype-builtins`) moved to `eslint.config.mjs`.
  * Removed inline eslint-disable comments from source files.

**Tests**

* 🧪 Test cases updated and aligned with recent changes.

<br><br>

### 🔖 v1.1.9 – Released 2025-07-26

### UI Enhancements

#### 🛠 Paging Improvements

* Fixed an issue where the paging drop-down retained keyboard focus, blocking navigation. Focus now shifts correctly after interaction.
* Updated CSS styling for both the paging drop-down and paging numbers for improved consistency.

#### 🎨 UI Improvements

* Decreased horizontal scrollbar height from **10px** to **8px** for a sleeker look.
* Added a **4px gap** between elements in editable cells to improve spacing and readability.

#### 📚 Code Example Updates

* Refreshed and expanded code examples to reflect recent UI changes.


<br><br>

## 📝 v1.1.8 – Released 2025-07-18

### Enhancements, Fixes & Refactors

#### 🛠️ Bug Fixes

* **Sort Icon Alignment**: Fixed an issue where the sort icon would shift to the right after clicking the sort button.
* **Grid Container Width**: Resolved an issue causing the grid container to initially load with incorrect width, pushing the last column beyond the frame.
* **Dropdown Positioning**: Fixed a brief mispositioning of the options menu on initial render in editable cells.
* **Icon UI Issues**: Addressed visual inconsistencies across various UI icons.

#### 🎨 UI Improvements

* Updated border-radius for buttons, text boxes, and dropdowns for a cleaner, more consistent appearance.
* Improved general UI styling and layout.
* Added column name to the default placeholder in the column search field.

#### ⚙️ Features & Enhancements

* **GridContext Added**: Introduced `GridContext` for sharing state and `setState` with child components.
* **Scoped Container Identifiers**: `Container_Identifier` is now scoped using `gridID`, allowing support for multiple grid instances.

#### 🔧 Performance & Refactoring

* Wrapped multiple functions with `useCallback` for better rendering performance.
* **GridGlobalSearchBar**:

  * Now uses `GridConfigContext` instead of direct props.
  * Wrapped in `React.memo` to reduce unnecessary re-renders.
  * Updated related test cases.
* **GridPagination & GridFooter**:

  * Migrated to use `GridConfigContext` with memoization.
  * Wrapped both in `React.memo`.
  * Updated tests accordingly.
* **GridCell Refactor**:

  * Moved `<td>` rendering logic to `grid-cell.jsx`.
  * Updated associated test coverage.



<br><br>

## 🔖 v1.1.7 - Released 2025-07-15

### 🛠 Fixes

* **Synchronized cell updates** between grid state and full dataset:

  * Injected `__$index__` into each row of `dataReceivedRef` to track and update rows accurately.
  * Modified `onCellChange` and `revertChanges` to reflect updates in both paginated/filtered view and the original dataset.

### 🔍 Search Enhancements

* Improved grid search to support:

  * Multi-word queries
  * Diacritic-insensitive matching (e.g. `café` → `cafe`)
  * Special character handling
  * Concatenated column search with customizable separators
* Extracted formatting and normalization into helper utilities for reusability.

### 🧱 Refactors

* Extracted core cell editing logic into reusable hooks:

  * `useCellRevert`
  * `useCellCommit`
  * `useCellChange`
* Benefits:

  * Cleaner separation of concerns
  * Better testability and modularity
  * Hooks include `configure` method to inject state context
  * Extensive unit tests added for edge cases and update flows

### 🎨 UI

* Updated default theme background color from `#e0e0e0` to `#f5f1f1` for a softer look.

<br><br>

## 🔖 v1.1.6 - Released 2025-07-12

### 🆕 New Features

* **Added grid configuration props:**

  * `rowHeight`: Define row height using pixel or percentage values
  * `showResetButton`: Toggle a reset button in the toolbar
  * `showToolbar`: Show or hide the toolbar section
  * `showFooter`: Show or hide the table footer
* **Search customization:**

  * `globalSearchPlaceholder`: Customize the placeholder for global search input
  * `searchPlaceholder`: Customize search input placeholders for individual columns

### 🎨 UI & Style Improvements

* Updated global search placeholder from `"Global Search"` to `"Search all columns…"`
* Updated sort icon styles; removed unnecessary `transform`
* Reduced minimum column width to `75px`, and mobile column width to `125px`
* Removed `td` borders and added `2px` bottom border to `tr` for better visual separation
* Reduced table header font size to `18px` for screens wider than `1200px`; removed `!important` from font-size rule
* Set minimum grid frame width to `250px`
* Refactored CSS for improved consistency and maintainability

<br><br>

## 📝 v1.1.5 - Released 2025-07-09

### 🚀 Features

* **Cell Editing Enhancements**

  * Added **cell editing functionality** with dynamic input rendering.
  * Introduced `onCellUpdate` callback to handle cell value updates.
  * Added `enableCellEdit` prop to **globally enable/disable editing**.
  * Implemented **keyboard-based navigation** across cells using a custom hook.
  * Enabled **double-tap edit support** on mobile via `useDoubleTap` hook.
  * Added `editable` column-level prop to control which columns are editable.

* **Dropdown Field Support**

  * Added **dropdown support** in cell editing mode.
  * Dropdown supports objects with `label` and `value` keys.

* **Accessibility & UI Improvements**

  * Improved keyboard accessibility for **dropdowns** (arrow keys, Enter, Escape).
  * Made **Reset Filters** and **Export CSV** buttons accessible via keyboard and screen readers.
  * Added accessibility support for **row edit and delete buttons**.

### 🔧 Refactors

* Extracted **editable cell logic** into `editable-cell-fields.jsx` for modularity.
* Restructured editable cell components for better **separation of concerns**.
* Moved `input.jsx` and `dropdown.jsx` to a new `custom-fields` folder.
* Relocated `editable-cell-fields.jsx` to a new `grid-edit` folder for clarity.
* Improved **focus handling** and **commit/revert behavior** during editing.

<br><br>

## 📦 v1.1.4 - Released 2025-06-30

### ✨ Features

* **Draggable Columns & Custom Order Support**

  * Added drag-and-drop functionality for column reordering.
  * Added `order` property to column config for per-column order control.
  * Introduced `enableColumnDrag` prop at the grid level to toggle the drag-and-drop feature.
  * Added `draggable` flag in column config for individual column control.
  * Enhanced `useDraggableColumns` hook with:

    * Mobile touch support
    * Cross-platform improvements

* **Drag-and-Drop Callback & Prop Improvements**

  * Introduced `onColumnDragEnd` callback for handling column drag completion.
  * Updated documentation with usage guides for:

    * Drag-and-drop setup
    * Relevant props and configurations

* Refactored code for clarity, maintainability, and improved performance.

* Updated ESLint configuration to enhance code quality.

* Added tests for the `useDraggableColumns` hook.

* Added `typeof` checks for boolean props to ensure type safety.

### 🎨 UI Improvements

* Updated CSS to improve layout consistency and visual clarity.
* Avoided style conflicts by not overriding existing styles, ensuring stability across components.

<br><br>

## 📦 v1.1.3 – Released 2025-06-26

**Feature: Custom Cell Rendering + UI Improvements**

### ✨ New

* **`render` prop for columns** – Allows custom rendering of individual cells using a render function.
  Example:

  ```tsx
  {
    key: 'status',
    header: 'Status',
    render: (formattedRow, baseRow) => <strong>{formattedRow.status}</strong>
  }
  ```

### ♻️ Refactor

* Extracted reusable internal rendering logic to support the new `render` prop cleanly.
* Refactored and reorganized CSS for improved structure and maintainability.

### 📚 Examples

* Updated existing examples and added new ones to demonstrate custom cell rendering using the `render` prop.

### 💅 UI

* Minor UI refinements for better visual alignment and responsiveness.

<br><br>

## 📦 v1.1.2 - 2025-06-23

### ✨ Features

* **DataGrid**: Added `currentPage` prop to allow initialization of grid with a specific page (supports query strings, bookmarking, etc.).
* **DataGrid**: Renamed `searchEnable` to `enableSearch` for clearer naming (backward compatibility removed).
* **Responsive UX**: Disabled fixed columns for screen widths under 701px to improve usability on smaller devices.

### 🛠 Fixes

* **UI**: Resolved layout issues with the “Clear Filter” button on mobile by applying responsive UI tweaks.
* **Theme Compatibility**: Updated `box-shadow` from `0.3px` to `1px` to resolve border rendering issue on Mozilla Firefox.

### 🎨 Styling

* **Mobile Styling**: Adjusted padding for better visual consistency in the new responsive theme.


<br><br>

## 📦 v1.1.1 - 2025-06-19

### 🚀 Features

- **Theme Support in DataGrid**
  - Added `theme` prop to `DataGrid` for applying visual themes.
  - Introduced three themes: `blue-core`, `dark-stack`, `medi-glow`.
  - Refined default theme for better visual consistency.
  - Updated example project with themed demos and improved folder structure.

- **Custom Dropdown Component**
  - Replaced native `<select>` with a fully accessible and stylized custom `Dropdown`.
  - Supports keyboard navigation, outside click detection, and auto-scroll to selected.
  - Improves UX with better control, accessibility, and styling flexibility.

- **Column Search & Header Enhancements**
  - Made column search inputs controlled via internal state.
  - Added clear (`×`) icons to reset individual filters.
  - Prevented accidental sort triggering during column resize.
  - Ensured reliable `onChange` behavior for all filter inputs.

- **Configurable Actions Column Alignment**
  - Added support to align the Actions column left or right using a new prop.

---

### 📦 CSV Export Improvements

- Exported CSV now includes **only visible columns** from the grid.
- Values are exported with **formatted output** (e.g., date, currency).
- Supports **concatenated/derived columns** (e.g., full name).
- Output is now aligned with what's rendered in the UI, rather than raw data.

---

### 🔧 Resize Callback Update

- **Resize callback** now includes a `gridId` parameter for **scoped column resizing** support across multiple grids.

---

### 🛠 Refactoring

- **Sort Icon Logic Refactor**
  - Replaced DOM-based logic with state-driven sort handling.
  - Introduced `ColumnSortIcon` component for dynamic rendering.
  - Added full reset support to clear all sorts and restore original data.

- **Utility Cleanup**
  - Moved `showLoader` and `hideLoader` logic to a shared `utils/` directory.

- **SVG Migration**
  - Replaced CSS-based icons with SVGs for better visual performance and consistency.

---

### ✅ Tests

- **Unit Tests Added (Jest + React Testing Library):**
  - `Dropdown`: open/close logic, outside click handling, option selection, clear icon
  - `Input`: default props, controlled behavior, onChange handler, clear button
  - `applyTheme`: theme mapping for valid/invalid inputs
  - `ColumnSortIcon`: icon state for `asc`, `desc`, and default
- **Fixed component behavior based on test coverage feedback.**


<br><br>

## 📦 v1.1.0 – Feature Enhancements, UI Improvements & GitHub Pages Deployment

**Release Date:** 2025-06-11

### ✨ New Features

* **Fixed Columns Support**
  Added support for fixed (sticky) columns via a `fixed` property in column definitions. Enhances table usability during horizontal scrolling.

* **Resizable Columns (Experimental)**
  Introduced column resizing with live drag interaction. Includes `onColumnResized` callback for external state sync.

* **Dynamic Column-Class Styling**
  Enabled runtime assignment of CSS classes to columns for greater flexibility in UI theming.

* **GitHub Pages Deployment**
  Configured GitHub Pages deployment using `gh-pages` and updated `homepage` field in `package.json`.

---

### 🛠️ Improvements

* **Paging Controls UX**
  Pagination UI now automatically hides when dataset is empty to reduce visual clutter.

* **Dynamic Row-Column Alignment**
  Row data now dynamically maps to current column configuration, enabling runtime column reordering without breaking layout or data mapping.

* **Column Width Handling**
  Enhanced logic to retain or recalculate widths when columns are re-ordered or updated dynamically.

* **Grid Layout Refactor**
  Introduced a new `GridTable` component (`grid-table.jsx`) to modularize rendering logic.
  Updated CSS to support **sticky positioning** for scrollable sections.

* **Export Button Logic**
  Disabled "Export CSV" when no data is available, improving UX and preventing invalid actions.

* **Global Search Fix**
  Resolved issue where global search omitted valid matches due to incorrect column indexing.

---

### 🧪 Testing & Stability

* Refactored `useState` usage for consistent handling of dynamic updates.
* Added null checks and guards in column config logic.
* Expanded test suite with cases for:

  * Fixed and resizable columns
  * Grid responsiveness and dynamic layout
* Achieved **80%+ code coverage**.
* Updated data loader:

  * Improved loading spinner positioning with modern dot style
  * Added scoped messaging and duplicate prevention logic

---

### 🧹 Misc

* Restructured CSS for better sticky layout handling
* Cleaned up layout and rendering logic for long-term maintainability

<br><br>
## [1.0.5] - 2025-06-04

### Added
- **Testing**: Set up Jest for unit testing and added initial test configuration.
- **Tests**: Implemented test cases to achieve over 80% coverage across statements, branches, functions, and lines.
- **Compatibility**: Added support for React 17+ and verified functionality in React 17+ environments.

### Changed
- **Documentation**:
  - Moved usage example from `api.md` to a new `examples.md`.
  - Updated `README.md` to include a link to `examples.md` alongside the existing API documentation.
- **Refactor**:
  - Migrated the entire DataGrid package to React functional components for improved maintainability and performance.
  - Converted `Datagrid` component in `react-data-grid-lite.jsx` from a class to a functional component.
  - Refactored `eventGridSearchClicked` in `event-grid-search-clicked.js` to streamline logic and reduce bundle size.
  - Simplified the `format` function API by removing the `currencyCode` argument and using the `format` parameter as the currency code instead.
- **Code Quality**: Refactored and improved code based on insights from test results.

### Fixed
- **Props Handling**: Added an `id` prop to `DataGrid`, defaulting to `id-<randomNumber>` if not explicitly provided.


<br><br>

## [1.0.4] - 2025-05-29

### Added

* `grid-footer.jsx`: New functional component to manage pagination footer layout.
* `format_guide.md`: Documentation with examples for `format()` and `formatDate()` utilities, including supported types and formats.
* Icon added to the **Actions** column for clearer interaction.
* Global search bar refactored into a functional component with enhanced support for smaller screens.

### Changed

* Refactored `grid-header.jsx`, `grid-rows.jsx`, and `grid-pagination.jsx` to improve structure, maintainability, and loading performance.
* Updated `package.json` description for better clarity.
* Replaced deprecated `rollup-plugin-strip` with `@rollup/plugin-strip` in Rollup configuration.

### Fixed

* Sorting icon alignment issues, including conflicts introduced by the new Actions column icon.
* Loader (loading spinner) alignment issue — previously rendered off-screen, now centered properly.
* Minor layout inconsistencies and CSS bugs in grid components.
* Inconsistent date formatting in grid display logic.

<br><br>

## [1.0.3] - 2025-05-25
### Added
- **Data Loading Enhancements:** Integrated `trackPromise` into the export flow in `index.js` to improve loading state handling.
- **New Events:**
  - `onSortComplete` — Triggered after sorting finishes. Provides event object, sorted columns (array), sorted data, and sort order (`asc`/`desc`).
  - `onSearchComplete` — Triggered after a search operation. Includes the search query, matching columns, result set, and match count.
  - `onPageChange` — Fires on pagination changes with detailed context including current and previous page numbers, row counts, and the index of the first row on the new page.
  - `onDownloadComplete(e, filename, blob)` — Enables post-download handling such as logging, notifications, or emailing downloaded files.
- **Changelog Initialization:** Added `CHANGELOG.md` file for version tracking and release documentation.
- **Introduced a structured `docs/` folder with dedicated markdown files:
  - `api.md` for component props and configuration options
  - `events.md` for event callback documentation
  - `styling.md` for theming and CSS customization
  - `advanced.md` covering column width logic, performance tips, and export handling
- Updated `README.md` with links to the new documentation files for improved maintainability and developer onboarding

### Changed
- **Sorting Functionality:**
  - Added support for multi-column (concatenated) sorting.
  - Improved sorting for UUIDs, email addresses, numeric values, currency, and date columns — in both ascending and descending orders.
- **Pagination UI & CSS:**
  - Refined pagination interface for better usability.
  - Formatted and cleaned related CSS for maintainability.
- **Code Formatting:** General code cleanup for consistency and readability.

### Fixed
- **Column Width Logic:** Improved column resizing behavior to better support:
  - Fixed + flexible column layouts.
  - All-fixed column grids (auto-stretch to fill).
  - Fully flexible columns (equal distribution with no gaps).
  - Mobile responsiveness and dynamic container resizing with action buttons.

### Optimized
- **Bundle Size:** Reduced overall npm package size by removing unused styles, optimizing CSS.

<br><br>

## [1.0.2] - 2025-05-21
### Fixed
- Fixed an issue with sorting columns that contain currency-formatted values.

<br><br>

## [1.0.1] - 2025-05-21
### Removed
- Removed `prop-types` package from dependencies.

<br><br>

## [1.0.0] - 2025-05-21
### Added
- Initial release of the [NPM package](https://www.npmjs.com/package/react-data-grid-lite).
