/* eslint-disable react/prop-types */
import React, { Component, createRef } from 'react';
import { isNull, objectsEqual } from '../src/helper/common';
import { eventGridHeaderClicked } from "./components/events/event-grid-header-clicked";
import { eventGridSearchClicked } from "./components/events/event-grid-search-clicked";
import GridFooter from './components/grid-footer';
import GridGlobalSearchBar from './components/grid-global-search-bar';
import GridHeader from "./components/grid-header";
import GridRows from './components/grid-rows';
import { Default_Grid_Width_VW } from './constants';

export class DataGrid extends Component {
    constructor(props) {
        super(props)
        const {
            columns,
            data,
            pageSize,
            options,
            width,
            height,
            maxWidth,
            maxHeight,
            onRowClick,
            onRowHover,
            onRowOut,
            onSortComplete,
            onSearchComplete,
            onPageChange
        } = props
        this.state = {
            width: !isNull(width) ? width : Default_Grid_Width_VW,
            maxWidth: !isNull(maxWidth) ? maxWidth : '100vw',
            height: !isNull(height) ? height : '60vh',
            maxHeight: !isNull(maxHeight) ? maxHeight : '100vh',
            gridID: `${Math.floor(Math.random() * 1000000)}`,
            columns: !isNull(columns) ? columns : null,
            rowsData: data,
            totalRows: data?.length ?? 0,
            enablePaging: !isNull(pageSize),
            pageRows: !isNull(parseInt(pageSize, 10)) ? parseInt(pageSize, 10) : data?.length ?? 0,
            noOfPages: 0,
            pagerSelectOptions: [],
            firstRow: 0,
            currentPageRows: !isNull(parseInt(pageSize, 10)) ? parseInt(pageSize, 10) : data?.length ?? 0,
            lastPageRows: 10,
            activePage: 1,
            gridCssClass: !isNull(options) ? options.gridClass : '',
            headerCssClass: !isNull(options) ? options.headerClass : '',
            rowCssClass: !isNull(options) ? options.rowClass : '',
            enableColumnSearch: !isNull(options) ? options.enableColumnSearch ?? true : true,
            enableGlobalSearch: !isNull(options) ? options.enableGlobalSearch ?? true : true,
            rowClickEnabled: !isNull(onRowClick),
            onRowClick: !isNull(onRowClick) ? onRowClick : () => { },
            onRowHover: !isNull(onRowHover) ? onRowHover : () => { },
            onRowOut: !isNull(onRowOut) ? onRowOut : () => { },
            onSortComplete: !isNull(onSortComplete) ? onSortComplete : () => { },
            onSearchComplete: !isNull(onSearchComplete) ? onSearchComplete : () => { },
            onPageChange: !isNull(onPageChange) ? onPageChange : () => { },
            editButtonEnabled: !isNull(options) && !isNull(options.editButton),
            editButtonEvent: !isNull(options) && !isNull(options.editButton) && !isNull(options.editButton.event) ? options.editButton.event : () => { },
            deleteButtonEnabled: !isNull(options) && !isNull(options.deleteButton),
            deleteButtonEvent: !isNull(options) && !isNull(options.deleteButton) && !isNull(options.deleteButton.event) ? options.deleteButton.event : () => { },
            enableDownload: !isNull(options) ? options?.enableDownload ?? true : true,
            downloadFilename: !isNull(options) && !isNull(options?.downloadFilename) ? options?.downloadFilename : null,
            onDownloadComplete: !isNull(options) && !isNull(options?.onDownloadComplete) ? options?.onDownloadComplete : () => { },
            globalSearchInput: '',
            toggleState: true,
            prevProps: null,
            hiddenColIndex: !isNull(columns) ? columns.map((col, key) => {
                if (!isNull(col?.hidden))
                    return key;
                else
                    return null;
            }) : [],
            concatColumns: !isNull(columns) ? columns.map((col) => {
                let separator = ' '
                if (!isNull(col.concatColumns) && !isNull(col.concatColumns.columns)) {
                    if (!isNull(col.concatColumns.separator))
                        separator = col.concatColumns.separator
                    return { cols: col.concatColumns.columns, sep: separator };
                }
                return null
            }) : [],
            columnFormatting: !isNull(columns) ? columns.map((col) => {
                if (!isNull(col.formatting) && !isNull(col.formatting.type)) {
                    return { type: col?.formatting?.type, format: col?.formatting?.format ?? '' };
                }
                return null
            }) : [],
            cssClassColumns: !isNull(columns) ? columns.map((col) => {
                if (!isNull(col.class))
                    return col.class;
                else
                    return null;
            }) : [],
            columnWidths: !isNull(columns) ? columns.map((col) => {
                if (!isNull(col.width))
                    return col.width;
                else
                    return null;
            }) : []
        }
        this.dataRecieved = this.state.rowsData
        this.searchCols = []
        this.gridHeaderRef = createRef(null);
    }

