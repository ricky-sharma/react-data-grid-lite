import React from 'react';
import DataGrid from 'react-data-grid-lite';
import { useFetch } from '../data';
import { ExampleBlock } from '../example-block';
import './../App.css';

const options = {
    editButton: {
        event: (e, row) => {
            alert('Edit Button clicked!');
            console.log(row);
        }
    },
    deleteButton: {
        event: (e, row) => {
            alert('Delete Button clicked!');
            console.log(row);
        }
    }
}

export default function Grid1() {
    const users = useFetch();
    const columns = users?.length > 0 ? Object.keys(users[0])?.map((val) => {
        if (val.toLowerCase() === 'id')
            return {
                name: val, alias: 'ID', width: '100px'
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
            title="Example 1"
            theme="blue-core"
            text="Row Actions, Global Search, and Column Search Enabled."
        >
            <DataGrid
                columns={columns}
                data={users}
                pageSize={10}
                options={options}
                width="70vw"
                height="35vh"
                theme="blue-core"
            />
        </ExampleBlock>
    )
}