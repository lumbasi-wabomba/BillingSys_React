import express from "express";
import db from "./db.js";

const router = express.Router();

const mapPurchase = (purchase) => ({
  quantity: Number(purchase.quantity),
  total: Number(purchase.totalAmount),
  eDate: purchase.createdAt || null,
  paymentMethod: purchase.paymentMethod || "cash",
  notes: [
    purchase.referenceNumber
      ? `Reference: ${purchase.referenceNumber}`
      : null,
    purchase.currency ? `Currency: ${purchase.currency}` : null,
    purchase.status ? `External status: ${purchase.status}` : null,
    purchase.vendorId ? `External vendor ID: ${purchase.vendorId}` : null,
    purchase.productId ? `External product ID: ${purchase.productId}` : null,
  ]
    .filter(Boolean)
    .join("; ") || null,
  item: purchase.productId || null,
});

router.post("/", async (req, res) => {
  const records = Array.isArray(req.body) ? req.body : req.body?.data;

  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({
      error: "Send purchase data as an array or as { data: [] }.",
    });
  }

  const purchases = records.map(mapPurchase);
  const invalid = purchases
    .map((purchase, index) => {
      const errors = [];

      if (!Number.isInteger(purchase.quantity) || purchase.quantity < 1) {
        errors.push("quantity must be a positive integer");
      }
      if (!Number.isFinite(purchase.total) || purchase.total < 0) {
        errors.push("totalAmount must be a non-negative number");
      }

      return { index, errors };
    })
    .filter((record) => record.errors.length > 0);

  if (invalid.length > 0) {
    return res.status(400).json({
      error: "Some purchase records do not match the database schema.",
      invalid,
    });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");
    const imported = [];

    for (const purchase of purchases) {
      const result = await client.query(
        `INSERT INTO expenses
          (e_date, payment_method, items, total, notes)
         VALUES ($1, $2, $3::jsonb, $4, $5)
         RETURNING *`,
        [
          purchase.eDate,
          purchase.paymentMethod,
          JSON.stringify([
            {
              external_product_id: purchase.item,
              quantity: purchase.quantity,
              total: purchase.total,
            },
          ]),
          purchase.total,
          purchase.notes,
        ]
      );

      imported.push(result.rows[0]);
    }

    await client.query("COMMIT");
    return res.status(201).json({
      message: `${imported.length} purchase(s) imported successfully.`,
      purchases: imported,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