    shouldComponentUpdate(nextProps, nextStats) {
        if (!objectsEqual(this.props.columns, nextProps.columns) ||
            !objectsEqual(this.props.data, nextProps.data) ||
            !objectsEqual(this.state.columns, nextStats.columns) ||
            !objectsEqual(this.state.rowsData, nextStats.rowsData) ||
            (this.state.noOfPages !== nextStats.noOfPages) ||
            (this.state.lastPageRows !== nextStats.lastPageRows) ||
            !objectsEqual(this.state.pagerSelectOptions, nextStats.pagerSelectOptions) ||
            (this.state.firstRow !== nextStats.firstRow) ||
            (this.state.activePage !== nextStats.activePage) ||
            (this.state.toggleState !== nextStats.toggleState) ||
            (this.state.globalSearchInput !== nextStats.globalSearchInput)) {
            return true;
        } else {
            return false;
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        const { columns, data, pageSize } = nextProps
        if ((isNull(prevState.prevProps?.data) && isNull(nextProps.data)) ||
            (!isNull(prevState.prevProps?.data) && !isNull(nextProps.data) &&
                Object.keys(prevState.prevProps?.data).length === Object.keys(nextProps.data).length
                && Object.keys(prevState.prevProps?.data).every(p =>
                    prevState.prevProps?.data[p] === nextProps.data[p]))) {
            return null;
        }

        return {
            prevProps: nextProps,
            columns: !isNull(columns) ? columns : [],
            rowsData: !isNull(data) ? data : [],
            totalRows: data?.length ?? 0,
            pageRows: !isNull(parseInt(pageSize, 10)) ? parseInt(pageSize, 10) : data?.length ?? 0,
            currentPageRows: !isNull(parseInt(pageSize, 10)) ? parseInt(pageSize, 10) : data?.length ?? 0,
            hiddenColIndex: !isNull(columns) ? columns.map((col, key) => {
                if (!isNull(col?.hidden) && col?.hidden === true)
                    return key;
                else
                    return null;
            }) : [],
            concatColumns: !isNull(columns) ? columns.map((col) => {
                let separator = ' '
                if (!isNull(col.concatColumns) && !isNull(col.concatColumns.columns)) {
                    if (!isNull(col.concatColumns.separator))
                        separator = col.concatColumns.separator
                    return { cols: col.concatColumns.columns, sep: separator };
                }
                return null
            }) : [],
            columnFormatting: !isNull(columns) ? columns.map((col) => {
                if (!isNull(col.formatting) && !isNull(col.formatting.type)) {
                    return { type: col?.formatting?.type, format: col?.formatting?.format ?? '' };
                }
                return null
            }) : [],
            cssClassColumns: !isNull(columns) ? columns.map((col) => {
                if (!isNull(col.class))
                    return col.class;
                else
                    return null;
            }) : [],
            columnWidths: !isNull(columns) ? columns.map((col) => {
                if (!isNull(col.width))
                    return col.width;
                else
                    return null;
            }) : []
        }
    }

    componentDidMount = () => {
        this.setPagingVariables()
    }

    componentDidUpdate(prevProps, prevState) {
        if (!objectsEqual(this.props.data, prevProps.data)) {
            this.dataRecieved = this.state.rowsData
        }
        if (!objectsEqual(this.props.data, prevProps.data) ||
            !objectsEqual(this.state.rowsData, prevState.rowsData)) {
            this.setPagingVariables()
        }
    }

    setPagingVariables = () => {
        let noOfPages = parseInt(this.state.totalRows / this.state.pageRows, 10) ?? 0
        let lastPageRows = parseInt(this.state.totalRows % this.state.pageRows, 10) ?? 0
        if (lastPageRows > 0)
            noOfPages++;
        else if (lastPageRows === 0)
            lastPageRows = this.state.pageRows
        let pagerSelectOptions = noOfPages > 0 ? [...Array(noOfPages).keys()].map(i => i + 1) : [];
        this.setState({
            noOfPages: noOfPages,
            lastPageRows: lastPageRows,
            pagerSelectOptions: pagerSelectOptions.map((item, key) =>
                <option key={key} value={item}>
                    {item}
                </option>)
        })
    }

    handleForwardPage = (e) => {
        e.preventDefault();
        e.persist();
        const prevPage = this.state.activePage;
        if (this.state.activePage !== this.state.noOfPages) {
            this.setState((prevState) => ({ activePage: prevState.activePage + 1 }), () => {
                this.handleChangePage(e, this.state.activePage, prevPage)
            })
        }
    }

    handleBackwardPage = (e) => {
        e.preventDefault();
        e.persist();
        const prevPage = this.state.activePage;
        if (this.state.activePage !== 1) {
            this.setState((prevState) => ({ activePage: prevState.activePage - 1 }), () => {
                this.handleChangePage(e, this.state.activePage, prevPage)
            })
        }
    }

    handleChangePage = (e, newPage, previousPage = -1) => {
        e.preventDefault();
        const {
            pageRows,
            noOfPages,
            lastPageRows,
            activePage,
            onPageChange
        } = this.state;
        const isLastPage = newPage === noOfPages;
        const prevPage = previousPage === -1 ? activePage : previousPage;
        this.setState({
            firstRow: pageRows * (newPage - 1),
            currentPageRows: isLastPage ? lastPageRows : pageRows,
            activePage: newPage
        }, () => {
            if (typeof onPageChange === 'function') {
                onPageChange(
                    e,
                    this.state.activePage,
                    prevPage,
                    this.state.currentPageRows,
                    parseInt(this.state.firstRow + 1)
                );
            }
        });
    }

    onHeaderClicked = (e, name) => {
        eventGridHeaderClicked(e, name, this, this.state.onSortComplete);
    };

    onSearchClicked = (e, colName, colObject, formatting) => {
        if (e?.target?.getAttribute('data-type') === `globalSearch${this.state.gridID}`) {
            this.setState({
                globalSearchInput: e.target.value
            }, () => {
                eventGridSearchClicked(
                    e,
                    colName,
                    colObject,
                    formatting,
                    this,
                    this.state.onSearchComplete
                );
            });
        }
        else {
            eventGridSearchClicked(
                e,
                colName,
                colObject,
                formatting,
                this,
                this.state.onSearchComplete
            );
        }
    };

    handleResetSearch = (e) => {
        e.preventDefault();
        this.searchCols = [];
        const gridHeader = this.gridHeaderRef?.current;
        if (!isNull(gridHeader)) {
            const inputs = gridHeader.querySelectorAll('input');
            if (!isNull(inputs))
                inputs.forEach(input => {
                    input.value = '';
                });
        }
        this.setState({
            globalSearchInput: '',
            rowsData: this.dataRecieved,
            activePage: 1,
            totalRows: this.dataRecieved.length,
            firstRow: 0,
            currentPageRows: this.state.pageRows,
            toggleState: !this.state.toggleState
        });
    }

    render() {
        const {
            totalRows,
            currentPageRows,
            firstRow,
            activePage,
            noOfPages,
            pageRows,
            enablePaging,
            height,
            width,
            rowsData,
            hiddenColIndex,
            concatColumns,
            columnFormatting,
            cssClassColumns,
            columns,
            rowCssClass,
            rowClickEnabled,
            onRowClick,
            onRowHover,
            onRowOut,
            editButtonEnabled,
            deleteButtonEnabled,
            editButtonEvent,
            deleteButtonEvent,
            columnWidths,
            maxWidth,
            maxHeight,
            enableGlobalSearch,
            enableDownload,
            downloadFilename,
            globalSearchInput,
            gridID,
            enableColumnSearch,
            headerCssClass,
            gridCssClass,
            onDownloadComplete,
            pagerSelectOptions
        } = this.state
        return (
            <div className={!isNull(gridCssClass) ?
                `${gridCssClass} react-data-grid-lite-component` :
                "react-data-grid-lite-component"}
                style={{ maxWidth: maxWidth, width: width }}>
                <GridGlobalSearchBar
                    enableGlobalSearch={enableGlobalSearch}
                    globalSearchInput={globalSearchInput}
                    gridID={gridID}
                    columns={columns}
                    onSearchClicked={this.onSearchClicked}
                    handleResetSearch={this.handleResetSearch}
                    enableDownload={enableDownload}
                    rowsData={rowsData}
                    downloadFilename={downloadFilename}
                    onDownloadComplete={onDownloadComplete}
                />

                <div className={!isNull(gridCssClass) ?
                    `${gridCssClass} col-12 m-0 p-0 react-data-grid-lite`
                    : "col-12 m-0 p-0 react-data-grid-lite"}>
                    <table className="m-0 p-0">
                        <GridHeader
                            columns={columns}
                            hiddenColIndex={hiddenColIndex}
                            enableColumnSearch={enableColumnSearch}
                            concatColumns={concatColumns}
                            editButtonEnabled={editButtonEnabled}
                            deleteButtonEnabled={deleteButtonEnabled}
                            headerCssClass={headerCssClass}
                            gridID={gridID}
                            onHeaderClicked={this.onHeaderClicked}
                            onSearchClicked={this.onSearchClicked}
                            columnWidths={columnWidths}
                            gridHeaderRef={this.gridHeaderRef}
                        />
                        <tbody style={{ height: height, maxHeight: maxHeight }}>
                            <GridRows
                                rowsData={rowsData}
                                first={firstRow}
                                count={currentPageRows}
                                hiddenColIndex={hiddenColIndex}
                                concatColumns={concatColumns}
                                columnFormatting={columnFormatting}
                                cssClassColumns={cssClassColumns}
                                columns={columns}
                                columnWidths={columnWidths}
                                rowCssClass={rowCssClass}
                                rowClickEnabled={rowClickEnabled}
                                onRowClick={onRowClick}
                                onRowHover={onRowHover}
                                onRowOut={onRowOut}
                                editButtonEnabled={editButtonEnabled}
                                deleteButtonEnabled={deleteButtonEnabled}
                                editButtonEvent={editButtonEvent}
                                deleteButtonEvent={deleteButtonEvent}
                            />
                        </tbody>
                    </table>
                    <GridFooter
                        totalRows={totalRows}
                        currentPageRows={currentPageRows}
                        activePage={activePage}
                        pageRows={pageRows}
                        pagerSelectOptions={pagerSelectOptions}
                        enablePaging={enablePaging}
                        noOfPages={noOfPages}
                        onPageChange={this.handleChangePage}
                        onPrev={this.handleBackwardPage}
                        onNext={this.handleForwardPage}
                    />

                </div>
            </div>
        )
    }
}

export default DataGrid