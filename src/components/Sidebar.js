
import React, { useState } from 'react';
import '../App.css';
import customersLogo from '../icons/customers.png';
import posLogo from '../icons/sales.png';
import dashboardLogo from '../icons/dashboard.png';
import purchaseLogo from '../icons/purchases.png';
import productsLogo from '../icons/products.png';
import suppliersLogo from '../icons/supplier.png';
import reportsLogo from '../icons/report.png';
import returnsLogo from '../icons/return.png';
import salesLogo from '../icons/sales.png';
import settingsLogo from '../icons/settings.png';
import stocksLogo from '../icons/stock.png';
import userLogo from '../icons/user.png';
import transferLogo from '../icons/transfer.png';
import expenseLogo from '../icons/expense.png';
import invoicesLogo from '../icons/invoice.webp';

const Icon = ({ name }) => {
    const icons = {
    dashboard:<img src={dashboardLogo} alt="" />,
    products:<img src={productsLogo} alt="" />,
    sales:<img src={salesLogo} alt="" />,
    purchase:<img src={purchaseLogo} alt="" />,
    stock:<img src={stocksLogo} alt="" />,
    reports:<img src={reportsLogo} alt="" />,
    customers:<img src={customersLogo} alt="" />,
    suppliers:<img src={suppliersLogo} alt="" />,
    settings:<img src={settingsLogo} alt="" />,
    pos:<img src={posLogo} alt="" />,
    expenses:<img src={expenseLogo} alt="" />,
    users:<img src={userLogo} alt="" />,
    transfer:<img src={transferLogo} alt="" />,
    returns:<img src={returnsLogo} alt="" />,
    invoices:<img src={invoicesLogo} alt="" />,
  };
  return (
    <span style={{
      width: 18,
      height: 18,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {icons[name] || '•'}
    </span>
  );
};

const navItems = [
  { label: 'Main', type: 'section' },
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { label: 'Inventory', type: 'section' },
  { id: 'products', label: 'Products', icon: 'products' },
  { id: 'stock-reconciliation', label: 'Stock Reconciliation', icon: 'stock' },
  { id: 'transfer', label: 'Stock Transfer', icon: 'transfer' },
  { label: 'Sales', type: 'section' },
  { id: 'sales', label: 'Sales', icon: 'sales', badge: 3 },
  { id: 'returns', label: 'Sales Returns', icon: 'returns' },
  { id: 'pos', label: 'POS', icon: 'pos' },
  { label: 'Purchases', type: 'section' },
  { id: 'purchase', label: 'Purchase', icon: 'purchase' },
  { id: 'expenses', label: 'Expenses', icon: 'expenses' },
  { label: 'People', type: 'section' },
  { id: 'customers', label: 'Customers', icon: 'customers' },
  { id: 'suppliers', label: 'Suppliers', icon: 'suppliers' },
  { id: 'users', label: 'Users', icon: 'users' },
  { label: 'Analytics', type: 'section' },
  {label: 'Invoices', id: 'invoice', icon: 'invoices'},
  { id: 'reports', label: 'Reports', icon: 'reports' },
  { label: 'System', type: 'section' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

function Sidebar({ activePage, navigate }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon"> 
          <img src={posLogo} alt="POS" />
        </div>
        <div>
          <div className="logo-text">BillSystem</div>
          <div className="logo-sub">POS & Inventory</div>
        </div>
      </div>
      {navItems.map((item, i) => {
        if (item.type === 'section') {
          return <div key={i} className="sidebar-section"><div className="sidebar-section-label">{item.label}</div></div>;
        }
        return (
          <div
            key={item.id}
            className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => navigate(item.id)}
            style={{ marginLeft: 12, marginRight: 12 }}
          >
            <Icon name={item.icon} />
            {item.label}
            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
          </div>
        );
      })}
      <div style={{ height: 20 }} />
    </div>
  );
}

export default Sidebar;