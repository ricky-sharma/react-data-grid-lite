import React from 'react';
import DataGrid from 'react-data-grid-lite';
import { columns, sampleData } from '../data';
import { ExampleBlock } from '../example-block';
import './../App.css';

const options = {
    enableColumnDrag: true,
    enableCellEdit: true,
    enableColumnSearch: false,
    rowHeight: '70px'
}

export default function Grid7() {
    return (
        <ExampleBlock
            title="Edit Data Directly in Grid"
            theme="blue-core"
            text="Cell editing mode is enabled for all columns in the grid. Users can modify data directly by editing cell values by double clicking the cells. The `onCellUpdate` callback is triggered when a cell value is updated and the cell loses focus (i.e., when edit mode ends)."
            htmlContent="<p>The <i>Department - Title</i> column is a concatenated field combining the <i>Department</i> and <i>Title</i> values. In cell edit mode, the <i>Department</i> field displays a dropdown menu, while the <i>Title</i> field appears as a text input.</p><a rel='noopener noreferrer' target='_blank' href='https://github.com/ricky-sharma/react-data-grid-lite/blob/master/example/src/pages/grid7.jsx'>Complete Source Code on GitHub</a>"
        >
            <DataGrid
                columns={columns}
                data={sampleData}
                pageSize={10}
                width="inherit"
                height="30vh"
                theme="blue-core"
                options={options}
                onCellUpdate={(cellUpdate) => {
                    console.log(cellUpdate);
                }}
            />
        </ExampleBlock>
    )
}