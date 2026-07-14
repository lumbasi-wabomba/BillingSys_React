import React, { useState, useEffect } from "react";
import "../App.css";
import AddProduct from "./AddProduct";
import { getProductIcon } from "../utils/iconMapper";

const API_BASE_URL = "http://localhost:3001/api";

const stockColor = (status) =>
  status === "Active"? "success": status === "Low Stock"? "warning": "danger";

const mapProduct = (product) => ({
  ...product,
  purchasePrice: Number(product.bp || 0),
  sellingPrice: Number(product.sp || 0),
  qty: Number(product.quantity || 0),
  minQty: Number(product.minQty || 0),
  warehouse: product.warehouse || "Main Store",
  icon: getProductIcon(product.category),
  status:
    Number(product.quantity || 0) === 0? "Out of Stock": 
    Number(product.quantity || 0) <= Number(product.minQty || 0)? "Low Stock": "Active",
});

export default function Products({ onProductClick }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [warehouseFilter, setWarehouseFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data.map(mapProduct) : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((p) => {
    const matchesCategory =
      catFilter === "All" || p.category === catFilter;

    const matchesWarehouse =
      warehouseFilter === "All" ||
      p.warehouse === warehouseFilter;

    const matchesSearch =
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(search.toLowerCase());

    return (
      matchesCategory &&matchesWarehouse && matchesSearch
    );
  });

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete product");
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting product: " + err.message);
    }
  };

  if (loading) {
    return <h3>Loading products...</h3>;
  }

  return (
    <div>

      {showModal && (
        <div
          style={{position: "fixed",inset: 0,background: "rgba(0,0,0,.5)",display: "flex",justifyContent: "center",alignItems: "center",zIndex: 1000,}}
          onClick={() => { setShowModal(false); setEditingProduct(null); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{width: "55%",maxHeight: "90vh",overflow: "auto",background: "#fff",borderRadius: 8,}}
          >
            <AddProduct
              product={editingProduct}
              onSuccess={(newProduct) => {
                if (editingProduct) {
                  // Update existing product in list
                  setProducts((prev) => prev.map((p) => p.id === newProduct.id ? mapProduct(newProduct) : p));
                } else {
                  // Add new product
                  setProducts((prev) => [...prev, mapProduct(newProduct)]);
                }
                setShowModal(false);
                setEditingProduct(null);
              }}
              onCancel={() => { setShowModal(false); setEditingProduct(null); }}
            />
          </div>
        </div>
      )}

      <div
        style={{display: "grid",gridTemplateColumns: "repeat(4,1fr)",gap: 16,marginBottom: 24,}}
      >
        {[
          {
            label: "Total Products",
            value: products.length,
          },
          {
            label: "Active",
            value: products.filter((p) => p.status === "Active").length,
          },
          {
            label: "Low Stock",
            value: products.filter((p) => p.status === "Low Stock").length,
          },
          {
            label: "Out of Stock",
            value: products.filter((p) => p.status === "Out of Stock").length,
          },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">
            Product List
          </div>

          <div className="table-toolbar">
            <div className="search-box">
              <input
                placeholder="Search by Name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value) }
              />
            </div>

            <select
              className="filter-select"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value) }
            >
              <option value="All"> All Categories </option>

              {[
                ...new Set( products.map((p) => p.category).filter(Boolean) ),
              ].map((c) => ( <option key={c}>{c}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value) }
            >
              <option value="All"> All Warehouses </option>

              {[
                ...new Set(
                  products.map((p) => p.warehouse).filter(Boolean)
                ),
              ].map((w) => (
                <option key={w}>{w}</option>
              ))}
            </select>

            <button
              className="btn btn-outline btn-sm"
              onClick={() =>
                setView(view === "table" ? "grid" : "table")
              }
            >
              {view === "table" ? "Grid": "Table"}
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingProduct(null);
                setShowModal(true);
              }}
            >
              + Add Product
            </button>

          </div>
        </div>
          {view === "table" ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th className="text-right">Purchase Price</th>
                  <th className="text-right">Selling Price</th>
                  <th className="text-center">Qty</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <input type="checkbox" />
                    </td>

                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => onProductClick && onProductClick(p)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <img
                          src={p.icon}
                          alt={p.name}
                          className="table-img"
                          style={{ width: 40, height: 40 }}
                        />

                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 13,
                            }}
                          >
                            {p.name}
                          </div>

                          <div
                            style={{
                              fontSize: 11,
                              color: "#9ca3af",
                            }}
                          >
                            {p.warehouse}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>{p.sku}</td>

                    <td>{p.category}</td>

                    <td>{p.brand}</td>

                    <td className="text-right">
                      {p.purchasePrice}
                    </td>

                    <td
                      className="text-right"
                      style={{ fontWeight: 700 }}
                    >
                      {p.sellingPrice}
                    </td>

                    <td className="text-center">
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            p.qty === 0
                              ? "#ef4444"
                              : p.qty <= p.minQty
                              ? "#f59e0b"
                              : "#10b981",
                        }}
                      >
                        {p.qty}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge badge-${stockColor(p.status)}`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: 4,
                        }}
                      >
                        <button
                          className="btn btn-outline btn-sm btn-icon"
                          onClick={() =>
                            onProductClick && onProductClick(p)
                          }
                        >
                          <b>VIEW</b>
                        </button>

                        <button
                          className="btn btn-outline btn-sm btn-icon"
                          onClick={() => {
                            setEditingProduct(p);
                            setShowModal(true);
                          }}
                        >
                          <b>EDIT</b>
                        </button>

                        <button
                          className="btn btn-outline btn-sm btn-icon"
                          onClick={() => deleteProduct(p.id)}
                        >
                          <b>DELETE</b>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <div className="pagination-info">
                Showing {filtered.length} of {products.length} products
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              padding: 20,
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(220px,1fr))",
              gap: 16,
            }}
          >
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() =>
                  onProductClick && onProductClick(p)
                }
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: 16,
                  cursor: "pointer",
                  background: "var(--bg-white)",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: 15,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={p.icon}
                    alt={p.name}
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                </div>

                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: 5,
                  }}
                >
                  {p.name}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#888",
                    marginBottom: 8,
                  }}
                >
                  {p.sku}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      color: "var(--primary)",
                      fontWeight: 700,
                    }}
                  >
                    {p.sellingPrice}
                  </span>

                  <span
                    className={`badge badge-${stockColor(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 12,
                    fontSize: 12,
                    color: "#6b7280",
                  }}
                >
                  Qty: <b>{p.qty}</b>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}