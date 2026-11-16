const booksService = require("../services/books.service");

function parsePagination(query, defaultLimit) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? defaultLimit : Number(query.limit);

  if (
    !Number.isInteger(page) || page < 1 ||
    !Number.isInteger(limit) || limit < 1 || limit > 100
  ) {
    return null;
  }

  return { page, limit };
}

function sendPaginatedResponse(res, result, page, limit, extra = {}) {
  return res.status(200).json({
    success: true,
    ...extra,
    pagination: {
      currentPage: page,
      limit,
      totalItems: result.totalItems,
      totalPages: Math.ceil(result.totalItems / limit),
    },
    count: result.books.length,
    data: result.books,
  });
}

async function getAllBooks(req, res) {
  const pagination = parsePagination(req.query, 20);
  if (!pagination) {
    return res.status(400).json({
      success: false,
      message: "Invalid pagination parameters. Page must be at least 1 and limit must be between 1 and 100.",
    });
  }

  const result = await booksService.getPaginatedBooks(
    pagination.page,
    pagination.limit
  );
  return sendPaginatedResponse(res, result, pagination.page, pagination.limit);
}

async function getBookById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Invalid book ID" });
  }

  const book = await booksService.getBookById(id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  return res.status(200).json({ success: true, data: book });
}

async function searchBooks(req, res) {
  const query = req.query.q;
  if (typeof query !== "string" || !query.trim()) {
    return res.status(400).json({ success: false, message: "Search query is required" });
  }

  const pagination = parsePagination(req.query, 10);
  if (!pagination) {
    return res.status(400).json({ success: false, message: "Invalid pagination parameters" });
  }

  const cleanQuery = query.trim();
  const result = await booksService.searchBooksPaginated(
    cleanQuery,
    pagination.page,
    pagination.limit
  );

  return sendPaginatedResponse(res, result, pagination.page, pagination.limit, {
    query: cleanQuery,
  });
}

module.exports = { getAllBooks, getBookById, searchBooks };