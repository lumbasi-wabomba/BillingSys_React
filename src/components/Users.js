import React, { useState, useEffect } from 'react';
import '../App.css';
import AddUser from './AddUser';

const API_BASE_URL = 'http://localhost:3001/api';

const formatCurrency = (value) =>
  `KSh ${Number(value || 0).toLocaleString()}`;

const mapUser = (user) => ({
  ...user,
  role: user.role || 'User',
  salary: formatCurrency(user.salary || 0),
  status: user.status || 'Active',
});

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch(`${API_BASE_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        const normalized = Array.isArray(data)
          ? data.map(mapUser)
          : [];
        setUsers(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setUsers([]);
        setLoading(false);
      });
  };

  const filtered = users.filter(
    (u) =>
      (u.name || '')
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (u.email || '')
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return <h3>Loading users...</h3>;
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
          onClick={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '50%',
              maxHeight: '90vh',
              overflow: 'auto',
              background: '#fff',
              borderRadius: 8,
            }}
          >
            <AddUser
              user={editingUser}
              onSuccess={(savedUser) => {

                if (editingUser) {
                  setUsers((prev) =>
                    prev.map((u) =>
                      u.id === savedUser.id
                        ? mapUser(savedUser)
                        : u
                    )
                  );
                } else {
                  setUsers((prev) => [
                    ...prev,
                    mapUser(savedUser),
                  ]);
                }

                setEditingUser(null);
                setShowModal(false);
              }}
              onCancel={() => {
                setEditingUser(null);
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
            label: 'Total Users',
            value: users.length,
          },
          {
            label: 'Active',
            value: users.filter(
              (u) => u.status === 'Active'
            ).length,
          },
          {
            label: 'Admins',
            value: users.filter(
              (u) =>
                (u.role || '').toLowerCase() === 'admin'
            ).length,
          },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-value">
              {s.value}
            </div>
            <div className="stat-label">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}

      <div className="table-card">

        <div className="table-card-header">

          <div className="table-card-title">
            User List
          </div>

          <div className="table-toolbar">

            <div className="search-box">
              <input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingUser(null);
                setShowModal(true);
              }}
            >
              + Add User
            </button>

          </div>

        </div>

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th className="text-right">
                Salary
              </th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((u) => (

              <tr key={u.id}>

                <td
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {u.name}
                </td>

                <td
                  style={{
                    color: '#6b7280',
                    fontSize: 13,
                  }}
                >
                  {u.email}
                </td>

                <td>{u.phone}</td>

                <td>{u.role}</td>

                <td className="text-right">
                  {u.salary}
                </td>

                <td>
                  <span
                    className={`badge badge-${
                      u.status === 'Active'
                        ? 'success'
                        : 'danger'
                    }`}
                  >
                    {u.status}
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
                        setEditingUser(u);
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
            Showing {filtered.length} of {users.length} users
          </div>
        </div>

      </div>
    </div>
  );
}