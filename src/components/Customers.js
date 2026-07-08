import React, { useState, useEffect } from 'react';
import '../App.css';
import AddCustomer from './AddCustomer';

const API_BASE_URL = 'http://localhost:3001';

const formatCurrency = (value) => `KSh ${Number(value || 0).toLocaleString()}`;

const mapCustomer = (customer) => ({
  ...customer,
  orders: Number(customer.no_of_orders || 0),
  totalSpent: formatCurrency((customer.no_of_orders || 0) * 3500),
  status: (customer.no_of_orders || 0) > 0 ? 'Active' : 'Inactive',
});

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/customers`)
      .then((res) => res.json())
      .then((data) => {
        const normalized = Array.isArray(data) ? data.map(mapCustomer) : [];
        setCustomers(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setCustomers([]);
        setLoading(false);
      });
  }, []);

  const filtered = customers.filter((c) =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <h3>Loading customers...</h3>;
  }


  return (
    <div>
      {/* Modal Overlay */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              width: '50%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <AddCustomer
              onSuccess={(newCustomer) => {
                setCustomers((prev) => [...prev, mapCustomer(newCustomer)]);
                setShowModal(false);
              }}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">Customer List</div>
          <div className="table-toolbar">
            <div className="search-box">
              <input placeholder="Search by phone or email..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Customer</button>
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