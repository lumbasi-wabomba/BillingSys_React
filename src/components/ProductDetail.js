
import React from "react";
import "../App.css";

const formatCurrency = (value) =>
  `KSh ${Number(value || 0).toLocaleString()}`;

const stockColor = (status) =>
  status === "Active"
    ? "success"
    : status === "Low Stock"
    ? "warning"
    : "danger";

export default function ProductDetail({
  product,
  onBack,
  onEdit,
  onDelete,
}) {
  if (!product) {
    return (
      <div className="table-card">
        <h3>No product selected.</h3>
      </div>
    );
  }

  return (
    <div className="table-card">

      <div
        className="table-card-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="table-card-title">
          Product Details
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={onBack}
          >
            ← Back
          </button>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => onEdit(product)}
          >
            Edit
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(product.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div style={{ padding: 25 }}>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr",
            gap: 30,
          }}
        >
          {/* Product Icon */}
          <div
            style={{
              background: "#f3f4f6",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 90,
              height: 180,
            }}
          >
            {product.icon || "📦"}
          </div>

          {/* Product Information */}
          <div>

            <h2 style={{ marginBottom: 5 }}>
              {product.name}
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginBottom: 20,
              }}
            >
              SKU: <b>{product.sku}</b>
            </p>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <tbody>

                <tr>
                  <td><b>Category</b></td>
                  <td>{product.category}</td>
                </tr>

                <tr>
                  <td><b>Brand</b></td>
                  <td>{product.brand}</td>
                </tr>

                <tr>
                  <td><b>Unit</b></td>
                  <td>{product.unit}</td>
                </tr>

                <tr>
                  <td><b>Warehouse</b></td>
                  <td>{product.warehouse}</td>
                </tr>

                <tr>
                  <td><b>Purchase Price</b></td>
                  <td>
                    {formatCurrency(
                      product.purchase_price ??
                      product.purchasePrice
                    )}
                  </td>
                </tr>

                <tr>
                  <td><b>Selling Price</b></td>
                  <td>
                    {formatCurrency(
                      product.selling_price ??
                      product.sellingPrice
                    )}
                  </td>
                </tr>

                <tr>
                  <td><b>Quantity</b></td>
                  <td>{product.qty ?? product.quantity}</td>
                </tr>

                <tr>
                  <td><b>Minimum Quantity</b></td>
                  <td>{product.minQty ?? product.min_quantity}</td>
                </tr>

                <tr>
                  <td><b>Status</b></td>
                  <td>
                    <span
                      className={`badge badge-${stockColor(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td><b>Sold</b></td>
                  <td>{product.sold || 0}</td>
                </tr>

                <tr>
                  <td><b>Description</b></td>
                  <td>
                    {product.description || "-"}
                  </td>
                </tr>

              </tbody>
            </table>

          </div>
        </div>

      </div>
    </div>
  );
}