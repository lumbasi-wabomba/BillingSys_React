import express from "express";
import db from "./db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const records = Array.isArray(req.body) ? req.body : [req.body];
  for (const s of records) {
    if (!s.name || !s.email || !s.phone) {
      return res.status(400).json({ error: "name, email and phone are required." });
    }
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const imported = [];
    for (const s of records) {
      const result = await client.query(
        `INSERT INTO suppliers (name, address, email, phone, speciality)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [s.name, s.market || null, s.email, s.phone, s.category || null]
      );
      imported.push(result.rows[0]);
    }

    await client.query("COMMIT");
    res.status(201).json({
      message: `${imported.length} supplier(s) imported successfully.`,
      suppliers: imported,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;