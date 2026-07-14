import React, { useState } from 'react';
import '../App.css';

const API_BASE_URL = 'http://localhost:3001/api';

export default function AddSupplier({
  supplier = null,
  onSuccess,
  onCancel,
}) {
  const editing = supplier !== null;

  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    address: supplier?.address || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    speciality: supplier?.speciality || '',
    authorizer: supplier?.authorizer || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    if (!formData.name.trim()) {
      setError('Supplier name is required');
      setLoading(false);
      return;
    }

    try {
      const url = editing
        ? `${API_BASE_URL}/suppliers/${supplier.id}`
        : `${API_BASE_URL}/suppliers`;

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
          address: '',
          email: '',
          phone: '',
          speciality: '',
          authorizer: '',
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save supplier.');
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
            {editing ? 'Edit Supplier' : 'Add New Supplier'}
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

            {/* Company Name */}

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Company Name <span style={{ color: '#d64545' }}>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Company name"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Address */}

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Address
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Supplier address"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Email */}

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 600,
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
                placeholder="Supplier email"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Phone */}

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Speciality */}

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Speciality
              </label>

              <input
                type="text"
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                placeholder="Supplier speciality"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Authorizer */}

            <div style={{ marginBottom: '30px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Authorizer
              </label>

              <input
                type="text"
                name="authorizer"
                value={formData.authorizer}
                onChange={handleChange}
                placeholder="Authorizer ID"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: '6px',
                  fontSize: '14px',
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
                  border: '1px solid #ddd',
                  background: '#fff',
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
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? editing
                    ? 'Saving...'
                    : 'Adding...'
                  : editing
                  ? 'Save Changes'
                  : 'Add Supplier'}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}