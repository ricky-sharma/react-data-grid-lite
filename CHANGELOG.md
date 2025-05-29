# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
