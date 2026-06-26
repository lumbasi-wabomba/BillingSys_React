import React from 'react';
import {Link} from 'react-router-dom';
import '../App.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>BillSystem</h2>
      <ul>
        <li>Dashboard</li>
        <li><Link to = "/Invoices" target="_blank" rel="noopener noreferrer">Invoices</Link></li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </div>
  );
}

export default Sidebar;