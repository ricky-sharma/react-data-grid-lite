import React from 'react';
import DataGrid from 'react-data-grid-lite';
import { useFetch } from '../data';
import { ExampleBlock } from '../example-block';
import './../App.css';

const options = {
    actionColumnAlign: 'right',
    enableColumnSearch: false,
    showToolbar: false,
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
                name: val, alias: 'ID', width: '100px', fixed: true
            }
        else if (val.toLowerCase() === 'email')
            return {
                name: val, resizable: true,
                render: (row) => (
                    <div className="alignCenter"
                        style={{
                            height: '100%', width: "100%", padding: "38px"
                        }}>
                        <a rel='noopener noreferrer' href={`mailto:${row[val.toLowerCase()]}`}
                            className="ellipsis">
                            {row[val.toLowerCase()]}
                        </a>
                    </div>
                )
            }
        else if (val.toLowerCase() === 'website')
            return {
                name: val,
                render: (row) => (
                    <div className="alignCenter" style={{
                        height: '100%', width: "100%", padding: "38px"
                    }}>
                        <a href={`${row[val.toLowerCase()]}`}
                            className="ellipsis" rel='noopener noreferrer' target='_blank'>
                            {row[val.toLowerCase()]}
                        </a>
                    </div>
                )
            }
        else if (val.toLowerCase() === 'image') {
            return {
                name: val,
                width: '300px',
                order:4,
                render: () => {
                    const random = Math.random();
                    const largeImage = `https://picsum.photos/300/100?random=${random}`;
                    return (
                        <div className="image-container alignCenter">
                            <div className="image-wrapper alignCenter">
                                <img
                                    src={largeImage}
                                    alt="Thumb"
                                    className="thumbnail"
                                />
                                <div className="overlay">
                                    <img
                                        src={largeImage}
                                        alt="Large"
                                        className="large-image"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                }
            };
        }
        else if (val.toLowerCase() === 'firstname')
            return {
                name: val, alias: 'Name',
                concatColumns: {
                    columns: ['firstname', 'lastname']
                }
            }
        else
            return {
                name: val, hidden: true
            }
    }) : [];
    return (
        <ExampleBlock
            title="Custom Cell Rendering with Dynamic Images and Styled Links"
            theme="medi-glow"
            text="Actions Column right aligned, First Name and Last Name are combined into the Name field, grid toolbar is hidden. This data grid features following custom cell rendering:"
            htmlContent="<ul><li> Dynamic Images: Cells display images loaded from the <a href='https://picsum.photos/' rel='noopener noreferrer' target='_blank'>Picsum service</a>. </li><li> Styled Links: Email and website fields are rendered as styled anchor links, enhancing user interaction.</li></ul><p>Note: Missing images may occur if the third-party Picsum service returns invalid or unreachable URLs.</p><p><a rel='noopener noreferrer' target='_blank' href='https://github.com/ricky-sharma/react-data-grid-lite/blob/master/example/src/pages/grid3.jsx'>Complete Source Code on GitHub</a></p>"
        >
            <DataGrid
                columns={columns}
                data={users}
                pageSize={10}
                options={options}
                width="inherit"
                height="60vh"
                theme="medi-glow"
            />
        </ExampleBlock>
    )
}