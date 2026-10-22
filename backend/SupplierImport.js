import express from "express";
import db from "./db.js";

const router = express.Router();

const mapSupplier = (supplier) => ({
  name: String(supplier.name || "").trim(),
  address: String(supplier.market || "").trim() || null,
  email: String(supplier.email || "").trim(),
  phone: String(supplier.phone || "").trim(),
  speciality: String(supplier.category || "").trim() || null,
});

const fieldLimits = {
  name: 100,
  address: 50,
  email: 50,
  phone: 20,
  speciality: 50,
};

router.post("/", async (req, res) => {
  const records = Array.isArray(req.body)
    ? req.body
    : Array.isArray(req.body?.data)
      ? req.body.data
      : req.body && typeof req.body === "object"
        ? [req.body]
        : null;

  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({
      error: "Send a supplier info in correct format .",
    });
  }

  const suppliers = records.map(mapSupplier);
  const invalid = suppliers
    .map((supplier, index) => {
      const missing = ["name", "email", "phone"].filter(
        (field) => !supplier[field]
      );
      const tooLong = Object.entries(fieldLimits)
        .filter(([field, limit]) => supplier[field]?.length > limit)
        .map(([field, limit]) => `${field} (max ${limit} characters)`);

      return { index, missing, tooLong };
    })
    .filter((record) => record.missing.length > 0 || record.tooLong.length > 0);

  if (invalid.length > 0) {
    return res.status(400).json({
      error: "Some supplier records do not match the supplier schema.",
      invalid,
    });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const imported = [];
    for (const supplier of suppliers) {
      const result = await client.query(
        `INSERT INTO suppliers
          (name, address, email, phone, speciality)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          supplier.name,
          supplier.address,
          supplier.email,
          supplier.phone,
          supplier.speciality,
        ]
      );
      imported.push(result.rows[0]);
    }

    await client.query("COMMIT");
    return res.status(201).json({
      message: `${imported.length} supplier(s) imported successfully.`,
      suppliers: imported,
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
