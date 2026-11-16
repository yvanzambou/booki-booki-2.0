const pool = require("../config/db");

async function getAllGenres() {
  const result = await pool.query(`
    SELECT id, name
    FROM genres
    ORDER BY name ASC
  `);
  return result.rows;
}

async function getGenreById(id) {
  const result = await pool.query(
    "SELECT id, name FROM genres WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
}

module.exports = {
  getAllGenres,
  getGenreById,
};