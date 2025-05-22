import React, { useEffect, useState } from 'react';
import DataGrid, { trackPromise } from 'react-data-grid-lite';
import './App.css';

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
    },
    downloadFilename: "test.csv",
    enableColumnSearch: true,
}

function App() {
    const [users, setUsers] = useState([]);
    const [userColumns, setUserColumns] = useState({});
    useEffect(() => {
        const promise = fetch('https://fakerapi.it/api/v1/users?_quantity=1000')
            .then(response => response.json())
            .then(data => {
                const Columns = Object.keys(data.data[0])
                setUserColumns(Columns.map((val) => {
                    if (val.toLowerCase() === 'id')
                        return {
                            name: val,
                            alias: 'ID',
                            searchEnable: true,
                        }
                    else if (val.toLowerCase() === 'uuid')
                        return {
                            name: val,
                            alias: 'UUID'
                        }
                    else if (val.toLowerCase() === 'email')
                        return {
                            name: val,
                            alias: 'Email',
                        }
                    else if (val.toLowerCase() === 'image')
                        return {
                            name: val,
                            alias: 'Image',
                        }
                    else if (val.toLowerCase() === 'website')
                        return {
                            name: val,
                            alias: 'Website',
                        }
                    else if (val.toLowerCase() === 'firstname')
                        return {
                            name: val,
                            alias: 'Name',
                            cssClass: 'nameColumn',
                            concatColumns: {
                                columns: ['firstname', 'lastname']
                            }
                        }
                    else if (
                        val.toLowerCase() === 'lastname' ||
                        val.toLowerCase() === 'username' ||
                        val.toLowerCase() === 'ip' ||
                        val.toLowerCase() === 'macaddress' ||
                        val.toLowerCase() === 'password'
                    )
                        return {
                            name: val,
                            hidden: true
                        }
                    else
                        return { name: val, }
                }));
                setUsers(data.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        trackPromise(promise);

    }, []);


    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <h1>React Data Grid Lite Example</h1>
            </div>
            <DataGrid
                columns={userColumns}
                data={users}
                pageSize={20}
                height={"600px"}
                maxHeight={"600px"}
                options={options}
                width={"1400px"}
                onRowClick={
                    (e, row) => {
                        alert(row);
                        console.log(row);
                    }
                }
            />
        </>
    )
}

export default App
