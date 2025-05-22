/* eslint-disable react/prop-types */
import React, { Component, createRef } from 'react';
import { isNull, objectsEqual } from '../src/helper/common';
import { eventExportToCSV } from './components/events/event-export-csv-clicked';
import { eventGridHeaderClicked } from "./components/events/event-grid-header-clicked";
import { eventGridSearchClicked } from "./components/events/event-grid-search-clicked";
import GridHeader from "./components/grid-header";
import GridPagination from './components/grid-pagination';
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
            onRowOut
        } = props
        this.state = {
            width: !isNull(width) ? width : Default_Grid_Width_VW,
            maxWidth: !isNull(maxWidth) ? maxWidth : '100vw',
            height: !isNull(height) ? height : '300px',
            maxHeight: !isNull(maxHeight) ? maxHeight : '300px',
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
            }) : [],
            rowClickEnabled: !isNull(onRowClick),
            onRowClick: !isNull(onRowClick) ? onRowClick : () => { },
            onRowHover: !isNull(onRowHover) ? onRowHover : () => { },
            onRowOut: !isNull(onRowOut) ? onRowOut : () => { },
            editButtonEnabled: !isNull(options) && !isNull(options.editButton),
            editButtonEvent: !isNull(options) && !isNull(options.editButton) && !isNull(options.editButton.event) ? options.editButton.event : () => { },
            deleteButtonEnabled: !isNull(options) && !isNull(options.deleteButton),
            deleteButtonEvent: !isNull(options) && !isNull(options.deleteButton) && !isNull(options.deleteButton.event) ? options.deleteButton.event : () => { },
            toggleState: true,
            prevProps: null,
            enableDownload: !isNull(options) ? options.enableDownload ?? true : true,
            downloadFilename: !isNull(options) ? options.downloadFilename : null,
            globalSearchInput: ''
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
                if (!isNull(col.cssClass))
                    return col.cssClass;
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
            pagerSelectOptions: pagerSelectOptions.map((o, key) => <option key={key} className="select-Item" value={o}>{o}</option>)
        })
    }

    handleForwardPage = (e) => {
        e.preventDefault();
        e.persist();
        if (this.state.activePage !== this.state.noOfPages) {
            this.setState((prevState) => ({ activePage: prevState.activePage + 1 }), () => {
                this.handleChangePage(e, this.state.activePage)
            })
        }
    }

    handleBackwardPage = (e) => {
        e.preventDefault();
        e.persist();
        if (this.state.activePage !== 1) {
            this.setState((prevState) => ({ activePage: prevState.activePage - 1 }), () => {
                this.handleChangePage(e, this.state.activePage)
            })
        }
    }

    handleChangePage = (e, k) => {
        e.preventDefault();
        let pageRows = this.state.pageRows
        if (k === this.state.noOfPages)
            this.setState({ firstRow: pageRows * (k - 1), currentPageRows: this.state.lastPageRows, activePage: k })
        else
            this.setState({ firstRow: pageRows * (k - 1), currentPageRows: pageRows, activePage: k })
    }

    onHeaderClicked = (e, name) => {
        eventGridHeaderClicked(e, name, this);
    };

    onSearchClicked = (e, colName, colObject, formatting) => {
        if (e?.target?.getAttribute('data-type') === `globalSearch${this.state.gridID}`) {
            this.setState({
                globalSearchInput: e.target.value
            }, () => {
                eventGridSearchClicked(e, colName, colObject, formatting, this);
            });
        }
        else {
            eventGridSearchClicked(e, colName, colObject, formatting, this);
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
            gridID
        } = this.state
        return (
            <div className={!isNull(this.state.gridCssClass) ?
                `${this.state.gridCssClass} react-data-grid-lite-component` :
                "react-data-grid-lite-component"}
                style={{ maxWidth: maxWidth, width: width }}>
                <div className="mx-0 px-0">
                    <div className="row col-12 globalSearchDiv">
                        {
                            (enableGlobalSearch ?
                                <div
                                    className="p-0 m-0">
                                    <input
                                        data-type={`globalSearch${gridID}`}
                                        value={globalSearchInput}
                                        className="globalSearch"
                                        placeholder="Global Search"
                                        onChange={(e) => this.onSearchClicked(e, '##globalSearch##', this.state.columns)}
                                        type="text" />
                                </div>
                                : null)}
                        {(enableDownload ?
                            <div
                                className="p-0 m-0 icon-div clear-icon-div"
                                title="Reset Search"
                                onClick={this.handleResetSearch}
                                data-toggle="tooltip"
                            >
                                <span className="erase-icon"></span>
                            </div>
                            : null)
                        }
                        {(enableDownload ?
                            <div
                                className="p-0 m-0 icon-div download-icon-div"
                                title="Export CSV"
                                onClick={() => eventExportToCSV(rowsData, columns, downloadFilename)}
                                data-toggle="tooltip"
                            >
                                Export to CSV <span className="download-icon"></span>
                            </div>
                            : null)
                        }
                    </div>
                    <div className={!isNull(this.state.gridCssClass) ? `${this.state.gridCssClass} col-12 m-0 p-0 react-data-grid-lite` : "col-12 m-0 p-0 react-data-grid-lite"}>
                        <div className="row col-12 m-0 p-0" >
                            <table className="table table-striped table-hover border-bottom border-top-0 border-right-0 border-left-0 m-0 mx-0 px-0 no-select">
                                <GridHeader
                                    columns={this.state.columns}
                                    hiddenColIndex={this.state.hiddenColIndex}
                                    enableColumnSearch={this.state.enableColumnSearch}
                                    concatColumns={this.state.concatColumns}
                                    editButtonEnabled={this.state.editButtonEnabled}
                                    deleteButtonEnabled={this.state.deleteButtonEnabled}
                                    headerCssClass={this.state.headerCssClass}
                                    gridID={this.state.gridID}
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
                            <div className="row col-12 m-0 p-0 align-center grid-footer no-select">
                                <div className="col-5 pl-2 m-0 p-0 txt-left">
                                    <b>
                                        {totalRows > currentPageRows ? (`${(activePage - 1) * pageRows + 1} 
                                    - ${(activePage - 1) * pageRows + currentPageRows}`) : totalRows}
                                    </b>
                                    {" of "}
                                    <b>
                                        {totalRows}
                                    </b>
                                    {" results"}
                                </div>
                                <div className="col-2 m-0 p-0" style={{ textAlign: "center" }}>
                                    <select
                                        className="pagerSelect"
                                        value={activePage}
                                        onChange={
                                            (e) => {
                                                this.handleChangePage(e, parseInt(e.target.value))
                                            }}>
                                        {this.state.pagerSelectOptions}
                                    </select>
                                </div>
                                <div className="float-lt col-5 m-0 p-0 pr-1">
                                    <div className="col-12 m-0 p-0">
                                        <GridPagination
                                            enablePaging={enablePaging}
                                            activePage={activePage}
                                            noOfPages={noOfPages}
                                            onPageChange={this.handleChangePage}
                                            onPrevButtonClick={this.handleBackwardPage}
                                            onNextButtonClick={this.handleForwardPage}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default DataGrid