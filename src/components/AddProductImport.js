import React, { useState, useEffect } from "react";
import "../App.css";

const API_BASE_URL = "http://localhost:3001/api";
const api_key = process.env.REACT_APP_BACKEND_API_KEY;
const backend_headers = {
  "x-api-key": `${api_key}`,
  "Content-Type": "application/json"
};

export default function AddProductImport({ onProductSelect, onCancel }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Calls the /products endpoint defined in backend/ApiCalls.js,
    // which fetches the product list from the external Thriftly API.
    fetch(`${API_BASE_URL}/external/products`, {
      headers: backend_headers,
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.products || [];
        setProducts(Array.isArray(list) ? list : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load products from Thriftly.");
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((p) => {
    const term = search.toLowerCase().trim();
    return (
      (p.name || "").toLowerCase().includes(term) ||
      (p.category || "").toLowerCase().includes(term)
    );
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1100,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "70%",
          maxWidth: 900,
          borderRadius: 8,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <div className="table-card-header">
          <div className="table-card-title">
            Import Product
          </div>
        </div>

        <div style={{ padding: "20px" }}>
          {error && (
            <div
              style={{
                background: "#fdecec",
                color: "#d64545",
                padding: "12px 16px",
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
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div className="search-box" style={{ flex: 1 }}>
              <input
                placeholder="Search products by name or category..."
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
            <h3>Loading products...</h3>
          ) : filtered.length === 0 ? (
            <p style={{ color: "#6b7280", padding: "20px 0" }}>
              No products found.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th className="text-right">Buying Price</th>
                  <th className="text-right">Qty Available</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id || p.name}>
                    <td
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {p.name}
                    </td>
                    <td>{p.category || "—"}</td>
                    <td className="text-right">
                      {p.price != null
                        ? `${p.price} ${p.currency || ""}`.trim()
                        : "—"}
                    </td>
                    <td className="text-right">
                      {p.quantityAvailable ?? "—"}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onProductSelect(p)}
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
              Showing {filtered.length} of {products.length} products
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
