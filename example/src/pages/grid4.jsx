import React from 'react';
import DataGrid from 'react-data-grid-lite';
import { useFetch } from '../data';
import { ExampleBlock } from '../example-block';
import './../App.css';

export default function Grid4() {
    const users = useFetch("users");
    const columns = users?.length > 0 ? Object.keys(users[0])?.map((val) => {
        if (val.toLowerCase() === 'id')
            return {
                name: val, alias: 'ID', width: '100px'
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
            title="Example 4"
            theme="default"
            text="The default visual presentation when no theme or external CSS is applied."
        >
            <DataGrid
                columns={columns}
                data={users}
                pageSize={10}
                width="70vw"
                height="35vh"
            />
        </ExampleBlock>
    )
}