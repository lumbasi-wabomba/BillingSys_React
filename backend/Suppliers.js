import express from "express";
import db from "./db.js";

const router = express.Router();

const allowedFields = ["name", "address", "email", "phone", "speciality", "authorizer"];

const getPayload = (body) => {
  const payload = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }
  });
  // Default optional fields to null if missing
  if (!payload.address) {
    payload.address = null;
  }
  if (!payload.speciality) {
    payload.speciality = null;
  }
  if (!payload.authorizer) {
    payload.authorizer = null;
  }
  return payload;
};

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM suppliers ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM suppliers WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
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
      return res.status(400).json({ error: "No supplier fields provided" });
    }

    const values = Object.values(payload);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");
    const result = await db.query(
      `INSERT INTO suppliers (${fields.join(", ")}) VALUES (${placeholders}) RETURNING *`,
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
      return res.status(400).json({ error: "No supplier fields provided" });
    }

    const assignments = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
    const values = Object.values(payload);
    const result = await db.query(
      `UPDATE suppliers SET ${assignments} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM suppliers WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;