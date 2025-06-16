import React from 'react';
import DataGrid from 'react-data-grid-lite';
import { useFetch } from '../data';
import { ExampleBlock } from '../example-block';
import './../App.css';

const options = {
    actionColumnAlign: 'right',
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

export default function Grid3() {
    const users = useFetch("users");
    const columns = users?.length > 0 ? Object.keys(users[0])?.map((val) => {
        if (val.toLowerCase() === 'id')
            return {
                name: val,
                alias: 'ID',
                width: '100px', fixed: true
            }
        else if (val.toLowerCase() === 'uuid')
            return {
                name: val,
                alias: 'UUID',
                width: '340px', resizable: true
            }
        else if (val.toLowerCase() === 'email' || val.toLowerCase() === 'website')
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
            title="Example 3"
            theme="medi-glow"
            text="First Name and Last Name are combined into the Name field."
        >
            <DataGrid
                columns={columns}
                data={users}
                pageSize={10}
                options={options}
                width="70vw"
                height="35vh"
                theme="medi-glow"
            />
        </ExampleBlock>
    )
}