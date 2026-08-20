import dotenv from "dotenv";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prefer the workspace root .env, then fall back to backend/.env.
const rootEnvPath = path.resolve(__dirname, "../.env");
const rootEnv = dotenv.config({ path: rootEnvPath });
if (rootEnv.error) {
  dotenv.config();
}

const ssl = process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : false;

const db = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl,
    })
  : new Pool({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
      ssl,
    });

db.query("SELECT NOW()")
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection failed:", err.message));

export default db;