import DataGrid from 'react-data-grid-lite';
import './App.css';
import { columns, sampleData } from './data';

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
    return (
        <>
            <DataGrid
                columns={columns}
                data={sampleData}
                options={options}
                pageSize={5}
                width={"1200px"}
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
