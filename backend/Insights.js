import express from "express";
import db from "./db.js";

const router = express.Router();

const allowedFields = ["product_id", "viewed_at"];

const getPayload = (body) => {
  const payload = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }
  });
  return payload;
};

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM insights ORDER BY viewed_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const payload = getPayload(req.body);
  try {
    const result = await db.query(
      "INSERT INTO insights (product_id, viewed_at) VALUES ($1, $2) RETURNING *",
      [payload.product_id, payload.viewed_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;