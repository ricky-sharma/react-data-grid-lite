import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './navbar';
import Grid1 from './pages/grid1';
import Grid2 from './pages/grid2';
import Grid3 from './pages/grid3';
import Grid4 from './pages/grid4';
import Grid5 from './pages/grid5';
import Grid6 from './pages/grid6';
import Grid7 from './pages/grid7';
import Grid8 from './pages/grid8';
import Grid9 from './pages/grid9';

function App() {
    return (
        <Router>
            <Navbar style={{ display: 'flex', justifyContent: 'center' }} />
            <div style={{ padding: '8px' }}>
                <Routes>
                    <Route path="/interactive-grid" element={<Grid1 />} />
                    <Route path="/row-actions" element={<Grid2 />} />
                    <Route path="/dynamic-images-grid" element={<Grid3 />} />
                    <Route path="/default-presentation" element={<Grid4 />} />
                    <Route path="/pinned-and-resizable-columns" element={<Grid5 />} />
                    <Route path="/" element={<Grid6 />} />
                    <Route path="/column-drag-drop" element={<Grid6 />} />
                    <Route path="/inline-cell-editing" element={<Grid7 />} />
                    <Route path="/right-to-left" element={<Grid8 />} />
                    <Route path="/million-cells" element={<Grid9 />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
