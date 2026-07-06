import React, { useState } from 'react';
import '../App.css';

const customers = [
  { id: 1, name: 'Bob Smith', email: 'bob.smith@email.com', phone: '0712 345 678', orders: 24, totalSpent: 'KSh 84,500', status: 'Active' },
  { id: 2, name: 'Carol Lloyd', email: 'carol.lloyd@email.com', phone: '0723 456 789', orders: 12, totalSpent: 'KSh 41,200', status: 'Active' },
  { id: 3, name: 'Evelyn Wangi', email: 'evelyn.wangi@email.com', phone: '0734 567 890', orders: 8, totalSpent: 'KSh 22,800', status: 'Active' },
  { id: 4, name: 'Everett Brown', email: 'everett.brown@email.com', phone: '0745 678 901', orders: 3, totalSpent: 'KSh 9,600', status: 'Inactive' },
  { id: 5, name: 'Lombardo Reyes', email: 'lombardo.reyes@email.com', phone: '0756 789 012', orders: 17, totalSpent: 'KSh 58,300', status: 'Active' },
];

export default function Customers() {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Customers', value: customers.length },
          { label: 'Active', value: customers.filter(c => c.status === 'Active').length },
          { label: 'Inactive', value: customers.filter(c => c.status === 'Inactive').length },
          { label: 'Total Orders', value: customers.reduce((a, c) => a + c.orders, 0) },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">Customer List</div>
          <div className="table-toolbar">
            <div className="search-box">
              <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm">+ Add Customer</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th>
              <th className="text-center">Orders</th>
              <th className="text-right">Total Spent</th>
              <th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{c.email}</td>
                <td style={{ fontSize: 13 }}>{c.phone}</td>
                <td className="text-center" style={{ fontWeight: 700 }}>{c.orders}</td>
                <td className="text-right" style={{ fontWeight: 700 }}>{c.totalSpent}</td>
                <td><span className={`badge badge-${c.status === 'Active' ? 'success' : 'danger'}`}>{c.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-outline btn-sm btn-icon"><b>VIEW</b></button>
                    <button className="btn btn-outline btn-sm btn-icon"><b>EDIT</b></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <div className="pagination-info">Showing {filtered.length} of {customers.length} customers</div>
        </div>
      </div>
    </div>
  );
}