const pool = require("../config/db");

const BOOK_SELECT = `
  SELECT
    b.id,
    b.source_id AS "bookId",
    b.title,
    b.author,
    b.rating,
    b.description,
    b.language,
    b.isbn,
    COALESCE(
      json_agg(g.name ORDER BY g.name) FILTER (WHERE g.id IS NOT NULL),
      '[]'::json
    ) AS genres,
    b.book_format AS "bookFormat",
    b.edition,
    b.pages,
    b.publisher,
    b.publish_date AS "publishDate",
    b.first_publish_date AS "firstPublishDate",
    b.num_ratings AS "numRatings",
    b.cover_img AS "coverImg",
    b.price
  FROM books b
  LEFT JOIN book_genres bg ON bg.book_id = b.id
  LEFT JOIN genres g ON g.id = bg.genre_id
`;

function normalizeBook(book) {
  if (!book) return null;
  return {
    ...book,
    price: book.price === null ? null : Number(book.price),
  };
}

async function getAllBooks() {
  const result = await pool.query(
    `${BOOK_SELECT} GROUP BY b.id ORDER BY b.id`
  );
  return result.rows.map(normalizeBook);
}

async function getBookById(id) {
  const result = await pool.query(
    `${BOOK_SELECT} WHERE b.id = $1 GROUP BY b.id`,
    [id]
  );
  return normalizeBook(result.rows[0]);
}

async function getPaginatedBooks(page, limit) {
  const offset = (page - 1) * limit;
  const [booksResult, countResult] = await Promise.all([
    pool.query(
      `${BOOK_SELECT} GROUP BY b.id ORDER BY b.id LIMIT $1 OFFSET $2`,
      [limit, offset]
    ),
    pool.query("SELECT COUNT(*)::int AS total FROM books"),
  ]);

  return {
    books: booksResult.rows.map(normalizeBook),
    totalItems: countResult.rows[0].total,
  };
}

async function searchBooksPaginated(query, page, limit) {
  const offset = (page - 1) * limit;
  const searchPattern = `%${query}%`;
  const where = "WHERE b.title ILIKE $1 OR b.author ILIKE $1";

  const [booksResult, countResult] = await Promise.all([
    pool.query(
      `${BOOK_SELECT} ${where} GROUP BY b.id ORDER BY b.id LIMIT $2 OFFSET $3`,
      [searchPattern, limit, offset]
    ),
    pool.query(
      `SELECT COUNT(*)::int AS total FROM books b ${where}`,
      [searchPattern]
    ),
  ]);

  return {
    books: booksResult.rows.map(normalizeBook),
    totalItems: countResult.rows[0].total,
  };
}

async function getBooksByGenrePaginated(genreId, page, limit) {
  const offset = (page - 1) * limit;
  const where = `
    WHERE EXISTS (
      SELECT 1 FROM book_genres filter_bg
      WHERE filter_bg.book_id = b.id AND filter_bg.genre_id = $1
    )
  `;

  const [booksResult, countResult] = await Promise.all([
    pool.query(
      `${BOOK_SELECT} ${where} GROUP BY b.id ORDER BY b.id LIMIT $2 OFFSET $3`,
      [genreId, limit, offset]
    ),
    pool.query(
      `SELECT COUNT(*)::int AS total FROM books b ${where}`,
      [genreId]
    ),
  ]);

  return {
    books: booksResult.rows.map(normalizeBook),
    totalItems: countResult.rows[0].total,
  };
}

module.exports = {
  getAllBooks,
  getBookById,
  getPaginatedBooks,
  searchBooksPaginated,
  getBooksByGenrePaginated,
};