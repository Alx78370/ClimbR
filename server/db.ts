// server/db.ts
import pkg from "pg";
const { Pool } = pkg;
const config = useRuntimeConfig();

const pool = new Pool({
  host: config.dbHost,
  port: parseInt(config.dbPort),
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
});

export default pool;
