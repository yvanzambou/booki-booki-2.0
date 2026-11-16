const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

function createToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters.");
  }
  return jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    subject: String(user.id),
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

async function register({ name, email, password }) {
  const normalizedName = String(name || "").trim();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (normalizedName.length < 2 || normalizedName.length > 120) throw Object.assign(new Error("Bitte gib einen Namen mit 2 bis 120 Zeichen ein."), { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 255) throw Object.assign(new Error("Bitte gib eine gültige E-Mail-Adresse ein."), { status: 400 });
  if (typeof password !== "string" || password.length < 8 || password.length > 72) throw Object.assign(new Error("Das Passwort muss zwischen 8 und 72 Zeichen lang sein."), { status: 400 });

  const passwordHash = await bcrypt.hash(password, 12);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [normalizedName, normalizedEmail, passwordHash]
    );
    const user = result.rows[0];
    await client.query("INSERT INTO carts (user_id) VALUES ($1)", [user.id]);
    await client.query("INSERT INTO payment_profiles (user_id) VALUES ($1)", [user.id]);
    await client.query("COMMIT");
    return { user: publicUser(user), token: createToken(user) };
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") throw Object.assign(new Error("Für diese E-Mail-Adresse existiert bereits ein Konto."), { status: 409 });
    throw error;
  } finally { client.release(); }
}

async function login({ email, password }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const result = await pool.query("SELECT id, name, email, password_hash FROM users WHERE email = $1", [normalizedEmail]);
  const user = result.rows[0];
  if (!user || typeof password !== "string" || !(await bcrypt.compare(password, user.password_hash))) {
    throw Object.assign(new Error("E-Mail-Adresse oder Passwort ist falsch."), { status: 401 });
  }
  return { user: publicUser(user), token: createToken(user) };
}

async function getUserById(id) {
  const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
}

module.exports = { register, login, getUserById };