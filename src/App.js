import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import Invoice from './components/Invoice';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <TopBar />
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/invoices" element={<Invoice />} />
          </Routes>

        </div>
      </div>
    </Router>
  );
}

export default App;