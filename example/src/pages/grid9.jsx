import React, { useEffect, useState } from 'react';
import DataGrid, { trackPromise } from 'react-data-grid-lite';
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
};

export default function Grid4() {
    const rows = 1000;
    const cols = 1000;
    const [data, setData] = useState();
    const columns = Array.from({ length: cols }, (_, colIndex) => {
        return {
            name: `${colIndex}`,
        }
    });

    async function generateDataAsync(rows, cols, delay = 2000) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = Array.from({ length: rows }, (_, rowIndex) =>
                    Array.from({ length: cols }, (_, colIndex) => `${colIndex}-${rowIndex}`)
                );
                resolve(data);
            }, delay);
        });
    }

    useEffect(() => {
        const promise = generateDataAsync(rows, cols)
            .then(response => { setData(response) })

        trackPromise(promise, 500);
    }, []);

    return (
        <ExampleBlock
            title="The default visual presentation when no theme or external CSS is applied"
            theme="default"
            text=""
            htmlContent="<a rel='noopener noreferrer' target='_blank' href='https://github.com/ricky-sharma/react-data-grid-lite/blob/master/example/src/pages/grid4.jsx'>Complete Source Code on GitHub</a>"
        >
            <DataGrid
                columns={columns}
                data={data}
                pageSize={10}
                width="inherit"
                height="50vh"
                options={options}
            />
        </ExampleBlock>
    )
}