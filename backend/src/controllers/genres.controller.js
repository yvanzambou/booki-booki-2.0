const genresService = require("../services/genres.service");
const booksService = require("../services/books.service");

function parsePagination(query) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 10 : Number(query.limit);
  if (
    !Number.isInteger(page) || page < 1 ||
    !Number.isInteger(limit) || limit < 1 || limit > 100
  ) return null;
  return { page, limit };
}

async function getAllGenres(req, res) {
  const genres = await genresService.getAllGenres();
  return res.status(200).json({ success: true, count: genres.length, data: genres });
}

async function getBooksByGenreId(req, res) {
  const genreId = Number(req.params.genreId);
  if (!Number.isInteger(genreId) || genreId <= 0) {
    return res.status(400).json({ success: false, message: "Invalid genre ID" });
  }

  const pagination = parsePagination(req.query);
  if (!pagination) {
    return res.status(400).json({ success: false, message: "Invalid pagination parameters" });
  }

  const genre = await genresService.getGenreById(genreId);
  if (!genre) {
    return res.status(404).json({ success: false, message: "Genre not found" });
  }

  const result = await booksService.getBooksByGenrePaginated(
    genre.id,
    pagination.page,
    pagination.limit
  );

  return res.status(200).json({
    success: true,
    genre,
    pagination: {
      currentPage: pagination.page,
      limit: pagination.limit,
      totalItems: result.totalItems,
      totalPages: Math.ceil(result.totalItems / pagination.limit),
    },
    count: result.books.length,
    data: result.books,
  });
}

module.exports = { getAllGenres, getBooksByGenreId };