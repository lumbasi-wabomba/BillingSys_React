import React, { useState, useEffect } from 'react';
import '../App.css';
import AddCustomer from './AddCustomer';

const API_BASE_URL = 'http://localhost:3001/api';

const formatCurrency = (value) =>
  `KSh ${Number(value || 0).toLocaleString()}`;

const mapCustomer = (customer) => ({
  ...customer,
  orders: Number(customer.no_of_orders || 0),
  totalSpent: formatCurrency((customer.no_of_orders || 0) * 3500),
  status: Number(customer.no_of_orders || 0) > 0 ? 'Active' : 'Inactive',
});

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const loadCustomers = () => {
    fetch(`${API_BASE_URL}/customers`)
      .then((res) => res.json())
      .then((data) => {
        const normalized = Array.isArray(data)
          ? data.map(mapCustomer)
          : [];

        setCustomers(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setCustomers([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filtered = customers.filter((c) =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <h3>Loading customers...</h3>;
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
            zIndex: 999,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              width: '50%',
              maxHeight: '90vh',
              overflow: 'auto',
              borderRadius: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AddCustomer
              customer={selectedCustomer}
              onSuccess={(savedCustomer) => {

                if (selectedCustomer) {

                  // Update edited customer
                  setCustomers((prev) =>
                    prev.map((c) =>
                      c.id === savedCustomer.id
                        ? mapCustomer(savedCustomer)
                        : c
                    )
                  );

                } else {

                  // Add new customer
                  setCustomers((prev) => [
                    ...prev,
                    mapCustomer(savedCustomer),
                  ]);

                }

                setSelectedCustomer(null);
                setShowModal(false);
              }}
              onCancel={() => {
                setSelectedCustomer(null);
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
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: 'Total Customers',
            value: customers.length,
          },
          {
            label: 'Active',
            value: customers.filter(
              (c) => c.status === 'Active'
            ).length,
          },
          {
            label: 'Inactive',
            value: customers.filter(
              (c) => c.status === 'Inactive'
            ).length,
          },
          {
            label: 'Total Orders',
            value: customers.reduce(
              (sum, c) => sum + c.orders,
              0
            ),
          },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">
            Customer List
          </div>

          <div className="table-toolbar">
            <div className="search-box">
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setSelectedCustomer(null);
                setShowModal(true);
              }}
            >
              + Add Customer
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th className="text-center">Orders</th>
              <th className="text-right">
                Total Spent
              </th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {c.name}
                </td>

                <td
                  style={{
                    fontSize: 13,
                    color: '#6b7280',
                  }}
                >
                  {c.email}
                </td>

                <td>{c.phone}</td>

                <td
                  className="text-center"
                  style={{ fontWeight: 700 }}
                >
                  {c.orders}
                </td>

                <td
                  className="text-right"
                  style={{ fontWeight: 700 }}
                >
                  {c.totalSpent}
                </td>

                <td>
                  <span
                    className={`badge badge-${
                      c.status === 'Active'
                        ? 'success'
                        : 'danger'
                    }`}
                  >
                    {c.status}
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
                        setSelectedCustomer(c);
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
            Showing {filtered.length} of{' '}
            {customers.length} customers
          </div>
        </div>
      </div>
    </div>
  );
}