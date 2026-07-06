import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import StockReconciliation from './components/StockReconciliation';
import Invoice from "./components/Invoice";
import InvoiceHistory from "./components/InvoiceHistory";
import StockTransfer from "./components/StockTransfer";
import Purchase from "./components/Purchase";
import Expenses from "./components/Expenses";
import Sales from "./components/Sales";
import SalesReturns from "./components/SalesReturns";
import POS from "./components/POS";
import Customers from "./components/Customers";
import Suppliers from "./components/Suppliers";
import Users from "./components/Users";
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = (page, data = null) => {
    console.log("SIDEBAR CLICKED PAGE ID:", page);
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
      case 'purchase': return <Purchase navigate={navigate} />;
      case 'stock-transfer': return <StockTransfer navigate={navigate} />;
      case 'expenses': return <Expenses navigate={navigate} />;
      case 'invoice': return <Invoice navigate={navigate} />;
      case 'invoice-history': return <InvoiceHistory navigate={navigate} />;
      case 'sales': return <Sales />;
      case 'returns': return <SalesReturns />;
      case 'pos': return <POS />;
      case 'customers': return <Customers />;
      case 'suppliers': return <Suppliers />;
      case 'users': return <Users />;
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
    </div>
  );
}

export default App;