import React from 'react';
import '../App.css';
import searchIcon from '../icons/search.png';
import userIcon from '../icons/user.png';

const pageTitles = {
  dashboard: 'Dashboard',
  products: 'Products',
  'product-detail': 'Product Detail',
  'stock-reconciliation': 'Stock Reconciliation',
  reports: 'Reports',
  sales: 'Sales',
  purchase: 'Purchase',
  customers: 'Customers',
  suppliers: 'Suppliers',
  users: 'Users',
  settings: 'Settings',
  pos: 'Point of Sale',
  expenses: 'Expenses',
  returns: 'Sales Returns',
  transfer: 'Stock Transfer',
};

function TopBar({ activePage }) {
  const title = pageTitles[activePage] || 'Dashboard';
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">{title}</div>
        <div className="topbar-breadcrumb">Home / {title}</div>
      </div>
      <div className="topbar-right">
        <span>Welcome, Wayne</span>
      </div>
    </div>
  );
}

export default TopBar;