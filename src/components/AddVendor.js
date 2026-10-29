import React, { useState, useEffect } from 'react';
import '../App.css';

const API_BASE_URL = 'http://localhost:3001/api';
const api_key = process.env.REACT_APP_BACKEND_API_KEY;
const backend_headers = {
  "x-api-key": `${api_key}`,
  "Content-Type": "application/json"
};

export default function AddVendor({ onVendorSelect, onCancel }) {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Calls the /vendors endpoint defined in backend/ApiCalls.js,
    // which fetches the vendor list from the external Thriftly API.
    fetch(`${API_BASE_URL}/external/vendors`, {
      headers: backend_headers,
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.vendors || [];
        setVendors(Array.isArray(list) ? list : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load vendors from Thriftly.');
        setLoading(false);
      });
  }, []);

  const filtered = vendors.filter((v) => {
    const term = search.toLowerCase().trim();
    return (
      (v.name || '').toLowerCase().includes(term) ||
      (v.market || '').toLowerCase().includes(term) ||
      (v.category || '').toLowerCase().includes(term)
    );
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1100,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          width: '70%',
          maxWidth: 900,
          borderRadius: 8,
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <div className="table-card-header">
          <div className="table-card-title">
            Import Vendor
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          {error && (
            <div
              style={{
                background: '#fdecec',
                color: '#d64545',
                padding: '12px 16px',
                borderRadius: 6,
                marginBottom: 20,
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <div className="search-box" style={{ flex: 1 }}>
              <input
                placeholder="Search vendors by name, market or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>

          {loading ? (
            <h3>Loading vendors...</h3>
          ) : filtered.length === 0 ? (
            <p style={{ color: '#6b7280', padding: '20px 0' }}>
              No vendors found.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Market</th>
                  <th>Category</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id || v.name}>
                    <td
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {v.name}
                    </td>
                    <td>{v.market || '—'}</td>
                    <td>{v.category || '—'}</td>
                    <td>{v.phone || '—'}</td>
                    <td
                      style={{
                        color: '#6b7280',
                        fontSize: 13,
                      }}
                    >
                      {v.email || '—'}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onVendorSelect(v)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="pagination">
            <div className="pagination-info">
              Showing {filtered.length} of {vendors.length} vendors
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
