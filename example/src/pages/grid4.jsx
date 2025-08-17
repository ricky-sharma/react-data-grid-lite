import React from 'react';
import DataGrid from 'react-data-grid-lite';
import { useFetch } from '../data';
import { ExampleBlock } from '../example-block';
import './../App.css';

const options = {
    rowHeight: '60px'
};

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
            title="The default visual presentation when no theme or external CSS is applied"
            theme="default"
            text=""
            htmlContent="<a rel='noopener noreferrer' target='_blank' href='https://github.com/ricky-sharma/react-data-grid-lite/blob/master/example/src/pages/grid4.jsx'>Complete Source Code on GitHub</a>"
        >
            <DataGrid
                columns={columns}
                data={users}
                pageSize={10}
                width="inherit"
                height="50vh"
                options={options}
            />
        </ExampleBlock>
    )
}