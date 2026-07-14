import express from "express";
import db from "./db.js";

const router = express.Router();

const allowedFields = ["customer_id", "supplier_id", "cart", "total", "i_date", "status"];

const getPayload = (body) => {
  const payload = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      // Stringify arrays/objects for JSONB columns (cart)
      if (field === "cart" && typeof body[field] === "object") {
        payload[field] = JSON.stringify(body[field]);
      } else {
        payload[field] = body[field];
      }
    }
  });
  // Default status to 'paid' if not provided
  if (!payload.status) {
    payload.status = 'paid';
  }
  return payload;
};

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM invoices ORDER BY i_date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM invoices WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sale not found" });
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
      return res.status(400).json({ error: "No sale fields provided" });
    }

    const values = Object.values(payload);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");
    const result = await db.query(
      `INSERT INTO invoices (${fields.join(", ")}) VALUES (${placeholders}) RETURNING *`,
      values
    );

    // Update product quantities (decrease stock)
    const invoice = result.rows[0];
    if (invoice.cart && Array.isArray(invoice.cart)) {
      for (const item of invoice.cart) {
        await db.query(
          `UPDATE products SET quantity = GREATEST(0, quantity - $1) WHERE id = $2`,
          [item.quantity, item.id]
        );
      }
    }

    res.status(201).json(invoice);
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
      return res.status(400).json({ error: "No sale fields provided" });
    }

    const assignments = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
    const values = Object.values(payload);
    const result = await db.query(
      `UPDATE invoices SET ${assignments} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sale not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM invoices WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sale not found" });
    }
    res.json({ message: "Sale deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;