import dotenv from "dotenv";
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

const db =  new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false
});

db.query("SELECT NOW()")
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ Database connection failed:", err.message));

export default db;