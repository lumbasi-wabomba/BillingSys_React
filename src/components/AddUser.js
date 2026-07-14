import React, { useState } from 'react';
import '../App.css';

const API_BASE_URL = 'http://localhost:3001/api';

export default function AddUser({
  user = null,
  onSuccess,
  onCancel,
}) {
  const editing = user !== null;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || '',
    salary: user?.salary || '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'salary' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    if (!formData.name.trim()) {
      setError('User name is required');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        salary: formData.salary === '' ? 0 : formData.salary,
      };

      // Only send password if entered
      if (formData.password.trim() !== '') {
        payload.password = formData.password;
      }

      const url = editing
        ? `${API_BASE_URL}/users/${user.id}`
        : `${API_BASE_URL}/users`;

      const method = editing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
          role: '',
          salary: '',
          password: '',
        });
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save user.');
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
            {editing ? 'Edit User' : 'Add New User'}
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter user name"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: 6,
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: 6,
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: 6,
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Admin / Cashier / Manager"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: 6,
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                Salary
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: 6,
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                Password {editing ? '(Leave blank to keep current password)' : ''}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  editing
                    ? 'Leave blank to keep current password'
                    : 'Enter password'
                }
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e4e8ef',
                  borderRadius: 6,
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
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
                  borderRadius: 6,
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
                  borderRadius: 6,
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
                  : 'Add User'}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}