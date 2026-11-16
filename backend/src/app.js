const express = require("express");
const cors = require("cors");
const booksRoutes = require("./routes/books.routes");
const genresRoutes = require("./routes/genres.routes");
const authRoutes = require("./routes/auth.routes");
const shopRoutes = require("./routes/shop.routes");
const pool = require("./config/db");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ message: "Booki-Booki API is running!" });
});

app.get("/health", async (req, res) => {
  await pool.query("SELECT 1");
  res.status(200).json({ success: true, database: "connected" });
});

app.use("/api/auth", authRoutes);
app.use("/api", shopRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/genres", genresRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Express 5 forwards rejected async controller promises to this middleware.
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = app;