import React, { useState } from 'react';
import '../App.css';

const users = [
  { id: 1, name: 'Wayne Mwangi', email: 'wayne@billsystem.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Grace Achieng', email: 'grace@billsystem.com', role: 'Cashier', status: 'Active' },
  { id: 3, name: 'Daniel Kiplagat', email: 'daniel@billsystem.com', role: 'Manager', status: 'Active' },
];

export default function Users() {
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Users', value: users.length },
          { label: 'Active', value: users.filter(u => u.status === 'Active').length },
          { label: 'Admins', value: users.filter(u => u.role === 'Admin').length },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">User List</div>
          <div className="table-toolbar">
            <div className="search-box">
              <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm">+ Add User</button>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{u.email}</td>
                <td style={{ fontSize: 13 }}>{u.role}</td>
                <td><span className={`badge badge-${u.status === 'Active' ? 'success' : 'danger'}`}>{u.status}</span></td>
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
          <div className="pagination-info">Showing {filtered.length} of {users.length} users</div>
        </div>
      </div>
    </div>
  );
}