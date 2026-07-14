import React, { useState, useEffect } from 'react';
import '../App.css';
import AddSupplier from './AddSupplier';

const API_BASE_URL = 'http://localhost:3001/api';

const mapSupplier = (supplier) => ({
  ...supplier,
  products: Number(supplier.products || 0),
  status: supplier.status || 'Active',
});

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/suppliers`)
      .then((res) => res.json())
      .then((data) => {
        const normalized = Array.isArray(data)
          ? data.map(mapSupplier)
          : [];
        setSuppliers(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setSuppliers([]);
        setLoading(false);
      });
  }, []);

  const filtered = suppliers.filter((s) =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.contact || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <h3>Loading suppliers...</h3>;
  }

  return (
    <div>
      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              width: '50%',
              borderRadius: 8,
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
             <AddSupplier
               supplier={selectedSupplier}
               onSuccess={(savedSupplier) => {
 
                 if (selectedSupplier) {
 
                   // Update edited customer
                   setSuppliers((prev) =>
                     prev.map((s) =>
                       s.id === savedSupplier.id
                         ? mapSupplier(savedSupplier)
                         : s
                     )
                   );
 
                 } else {
                   setSuppliers((prev) => [
                     ...prev,
                     mapSupplier(savedSupplier),
                   ]);
 
                 }
 
                 setSelectedSupplier(null);
                 setShowModal(false);
               }}
               onCancel={() => {
                 setSelectedSupplier(null);
                 setShowModal(false);
               }}
             />
          </div>
        </div>
      )}

      {/* Statistics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: 'Total Suppliers',
            value: suppliers.length,
          },
          {
            label: 'Active',
            value: suppliers.filter(
              (s) => s.status === 'Active'
            ).length,
          },
          {
            label: 'Products Supplied',
            value: suppliers.reduce(
              (a, s) => a + Number(s.products || 0),
              0
            ),
          },
        ].map((item, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">
            Supplier List
          </div>

          <div className="table-toolbar">
            <div className="search-box">
              <input
                placeholder="Search by company or contact..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowModal(true)}
            >
              + Add Supplier
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
              <th className="text-center">Products</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {s.name}
                </td>

                <td>{s.contact}</td>

                <td
                  style={{
                    color: '#6b7280',
                    fontSize: 13,
                  }}
                >
                  {s.email}
                </td>

                <td>{s.phone}</td>

                <td
                  className="text-center"
                  style={{ fontWeight: 700 }}
                >
                  {s.products}
                </td>

                <td>
                  <span
                    className={`badge badge-${
                      s.status === 'Active'
                        ? 'success'
                        : 'danger'
                    }`}
                  >
                    {s.status}
                  </span>
                </td>

                <td>
                  <div
                    style={{
                      display: 'flex',
                      gap: 4,
                    }}
                  >
                    <button className="btn btn-outline btn-sm btn-icon">
                      <b>VIEW</b>
                    </button>

                     <button
                      className="btn btn-outline btn-sm btn-icon"
                      onClick={() => {
                        setSelectedSupplier(s);
                        setShowModal(true);
                      }}
                    >
                      <b>EDIT</b>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <div className="pagination-info">
            Showing {filtered.length} of {suppliers.length}{' '}
            suppliers
          </div>
        </div>
      </div>
    </div>
  );
}