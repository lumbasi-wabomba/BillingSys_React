import express from "express";
import db from "./db.js";

const router = express.Router();

const allowedFields = [
  "e_date",
  "payment_method",
  "mpesa_code",
  "cheque_no",
  "items",
  "total",
  "notes",
  "supplier",
  "product",
  "authorizer",
];

const getPayload = (body) => {
  const payload = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      // Convert items array to JSON string for PostgreSQL
      if (field === "items" && Array.isArray(body[field])) {
        payload[field] = JSON.stringify(body[field]);
      } else {
        payload[field] = body[field];
      }
    }
  });
  // Provide defaults for optional FK fields if missing
  if (!payload.supplier) {
    payload.supplier = null;
  }
  if (!payload.product) {
    payload.product = null;
  }
  if (!payload.authorizer) {
    payload.authorizer = null;
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
      return res.status(404).json({ error: "Expense not found" });
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
      return res.status(400).json({ error: "No expense fields provided" });
    }

    const values = Object.values(payload);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");
    const result = await db.query(
      `INSERT INTO expenses (${fields.join(", ")}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.status(201).json(result.rows[0]);
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
      return res.status(400).json({ error: "No expense fields provided" });
    }

    const assignments = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
    const values = Object.values(payload);
    const result = await db.query(
      `UPDATE expenses SET ${assignments} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
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
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;