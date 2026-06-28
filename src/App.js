import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import Invoice from './components/Invoice';
import Products from './components/Products';
import InvoiceHistory from "./components/InvoiceHistory";
import './App.css';

function App() {
  return (

    
    
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <TopBar />
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/invoices" element={<Invoice />} />
            <Route path="/products" element={<Products />} />
            <Route path="/invoice-history" element={<InvoiceHistory />} />
          </Routes>

        </div>
      </div>
    
  );
}

export default App;