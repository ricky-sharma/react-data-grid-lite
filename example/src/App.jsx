import React from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import Navbar from './navbar';
import Grid1 from './pages/grid1';
import Grid2 from './pages/grid2';
import Grid3 from './pages/grid3';
import Grid4 from './pages/grid4';
import Grid5 from './pages/grid5';

function App() {
    return (
        <Router>
            <Navbar style={{ display: 'flex', justifyContent: 'center' }} />
            <div style={{ padding: '8px' }}>
                <Routes>
                    <Route path="/" element={<Grid1 />} />
                    <Route path="/Grid2" element={<Grid2 />} />
                    <Route path="/Grid3" element={<Grid3 />} />
                    <Route path="/Grid4" element={<Grid4 />} />
                    <Route path="/Grid5" element={<Grid5 />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
