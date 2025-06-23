import React from 'react';
import DataGrid from 'react-data-grid-lite';
import { useFetch } from '../data';
import { ExampleBlock } from '../example-block';
import './../App.css';

const options = {
    actionColumnAlign: 'left',
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
        else if (val.toLowerCase() === 'published')
            return {
                name: val, formatting: {
                    type: 'Date', format: 'dd-MMMM-yyyy'
                }, width: '200px'
            }
        else if (val.toLowerCase() === 'title'
            || val.toLowerCase() === 'image'
            || val.toLowerCase() === 'publisher')
            return {
                name: val, width: '250px'
            }
        else
            return {
                name: val, width: '175px'
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