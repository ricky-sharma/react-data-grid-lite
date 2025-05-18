import DataGrid from 'react-data-grid-lite';
import './App.css';
import { columns, sampleData } from './data';

function App() {
    const options = {
        enableColumnSearch: true,
        enableGlobalSearch: true,
        editButton: {
            event: () => { alert('Edit Button clicked!') }
        },
        deleteButton: {
            event: () => { alert('Delete Button clicked!') }
        }
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
