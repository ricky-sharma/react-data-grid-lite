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
        <>
            <div style={{ maxWidth: "90vw", margin: "auto", padding: "10px" }}>
                <DataGrid
                    Columns={columns}
                    RowsData={sampleData}
                    Options={options}
                    PageRows={2}
                    Height={"500px"} />
            </div>
        </>
    )
}

export default App
