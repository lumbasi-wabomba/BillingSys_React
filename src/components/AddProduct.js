import React, { useState } from "react";
import "../App.css";

const API_BASE_URL = "http://localhost:3001/api";

export default function AddProduct({ onSuccess, onCancel, product = null }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    category: product?.category || "",
    brand: product?.brand || "",
    unit: product?.unit || "",
    bp: product?.bp || "",
    sp: product?.sp || "",
    quantity: product?.quantity || "",
    minQty: product?.minQty || "",
    warehouse: product?.warehouse || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        [
          "bp",
          "sp",
          "quantity",
          "minQty",
        ].includes(name)
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (!formData.name.trim()) {
      setError("Product name is required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        product
          ? `${API_BASE_URL}/products/${product.id}`
          : `${API_BASE_URL}/products`,
        {
          method: product ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      if (onSuccess) onSuccess(data);

      setFormData({
        name: "",
        sku: "",
        category: "",
        brand: "",
        unit: "",
        bp: "",
        sp: "",
        quantity: "",
        minQty: "",
        warehouse: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e4e8ef",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="table-card"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <div className="table-card-header">
          <div className="table-card-title">
            {product ? "Edit Product" : "Add New Product"}
          </div>
        </div>

        <div style={{ padding: "30px" }}>
          {error && (
            <div
              style={{
                background: "#fdecec",
                color: "#d64545",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: 20 }}>
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>Purchase Price</label>
              <input
                type="number"
                name="bp"
                value={formData.bp}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>Selling Price</label>
              <input
                type="number"
                name="sp"
                value={formData.sp}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>Minimum Quantity</label>
              <input
                type="number"
                name="minQty"
                value={formData.minQty}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 30 }}>
              <label>Warehouse</label>
              <input
                type="text"
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 24px",
                  background: "#1f4e79",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {loading
                  ? product
                    ? "Updating..."
                    : "Adding..."
                  : product
                  ? "Update Product"
                  : "Add Product"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}