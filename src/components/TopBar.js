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
        <div className="topbar-search">
          <img src={searchIcon} alt=''/>
          <input placeholder="Search..." />
        </div>
        <button className="topbar-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span className="notif-dot"></span>
        </button>
        <button className="topbar-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
        <button className="topbar-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
        </button>
        <div className="topbar-avatar">
          <img src={userIcon} alt=''/>
        </div>
      </div>
    </div>
  );
}

export default TopBar;