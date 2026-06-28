import React from 'react';
import '../App.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="card">Total Invoices: 120</div>
      <div className="card">Paid: 80</div>
      <div className="card">Pending: 40</div>
    </div>
  );
}

export default Dashboard;