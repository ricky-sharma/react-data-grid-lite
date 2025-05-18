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
        const { Columns, RowsData, PageRows, GridEvents, Options, Width, Height, maxWidth, maxHeight } = props
        this.state = {
            width: !isNull(Width) ? Width : '100%',
            maxWidth: !isNull(maxWidth) ? maxWidth : '100vw',
            height: !isNull(Height) ? Height : '300px',
            maxHeight: !isNull(maxHeight) ? maxHeight : '300px',
            gridID: Math.floor(Math.random() * 10000),
            columns: !isNull(Columns) ? Columns : null,
            rowsData: RowsData,
            totalRows: RowsData.length,
            enablePaging: !isNull(PageRows),
            pageRows: !isNull(PageRows) ? PageRows : RowsData.length,
            noOfPages: 0,
            pagerSelectOptions: [],
            firstRow: 0,
            currentPageRows: !isNull(PageRows) ? PageRows : RowsData.length,
            lastPageRows: 10,
            activePage: 1,
            gridCssClass: !isNull(Options) ? Options.GridCssClass : null,
            headerCssClass: !isNull(Options) ? Options.HeaderCssClass : null,
            rowCssClass: !isNull(Options) ? Options.RowCssClass : null,
            enableColumnSearch: !isNull(Options) ? Options.EnableColumnSearch : null,
            enableGlobalSearch: !isNull(Options) ? Options.EnableGlobalSearch : null,
            hiddenColIndex: !isNull(Columns) ? Columns.map((col, key) => {
                if (!isNull(col.Hidden) && col.Hidden)
                    return key;
                else
                    return null;
            }) : null,
            concatColumns: !isNull(Columns) ? Columns.map((col) => {
                let separator = ' '
                if (!isNull(col.ConcatColumns) && !isNull(col.ConcatColumns.Columns)) {
                    if (!isNull(col.ConcatColumns.Separator))
                        separator = col.ConcatColumns.Separator
                    return { cols: col.ConcatColumns.Columns, sep: separator };
                }
                return null
            }) : null,
            columnFormatting: !isNull(Columns) ? Columns.map((col) => {
                if (!isNull(col.Formatting) && !isNull(col.Formatting.Type) && !isNull(col.Formatting.Format)) {
                    return { type: col.Formatting.Type, format: col.Formatting.Format };
                }
                return null
            }) : null,
            cssClassColumns: !isNull(Columns) ? Columns.map((col) => {
                if (!isNull(col.cssClass))
                    return col.cssClass;
                else
                    return null;
            }) : null,
            columnWidths: !isNull(Columns) ? Columns.map((col) => {
                if (!isNull(col.width))
                    return col.width;
                else
                    return null;
            }) : null,
            rowClickEnabled: !isNull(GridEvents) && !isNull(GridEvents.OnRowClick),
            onRowClick: !isNull(GridEvents) && !isNull(GridEvents.OnRowClick) ? GridEvents.OnRowClick : () => { },
            onRowHover: !isNull(GridEvents) && !isNull(GridEvents.OnRowHover) ? GridEvents.OnRowHover : () => { },
            onRowOut: !isNull(GridEvents) && !isNull(GridEvents.OnRowOut) ? GridEvents.OnRowOut : () => { },
            editButtonEnabled: !isNull(Options) && !isNull(Options.EditButton),
            editButtonEvent: !isNull(Options) && !isNull(Options.EditButton) && !isNull(Options.EditButton.Event) ? Options.EditButton.Event : () => { },
            deleteButtonEnabled: !isNull(Options) && !isNull(Options.DeleteButton),
            deleteButtonEvent: !isNull(Options) && !isNull(Options.DeleteButton) && !isNull(Options.DeleteButton.Event) ? Options.DeleteButton.Event : () => { },
            toggleState: true,
            prevProps: null
        }
        this.sortIconHtml = <i className='updown-icon inactive fa fa-sort' />
        this.dataRecieved = this.state.rowsData
        this.searchCols = []
    }

    shouldComponentUpdate(nextProps, nextStats) {
        if (!this.objectsEqual(this.props.Columns, nextProps.Columns) ||
            !this.objectsEqual(this.props.RowsData, nextProps.RowsData) ||
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
        const { Columns, RowsData, PageRows } = nextProps
        if ((isNull(prevState.prevProps?.RowsData) && isNull(nextProps.RowsData)) ||
            (!isNull(prevState.prevProps?.RowsData) && !isNull(nextProps.RowsData) &&
                Object.keys(prevState.prevProps?.RowsData).length === Object.keys(nextProps.RowsData).length
                && Object.keys(prevState.prevProps?.RowsData).every(p =>
                    prevState.prevProps?.RowsData[p] === nextProps.RowsData[p]))) {
            return null;
        }

        return {
            prevProps: nextProps,
            columns: !isNull(Columns) ? Columns : null,
            rowsData: RowsData,
            totalRows: RowsData?.length ?? 0,
            pageRows: !isNull(PageRows) ? PageRows : RowsData.length,
            currentPageRows: !isNull(PageRows) ? PageRows : RowsData.length,
            hiddenColIndex: !isNull(Columns) ? Columns.map((col, key) => {
                if (!isNull(col.Hidden) && col.Hidden)
                    return key;
                else
                    return null;
            }) : null,
            concatColumns: !isNull(Columns) ? Columns.map((col) => {
                let separator = ' '
                if (!isNull(col.ConcatColumns) && !isNull(col.ConcatColumns.Columns)) {
                    if (!isNull(col.ConcatColumns.Separator))
                        separator = col.ConcatColumns.Separator
                    return { cols: col.ConcatColumns.Columns, sep: separator };
                }
                return null
            }) : null,
            columnFormatting: !isNull(Columns) ? Columns.map((col) => {
                if (!isNull(col.Formatting) && !isNull(col.Formatting.Type) && !isNull(col.Formatting.Format)) {
                    return { type: col.Formatting.Type, format: col.Formatting.Format };
                }
                return null
            }) : null,
            cssClassColumns: !isNull(Columns) ? Columns.map((col) => {
                if (!isNull(col.cssClass))
                    return col.cssClass;
                else
                    return null;
            }) : null,
            columnWidths: !isNull(Columns) ? Columns.map((col) => {
                if (!isNull(col.width))
                    return col.width;
                else
                    return null;
            }) : null
        }
    }

    componentDidMount = () => {
        this.setPagingVariables()
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.objectsEqual(this.props.RowsData, prevProps.RowsData)) {
            this.dataRecieved = this.state.rowsData
        }
        if (!this.objectsEqual(this.props.RowsData, prevProps.RowsData) ||
            !this.objectsEqual(this.state.rowsData, prevState.rowsData)) {
            this.setPagingVariables()
        }
    }

    setPagingVariables = () => {
        let noOfPages = parseInt(this.state.totalRows / this.state.pageRows, 10)
        let lastPageRows = parseInt(this.state.totalRows % this.state.pageRows, 10)
        if (lastPageRows > 0)
            noOfPages++;
        else if (lastPageRows === 0)
            lastPageRows = this.state.pageRows
        let pagerSelectOptions = [...Array(noOfPages).keys()].map(i => i + 1);
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
                            <table className="table table-striped table-hover border-bottom border-top-0 border-right-0 border-left-0 m-0 mx-0 px-0">
                                <GridHeader
                                    columns={this.state.columns}
                                    hiddenColIndex={this.state.hiddenColIndex}
                                    enableColumnSearch={this.state.enableColumnSearch}
                                    concatColumns={this.state.concatColumns}
                                    editButtonEnabled={this.state.editButtonEnabled}
                                    deleteButtonEnabled={this.state.deleteButtonEnabled}
                                    headerCssClass={this.state.headerCssClass}
                                    gridID={this.state.gridID}
                                    sortIconHtml={this.sortIconHtml}
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
                            <div className="row col-12 m-0 p-0 align-center grid-footer">
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