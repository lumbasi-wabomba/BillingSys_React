import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>BillSystem</h2>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/invoice">Invoices</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;