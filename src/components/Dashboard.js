import React from 'react';
import '../App.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="card">Total Invoices: 100</div>
      <div className="card">Paid: 20</div>
      <div className="card">Pending: 80</div>
    </div>
  );
}

export default Dashboard;