import React from 'react';
import DataGrid from 'react-data-grid-lite';
import { useFetch } from '../data';
import { ExampleBlock } from '../example-block';
import './../App.css';

const options = {
    actionColumnAlign: 'left',
    enableColumnSearch: false,
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
    },
    rowHeight: '70px'
}

export default function Grid2() {
    const users = useFetch();
    const columns = users?.length > 0 ? Object.keys(users[0])?.map((val) => {
        if (val.toLowerCase() === 'id')
            return {
                name: val, alias: 'ID', width: '90px',
                render: (row) => {
                    return <div
                        style={{ height: "100%" }}
                        className='alignCenter'>
                        <label className='alignCenter'
                            style={{
                                width: "100%",
                                height: "100%",  
                                backgroundColor: "#ff8300",
                                color:"#e0e0e0"
                            }} >
                            {row[val]}
                        </label>
                    </div>
                }
            }
        else if (val.toLowerCase() === 'author')
            return {
                name: val, width: '175px',
                render: (row) => {
                    return <div
                        style={{ height: "100%" }}
                        >
                        <label className='alignCenter'
                            style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#007700",
                                color: "#e0e0e0"
                            }} >
                            {row[val]}
                        </label>
                    </div>
                }
            }
        else if (val.toLowerCase() === 'image')
            return {
                name: val, width: '300px', cellStyle: { backgroundColor: '#e0e0e0' },
                render: (row) => (
                    <div className="alignCenter" style={{
                        height: '100%',
                        width: "100%",
                        textAlign: "left",
                        padding: "20px"
                    }}>
                        <a rel='noopener noreferrer' target='_blank' href={`${row[val.toLowerCase()]}`}
                            className="ellipsis" >
                            {row[val.toLowerCase()]}
                        </a>
                    </div>
                )
            }
        else if (val.toLowerCase() === 'description')
            return {
                name: val, hidden: true
            }
        else if (val.toLowerCase() === 'published')
            return {
                name: val,
                formatting: {
                    type: 'Date', format: 'dd-MMMM-yyyy'
                },
                width: '200px', cellStyle: { backgroundColor: 'red' }
            }
        else if (val.toLowerCase() === 'title'
            || val.toLowerCase() === 'publisher')
            return {
                name: val, width: '250px', cellStyle: {backgroundColor : 'silver'}
            }
        else
            return {
                name: val, width: '175px', cellStyle: { backgroundColor: 'gold' }
            }
    }) : [];

    return (
        <ExampleBlock
            title="Row Actions and Global Search Enabled, and Actions Column left aligned"
            theme="dark-stack"
            text="Styled Text Fields: The ID and Author fields are presented with custom styling to enhance the visual display and user experience."
            htmlContent="<a rel='noopener noreferrer' target='_blank' href='https://github.com/ricky-sharma/react-data-grid-lite/blob/master/example/src/pages/grid2.jsx'>Complete Source Code on GitHub</a>"

        >
            <DataGrid
                columns={columns}
                data={users}
                pageSize={10}
                options={options}
                width="inherit"
                height="88vh"
                theme="dark-stack"
            />
        </ExampleBlock>
    )
}