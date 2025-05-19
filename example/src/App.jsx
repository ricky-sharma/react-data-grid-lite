import DataGrid from 'react-data-grid-lite';
import './App.css';
import { columns, sampleData } from './data';

function App() {
    const options = {
        editButton: {
            event: (e, row) => { alert('Edit Button clicked!'), console.log(row) }
        },
        deleteButton: {
            event: (e, row) => { alert('Delete Button clicked!'), console.log(row) }
        },
        filenameDownload: "test.csv"
    }
    return (
        <>
            <DataGrid
                columns={columns}
                rowsData={sampleData}
                options={options}
                pageRows={5}
            />
        </>
    )
}

export default App
