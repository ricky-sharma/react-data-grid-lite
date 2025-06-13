import React from 'react';
import DataGrid from 'react-data-grid-lite';
import { useFetch } from '../data';
import { ExampleBlock } from '../example-block';
import './../App.css';

const options = {
    enableColumnSearch: false,
    enableColumnResize: true
}

export default function Grid2() {
    const users = useFetch();
    const columns = users?.length > 0 ? Object.keys(users[0])?.map((val) => {
        if (val.toLowerCase() === 'id')
            return {
                name: val, alias: 'ID', width: '100px', fixed: true
            }
        else if (val.toLowerCase() === 'title' || val.toLowerCase() === 'author')
            return {
                name: val, fixed: true, width: '200px'
            }
        else if (val.toLowerCase() === 'description')
            return {
                name: val, hidden: true
            }
        else
            return {
                name: val, width: '250px'
            }
    }) : [];

    return (
        <ExampleBlock
            title="Example 2"
            theme="dark-stack"
            text="Pinned and resizable columns are enabled, and Column search is disabled."
        >
            <DataGrid
                columns={columns}
                data={users}
                pageSize={10}
                options={options}
                width="70vw"
                height="35vh"
                theme="dark-stack"
            />
        </ExampleBlock>
    )
}