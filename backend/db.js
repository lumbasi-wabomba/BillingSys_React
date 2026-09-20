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

const db = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      // Stop waiting after a while so the server does not hang forever
      // if the database is down or the network is blocking it.
      connectionTimeoutMillis: 10000,
    })
  : new Pool({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
      ssl,
      connectionTimeoutMillis: 10000,
    });

// Quick connection test when the backend starts. This way we find out
// early if the database is not reachable, instead of only seeing errors
// when the first request comes in.
db.query("SELECT NOW()")
  .then(() => console.log("Database connected"))
  .catch((err) =>
    console.error(
      "Database connection failed:",
      err && err.message ? err.message : "Could not reach the database."
    )
  );

export default db;