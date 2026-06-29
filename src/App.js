import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import StockReconciliation from './components/StockReconciliation';
import './App.css';
import React from "react";
//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./components/Dashboard";
import Invoice from "./components/Invoice";
import Products from "./components/Products";
import InvoiceHistory from "./components/InvoiceHistory";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = (page, data = null) => {
    setActivePage(page);
    if (data) setSelectedProduct(data);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'reports': return <Reports />;
      case 'products': return <Products onProductClick={(p) => navigate('product-detail', p)} />;
      case 'product-detail': return <ProductDetail product={selectedProduct} onBack={() => navigate('products')} />;
      case 'stock-reconciliation': return <StockReconciliation />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} navigate={navigate} />
      <div className="main-content">
        <TopBar activePage={activePage} />
        <div className="page-content">
          {renderPage()}
        </div>
      </div>
    
  );
}

export default App;
