# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
