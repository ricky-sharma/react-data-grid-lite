import DataGrid from 'react-data-grid-lite';
import './App.css';
import { columns, sampleData } from './data';

function App() {
    const options = {
        EnableColumnSearch: true,
        EnableGlobalSearch: true,
        EditButton: {
            Event: () => { alert('Edit Button clicked!') }
        },
        DeleteButton: {
            Event: () => { alert('Delete Button clicked!') }
        }
    }
    return (
        <DataGrid
            Columns={columns}
            RowsData={sampleData}
            Options={options}
            PageRows={5}
        />
    )
}

export default App
