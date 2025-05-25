# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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


## [1.0.2] - 2025-05-21
### Fixed
- Fixed an issue with sorting columns that contain currency-formatted values.

## [1.0.1] - 2025-05-21
### Removed
- Removed `prop-types` package from dependencies.

## [1.0.0] - 2025-05-21
### Added
- Initial release of the [NPM package](https://www.npmjs.com/package/react-data-grid-lite).