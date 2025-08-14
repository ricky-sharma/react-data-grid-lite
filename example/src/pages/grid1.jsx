import React, { useEffect, useState } from 'react';
import DataGrid from 'react-data-grid-lite';
import { useFetch2 } from '../data';
import { ExampleBlock } from '../example-block';
import './../App.css';

const options = {
    enableColumnSearch: false,
    enableColumnResize: true,
    enableColumnDrag: true,
    rowHeight: '70px'
};

export default function Grid1() {
    const fetchedData = useFetch2();
    const [data, setData] = useState([]);

    useEffect(() => {
        if (fetchedData?.length > 0) {
            setData(fetchedData);
        }
    }, [fetchedData]);

    const columns = [
        {
            name: 'id',
            width: '75px',
            fixed: true,
            render: (row) => (
                <div
                    style={{
                        height: '100%',
                        backgroundColor: row['completed'] ? 'green' : '#f28b82',
                        color: 'black'
                    }}
                    className="alignCenter"
                >
                    {row['id']}
                </div>
            )
        },
        {
            name: 'title',
            render: (row) => {
                return <div
                    style={{ height: "100%", textAlign:"left", padding:"15px" }}>
                    <label
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "inherit",
                            
                            textTransform: "capitalize"
                        }} >
                        {row['title']}
                    </label>
                </div>
            }
        },
        {
            name: 'completed',
            width: '180px',
            sortable: false,
            render: (row) => (
                <div className="alignCenter" style={{ height: '100%' }}>
                    <label className="custom-checkbox">
                        <input
                            type="checkbox"
                            checked={row['completed'] || false}
                            onChange={(e) => {
                                setData((prev) =>
                                    prev.map((baseRow) =>
                                        baseRow.id === row.id
                                            ? { ...baseRow, completed: e.target.checked }
                                            : baseRow
                                    )
                                );
                            }}
                        />
                        <span className="checkmark" />
                    </label>
                </div>
            )
        }
    ];
    return (
        <ExampleBlock title="Interactive Data Grid with Custom Cell Rendering"
            theme="blue-core"
            text='This data grid features dynamic cell rendering: when the " Completed" checkbox is selected, the corresponding ID cell turns green; when unselected, it turns red. Columns are resizable, and the "ID" column remains fixed for improved navigation.'
            htmlContent="<a rel='noopener noreferrer' target='_blank' href='https://github.com/ricky-sharma/react-data-grid-lite/blob/master/example/src/pages/grid1.jsx'>Complete Source Code on GitHub</a>"
        >
            <DataGrid
                columns={columns}
                data={data}
                pageSize={10}
                width="inherit"
                height="70vh"
                theme="blue-core"
                options={options}
            />
        </ExampleBlock>
    );
}
