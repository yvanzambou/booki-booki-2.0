const { Pool } = require("pg");

const pool = new Pool({
  database: process.env.POSTGRES_DB || "booki_booki",
  user: process.env.POSTGRES_USER || "booki_user",
  password: process.env.POSTGRES_PASSWORD || "",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

module.exports = pool;