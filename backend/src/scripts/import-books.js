const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const pool = require("../config/db");

const booksFile = process.env.BOOKS_JSON_PATH || path.resolve(__dirname, "../../../database/books.json");

const IMPORT_LIMIT = 100;

function toNullableNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function cleanGenres(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value
    .filter((genre) => typeof genre === "string")
    .map((genre) => genre.trim())
    .filter(Boolean))];
}

async function importBooks() {
  if (!fs.existsSync(booksFile)) {
    console.warn(`Book import skipped: ${booksFile} was not found.`);
    console.warn("Place your books.json in the root database/ directory to import the catalogue.");
    return;
  }

  const books = JSON.parse(fs.readFileSync(booksFile, "utf8"));
  if (!Array.isArray(books)) {
    throw new Error("books.json must contain a JSON array.");
  }

  const booksToImport = Math.min(books.length, IMPORT_LIMIT);

  console.log(`Starting import of ${booksToImport} books...`);
  const client = await pool.connect();
  let imported = 0;

  try {
    await client.query("BEGIN");

    for (let index = 0; index < Math.min(books.length, IMPORT_LIMIT); index += 1) {
      const book = books[index];
      if (!book || !book.title || !book.author) continue;

      // source_id makes repeated imports safe. The database creates its own primary key.
      const sourceId = String(book.bookId ?? book.id ?? index + 1);
      const values = [
        sourceId,
        String(book.title),
        String(book.author),
        toNullableNumber(book.rating),
        book.description || null,
        book.language || null,
        book.isbn || null,
        book.bookFormat || null,
        book.edition || null,
        toNullableNumber(book.pages),
        book.publisher || null,
        book.publishDate || null,
        book.firstPublishDate || null,
        toNullableNumber(book.numRatings),
        book.coverImg || null,
        toNullableNumber(book.price),
      ];

      const bookResult = await client.query(`
        INSERT INTO books (
          source_id, title, author, rating, description, language, isbn,
          book_format, edition, pages, publisher, publish_date,
          first_publish_date, num_ratings, cover_img, price
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        )
        ON CONFLICT (source_id) DO UPDATE SET
          title = EXCLUDED.title,
          author = EXCLUDED.author,
          rating = EXCLUDED.rating,
          description = EXCLUDED.description,
          language = EXCLUDED.language,
          isbn = EXCLUDED.isbn,
          book_format = EXCLUDED.book_format,
          edition = EXCLUDED.edition,
          pages = EXCLUDED.pages,
          publisher = EXCLUDED.publisher,
          publish_date = EXCLUDED.publish_date,
          first_publish_date = EXCLUDED.first_publish_date,
          num_ratings = EXCLUDED.num_ratings,
          cover_img = EXCLUDED.cover_img,
          price = EXCLUDED.price,
          updated_at = NOW()
        RETURNING id
      `, values);

      const bookId = bookResult.rows[0].id;
      await client.query("DELETE FROM book_genres WHERE book_id = $1", [bookId]);

      for (const genreName of cleanGenres(book.genres)) {
        const genreResult = await client.query(`
          INSERT INTO genres (name)
          VALUES ($1)
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `, [genreName]);

        await client.query(`
          INSERT INTO book_genres (book_id, genre_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [bookId, genreResult.rows[0].id]);
      }

      imported += 1;
    }

    await client.query("COMMIT");
    console.log(`Import completed. ${imported} books processed.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

importBooks()
  .catch((error) => {
    console.error("Book import failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });