import React, { useRef } from 'react';
import DataGrid from 'react-data-grid-lite';
import { useFetch } from '../data';
import { ExampleBlock } from '../example-block';
import './../App.css';

const options = {
    enableColumnDrag: true,
    rowHeight: '50px'
}

export default function Grid6() {
    const gridRef = useRef(null);
    const users = useFetch("users");
    const columns = users?.length > 0 ? Object.keys(users[0])?.map((val) => {
        if (val.toLowerCase() === 'id')
            return {
                name: val, alias: 'ID', width: '100px', class: "testClass"
            }
        else if (val.toLowerCase() === 'email' || val.toLowerCase() === 'website'
            || val.toLowerCase() === 'image')
            return {
                name: val
            }
        else if (val.toLowerCase() === 'firstname')
            return {
                name: val,
                alias: 'Name',
                concatColumns: {
                    columns: ['firstname', 'lastname']
                }
            }
        else
            return {
                name: val,
                hidden: true
            }
    }) : [];

    return (
        <ExampleBlock
            title="Column Drag-and-Drop"
            theme="default"
            text="Drag-and-drop functionality is enabled for all columns in the grid. Users can freely rearrange column positions to suit their preferences. Column layout updates dynamically as columns are moved."
            htmlContent="<p>The 'Clear Selected Rows' button uses the `clearSelectedRows()` imperative ref API to clear the currently selected rows in the grid.</p><p><a rel='noopener noreferrer' target='_blank' href='https://github.com/ricky-sharma/react-data-grid-lite/blob/master/example/src/pages/grid6.jsx'>Complete Source Code on GitHub</a></p>"
        >
            <button
                className="clear-selected-rows"
                onClick={() => {
                    gridRef?.current?.clearSelectedRows();
                }}
            >
                Clear Selected Rows
            </button>
            <DataGrid
                ref={gridRef}
                columns={columns}
                data={users}
                pageSize={10}
                width="inherit"
                height="60vh"
                options={options}
            />
        </ExampleBlock>
    )
}