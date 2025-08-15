import React from 'react';
import DataGrid from 'react-data-grid-lite';
import { useFetch } from '../data';
import { ExampleBlock } from '../example-block';
import './../App.css';

const options = {
    enableColumnSearch: false,
    enableColumnResize: true,
    actionColumnAlign: 'right',
    rowSelectColumnAlign: 'right',
    editButton: {
        event: (e, row) => {
            alert('Edit Button clicked!');
            console.log(row);
        }
    },
    rowHeight: '60px'
}

export default function Grid5() {
    const users = useFetch();
    const columns = users?.length > 0 ? Object.keys(users[0])?.map((val) => {
        if (val.toLowerCase() === 'id')
            return {
                name: val, alias: 'ID', width: '100px', fixed: true
            }
        else if (val.toLowerCase() === 'title')
            return {
                name: val, fixed: true, width: '180px'
            }
        else if (val.toLowerCase() === 'description')
            return {
                name: val, hidden: true
            }
        else if (val.toLowerCase() === 'published')
            return {
                name: val, formatting: {
                    type: 'Date', format: 'dd-MMM-yyyy'
                }
            }
        else if (val.toLowerCase() === 'isbn' || val.toLowerCase() === 'genre')
            return {
                name: val, width: '200px'
            }
        else
            return {
                name: val, width: '250px'
            }
    }) : [];

    return (
        <ExampleBlock
            title="Pinned and resizable columns enabled, and Column search is disabled"
            theme="dark-stack"
            text=""
            htmlContent="<a rel='noopener noreferrer' target='_blank' href='https://github.com/ricky-sharma/react-data-grid-lite/blob/master/example/src/pages/grid5.jsx'>Complete Source Code on GitHub</a>"
        >
            <DataGrid
                columns={columns}
                data={users}
                pageSize={10}
                options={options}
                width="inherit"
                height="75vh"
                theme="dark-stack"
            />
        </ExampleBlock>
    )
}