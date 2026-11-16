const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const app = require("./app");
const pool = require("./config/db");
const initDatabase = require("./db/init");
const PORT = 5000;

let server;

initDatabase()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`Booki-Booki API is running on http://localhost:${PORT}`);
    });
  })
  .catch(async (error) => {
    console.error("Database initialization failed:", error);
    await pool.end();
    process.exit(1);
  });

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);
  if (!server) { await pool.end(); process.exit(0); return; }
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));