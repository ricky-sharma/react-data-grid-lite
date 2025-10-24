import React, { useEffect, useState } from 'react';
import DataGrid, { trackPromise } from 'react-data-grid-lite';
import { ExampleBlock } from '../example-block';
import './../App.css';

export default function Grid9() {
    const rows = 1000;
    const cols = 1000;
    const [data, setData] = useState();
    const columns = Array.from({ length: cols }, (_, colIndex) => {
        return {
            name: `${colIndex}`,
            alias: `col-${colIndex}`,
            width: '150px'
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
            title="1000 x 1000 Grid"
            theme="medi-glow"
            text="This grid displays 1,000 rows by 1,000 columns with automatic virtual loading. Vertical virtualization is enabled when the row count exceeds 25, and horizontal virtualization is enabled when the column count exceeds 25."
            htmlContent="<p>This behavior can be overridden using the virtualization prop:</p><ul><li>true — enables virtualization from 0 rows and 0 columns.</li><li>false — disables virtualization entirely. Not recommended for medium to large datasets.</li><li>No value set (default) — uses automatic thresholds: virtualization is enabled when rows > 25 or columns > 25.</li></ul><br/><a rel='noopener noreferrer' target='_blank' href='https://github.com/ricky-sharma/react-data-grid-lite/blob/master/example/src/pages/grid9.jsx'>Complete Source Code on GitHub</a>"
        >
            <DataGrid
                columns={columns}
                data={data}
                width="inherit"
                height="50vh"
                theme={"medi-glow"}
            />
        </ExampleBlock>
    )
}