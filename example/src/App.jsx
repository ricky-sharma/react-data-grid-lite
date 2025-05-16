import { ReactDataGridLite } from 'react-data-grid-lite';
import './App.css';
import { columns, sampleData } from './data';

function App() {
    const options = { EnableColumnSearch: true, EnableGlobalSearch: true }
  return (
    <>
          <div style={{ maxWidth: "90vw", margin:"auto", padding:"10px" } }>
              <ReactDataGridLite
                  Columns={columns}
                  RowsData={sampleData}
                  Options={options}
                  PageRows={5}
                  Height={"300px"} />
          </div>
    </>
  )
}

export default App
