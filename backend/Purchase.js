import express from "express";
import db from "./db.js";

const router = express.Router();
const allowedFields = [
  "supplier",
  "payment_method",
  "cheque_no",
  "mpesa_code",
//   "authorizer",
  "product",
  "items",
  "total",
  "notes",
];

const getPayload = (body) => {
  const payload = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      if (field === "items" && Array.isArray(body[field])) {
        payload[field] = JSON.stringify(body[field]);
      } else {
        payload[field] = body[field];
      }
    }
  });
  // Default optional fields
  if (!payload.cheque_no) {
    payload.cheque_no = null;
  }
  if (!payload.mpesa_code) {
    payload.mpesa_code = null;
  }
//   if (!payload.authorizer) {
//     payload.authorizer = null;
//   }
  if (!payload.notes) {
    payload.notes = null;
  }
  return payload;
};

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM expenses ORDER BY e_date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM expenses WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Purchase not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const payload = getPayload(req.body);
    const fields = Object.keys(payload);
    if (fields.length === 0) {
      return res.status(400).json({ error: "No purchase fields provided" });
    }

    const values = Object.values(payload);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");
    const result = await db.query(
      `INSERT INTO expenses (${fields.join(", ")}) VALUES (${placeholders}) RETURNING *`,
      values
    );

    const purchase = result.rows[0];

    // Increase product quantities for purchased items
    if (purchase.items && Array.isArray(purchase.items)) {
      for (const item of purchase.items) {
        if (item.product_id && item.quantity) {
          await db.query(
            `UPDATE products SET quantity = quantity + $1 WHERE id = $2`,
            [item.quantity, item.product_id]
          );
        }
      }
    }

    res.status(201).json(purchase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const payload = getPayload(req.body);
    const fields = Object.keys(payload);
    if (fields.length === 0) {
      return res.status(400).json({ error: "No purchase fields provided" });
    }

    const assignments = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
    const values = Object.values(payload);
    const result = await db.query(
      `UPDATE expenses SET ${assignments} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM expenses WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Purchase not found" });
    }
    res.json({ message: "Purchase deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;