/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import '../src/css/react-data-grid-lite.css';
import { isNull } from '../src/helper/common';
import GridHeader from "./components/grid-header";
import GridPagination from './components/grid-pagination';
import GridRows from './components/grid-rows';
import { eventGridHeaderClicked } from "./components/events/event-grid-header-clicked";
import { eventGridSearchClicked } from "./components/events/event-grid-search-clicked";

export class DataGrid extends Component {
    constructor(props) {
        super(props)
        const { columns, rowsData, pageRows, gridEvents, options, width, height, maxWidth, maxHeight } = props
        this.state = {
            width: !isNull(width) ? width : '100%',
            maxWidth: !isNull(maxWidth) ? maxWidth : '100vw',
            height: !isNull(height) ? height : '300px',
            maxHeight: !isNull(maxHeight) ? maxHeight : '300px',
            gridID: Math.floor(Math.random() * 10000),
            columns: !isNull(columns) ? columns : null,
            rowsData: rowsData,
            totalRows: rowsData?.length ?? 0,
            enablePaging: !isNull(pageRows),
            pageRows: !isNull(parseInt(pageRows, 10)) ? parseInt(pageRows, 10) : rowsData?.length ?? 0,
            noOfPages: 0,
            pagerSelectOptions: [],
            firstRow: 0,
            currentPageRows: !isNull(parseInt(pageRows, 10)) ? parseInt(pageRows, 10) : rowsData?.length ?? 0,
            lastPageRows: 10,
            activePage: 1,
            gridCssClass: !isNull(options) ? options.gridCssClass : null,
            headerCssClass: !isNull(options) ? options.headerCssClass : null,
            rowCssClass: !isNull(options) ? options.rowCssClass : null,
            enableColumnSearch: !isNull(options) ? options.enableColumnSearch : null,
            enableGlobalSearch: !isNull(options) ? options.enableGlobalSearch : null,
            hiddenColIndex: !isNull(columns) ? columns.map((col, key) => {
                if (!isNull(col.hidden) && col.hidden)
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
                if (!isNull(col.formatting) && !isNull(col.formatting.type) && !isNull(col.formatting.format)) {
                    return { type: col.formatting.type, format: col.formatting.format };
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
            }) : [],
            rowClickEnabled: !isNull(gridEvents) && !isNull(gridEvents.onRowClick),
            onRowClick: !isNull(gridEvents) && !isNull(gridEvents.onRowClick) ? gridEvents.onRowClick : () => { },
            onRowHover: !isNull(gridEvents) && !isNull(gridEvents.onRowHover) ? gridEvents.onRowHover : () => { },
            onRowOut: !isNull(gridEvents) && !isNull(gridEvents.onRowOut) ? gridEvents.onRowOut : () => { },
            editButtonEnabled: !isNull(options) && !isNull(options.editButton),
            editButtonEvent: !isNull(options) && !isNull(options.editButton) && !isNull(options.editButton.event) ? options.editButton.event : () => { },
            deleteButtonEnabled: !isNull(options) && !isNull(options.deleteButton),
            deleteButtonEvent: !isNull(options) && !isNull(options.deleteButton) && !isNull(options.deleteButton.event) ? options.deleteButton.event : () => { },
            toggleState: true,
            prevProps: null
        }

        this.dataRecieved = this.state.rowsData
        this.searchCols = []
    }

    shouldComponentUpdate(nextProps, nextStats) {
        if (!this.objectsEqual(this.props.columns, nextProps.columns) ||
            !this.objectsEqual(this.props.rowsData, nextProps.rowsData) ||
            !this.objectsEqual(this.state.columns, nextStats.columns) ||
            !this.objectsEqual(this.state.rowsData, nextStats.rowsData) ||
            (this.state.noOfPages !== nextStats.noOfPages) ||
            (this.state.lastPageRows !== nextStats.lastPageRows) ||
            !this.objectsEqual(this.state.pagerSelectOptions, nextStats.pagerSelectOptions) ||
            (this.state.firstRow !== nextStats.firstRow) ||
            (this.state.activePage !== nextStats.activePage) ||
            (this.state.toggleState !== nextStats.toggleState)) {
            return true;
        } else {
            return false;
        }
    }

    objectsEqual = (o1, o2) =>
        (isNull(o1) && isNull(o2)) || (!isNull(o1) && !isNull(o2) &&
            Object.keys(o1).length === Object.keys(o2).length
            && Object.keys(o1).every(p => o1[p] === o2[p]));


    static getDerivedStateFromProps = (nextProps, prevState) => {
        const { columns, rowsData, pageRows } = nextProps
        if ((isNull(prevState.prevProps?.rowsData) && isNull(nextProps.rowsData)) ||
            (!isNull(prevState.prevProps?.rowsData) && !isNull(nextProps.rowsData) &&
                Object.keys(prevState.prevProps?.rowsData).length === Object.keys(nextProps.rowsData).length
                && Object.keys(prevState.prevProps?.rowsData).every(p =>
                    prevState.prevProps?.rowsData[p] === nextProps.rowsData[p]))) {
            return null;
        }

        return {
            prevProps: nextProps,
            columns: !isNull(columns) ? columns : [],
            rowsData: !isNull(rowsData) ? rowsData : [],
            totalRows: rowsData?.length ?? 0,
            pageRows: !isNull(parseInt(pageRows, 10)) ? parseInt(pageRows, 10) : rowsData?.length ?? 0,
            currentPageRows: !isNull(parseInt(pageRows, 10)) ? parseInt(pageRows, 10) : rowsData?.length ?? 0,
            hiddenColIndex: !isNull(columns) ? columns.map((col, key) => {
                if (!isNull(col.hidden) && col.hidden)
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
                if (!isNull(col.formatting) && !isNull(col.formatting.type) && !isNull(col.formatting.format)) {
                    return { type: col.formatting.type, format: col.formatting.format };
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
        if (!this.objectsEqual(this.props.rowsData, prevProps.rowsData)) {
            this.dataRecieved = this.state.rowsData
        }
        if (!this.objectsEqual(this.props.rowsData, prevProps.rowsData) ||
            !this.objectsEqual(this.state.rowsData, prevState.rowsData)) {
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
            pagerSelectOptions: pagerSelectOptions.map((o, key) => <option key={key} value={o}>{o}</option>)
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
        eventGridSearchClicked(e, colName, colObject, formatting, this);
    };

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
            maxHeight
        } = this.state

        if (isNull(columns))
            return null;

        return (
            <div style={{ maxWidth: maxWidth, margin: "auto", padding: "10px" }}>
                <div
                    className="mx-0 px-0"
                    style={{ width: width }}>
                    {
                        this.state.enableGlobalSearch ?
                            <div className="row col-12 globalSearchDiv">
                                <input
                                    className="globalSearch"
                                    placeholder="Global Search"
                                    onChange={(e) => this.onSearchClicked(e, '##globalSearch##', this.state.columns)}
                                    type="text" />
                            </div>
                            : null
                    }
                    <div className={!isNull(this.state.gridCssClass) ? `col-12 m-0 p-0 ${this.state.gridCssClass}` : "col-12 m-0 p-0 customGrid"}>
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
                                    {"Showing "}
                                    <b>
                                        {totalRows > currentPageRows ? (`${(activePage - 1) * pageRows + 1} 
                                    to ${(activePage - 1) * pageRows + currentPageRows}`) : totalRows}
                                    </b>
                                    {" out of "}
                                    <b>
                                        {totalRows}
                                    </b>
                                    {" entries"}
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