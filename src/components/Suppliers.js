import React, { useState } from 'react';
import '../App.css';
import AddSupplier from './AddSupplier';

const suppliers = [
  { id: 1, name: 'TechDistribute Ltd', contact: 'James Otieno', email: 'james@techdist.co.ke', phone: '0711 222 333', products: 42, status: 'Active' },
  { id: 2, name: 'Accessory World Kenya', contact: 'Nancy Mwikali', email: 'nancy@accworld.co.ke', phone: '0722 333 444', products: 28, status: 'Active' },
  { id: 3, name: 'Global Gadgets Supply', contact: 'Peter Kamau', email: 'peter@globalgadgets.com', phone: '0733 444 555', products: 15, status: 'Inactive' },
];

export default function Suppliers() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.contact.toLowerCase().includes(search.toLowerCase())
  );

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
            <AddSupplier
              onSuccess={(newSupplier) => {
                setShowModal(false);
              }}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Suppliers', value: suppliers.length },
          { label: 'Active', value: suppliers.filter(s => s.status === 'Active').length },
          { label: 'Products Supplied', value: suppliers.reduce((a, s) => a + s.products, 0) },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">Supplier List</div>
          <div className="table-toolbar">
            <div className="search-box">
              <input placeholder="Search by name or contact..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Supplier</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Company</th><th>Contact Person</th><th>Email</th><th>Phone</th>
              <th className="text-center">Products</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</td>
                <td style={{ fontSize: 13 }}>{s.contact}</td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{s.email}</td>
                <td style={{ fontSize: 13 }}>{s.phone}</td>
                <td className="text-center" style={{ fontWeight: 700 }}>{s.products}</td>
                <td><span className={`badge badge-${s.status === 'Active' ? 'success' : 'danger'}`}>{s.status}</span></td>
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
          <div className="pagination-info">Showing {filtered.length} of {suppliers.length} suppliers</div>
        </div>
      </div>
    </div>
  );
}