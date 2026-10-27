import React, { useState } from 'react';
import '../App.css';

const API_BASE_URL = 'http://localhost:3001/api';
api_key = process.env.BACKEND_API_KEY ;

export default function AddCustomer({
  customer = null,
  onSuccess,
  onCancel,
}) {
  const editing = customer !== null;

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    no_of_orders: customer?.no_of_orders || 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "no_of_orders" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    if (!formData.name.trim()) {
      setError('Customer name is required');
      setLoading(false);
      return;
    }

    try {
      const url = editing
        ? `${API_BASE_URL}/customers/${customer.id}`
        : `${API_BASE_URL}/customers`;

      const method = editing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Operation failed');
      }

      if (onSuccess) {
        onSuccess(data);
      }

      if (!editing) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          no_of_orders: 0,
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="table-card"
        style={{
          maxWidth: '600px',
          width: '100%',
        }}
      >
        <div className="table-card-header">
          <div className="table-card-title">
            {editing ? 'Edit Customer' : 'Add New Customer'}
          </div>
        </div>

        <div style={{ padding: '30px' }}>
          {error && (
            <div
              style={{
                background: '#fdecec',
                color: '#d64545',
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                Customer Name <span style={{ color: '#d64545' }}>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter customer email"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Orders */}
            <div style={{ marginBottom: '30px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                Number of Orders
              </label>

              <input
                type="number"
                name="no_of_orders"
                value={formData.no_of_orders}
                onChange={handleChange}
                min="0"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 24px',
                  background: '#1f4e79',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading
                  ? editing
                    ? 'Saving...'
                    : 'Adding...'
                  : editing
                  ? 'Save Changes'
                  : 'Add Customer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}