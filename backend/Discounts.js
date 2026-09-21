import express from "express";
import db from "./db.js";

const router = express.Router();

const allowedFields = ["product_id", "amount", "start_date", "end_date"];

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
    const result = await db.query("SELECT * FROM discounts ORDER BY start_date DESC");
    res.json(result.rows);
    res.status(200).json({ message: "list of discounts retrieved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const payload = getPayload(req.body);
  try {
    const result = await db.query(
      "INSERT INTO discounts (product_id, amount, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [payload.product_id, payload.amount, payload.start_date, payload.end_date]
    );
    res.status(201).json(result.rows[0]);
    res.status(201).json({ message: "discount created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:product_id", async (req, res) => {
  const payload = getPayload(req.body);
  const fields = Object.keys(payload);
  if (fields.length === 0) {
    return res.status(400).json({ error: "invalid input, no valid fields provided for update" });
  }

  const assignments = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
  const values = Object.values(payload);

  try {
    const result = await db.query(
      `UPDATE discounts SET ${assignments} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Discount not found" });
    }
    res.json(result.rows[0]);
    res.status(200).json({ message: "discount updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}); 

export default router; 