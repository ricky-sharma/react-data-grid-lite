import DataGrid from 'react-data-grid-lite';
import './App.css';
import { columns, sampleData } from './data';

const options = {
    editButton: {
        event: (e, row) => { alert('Edit Button clicked!'), console.log(row) }
    },
    deleteButton: {
        event: (e, row) => { alert('Delete Button clicked!'), console.log(row) }
    },
    downloadFilename: "test.csv"
}

function App() {
    return (
        <>
            <DataGrid
                columns={columns}
                data={sampleData}
                options={options}
                pageSize={5}
            />
        </>
    )
}

export default App
