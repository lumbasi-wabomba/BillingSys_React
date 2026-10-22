import express from "express";
import db from "./db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const records = Array.isArray(req.body) ? req.body : req.body?.data;
  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ error: "Send purchase data as an array or as { data: [] }." });
  }

  for (const p of records) {
    const quantity = Number(p.quantity);
    const total = Number(p.totalAmount);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: "quantity must be a positive integer." });
    }
    if (!Number.isFinite(total) || total < 0) {
      return res.status(400).json({ error: "totalAmount must be a non-negative number." });
    }
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const imported = [];

    for (const p of records) {
      const noteParts = [];
      if (p.referenceNumber) noteParts.push(`Reference: ${p.referenceNumber}`);
      if (p.currency) noteParts.push(`Currency: ${p.currency}`);
      if (p.status) noteParts.push(`External status: ${p.status}`);
      if (p.vendorId) noteParts.push(`External vendor ID: ${p.vendorId}`);
      if (p.productId) noteParts.push(`External product ID: ${p.productId}`);
      const notes = noteParts.join("; ") || null;

      const items = [
        {
          external_product_id: p.productId || null,
          quantity: Number(p.quantity),
          total: Number(p.totalAmount),
        },
      ];

      const result = await client.query(
        `INSERT INTO expenses (e_date, payment_method, items, total, notes)
         VALUES ($1, $2, $3::jsonb, $4, $5)
         RETURNING *`,
        [
          p.createdAt || null,
          p.paymentMethod || "cash",
          JSON.stringify(items),
          Number(p.totalAmount),
          notes,
        ]
      );
      imported.push(result.rows[0]);
    }

    await client.query("COMMIT");
    res.status(201).json({
      message: `${imported.length} purchase(s) imported successfully.`,
      purchases: imported,
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