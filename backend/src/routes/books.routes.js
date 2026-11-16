const express = require("express");

const booksController = require("../controllers/books.controller");
const genresController = require("../controllers/genres.controller");

const router = express.Router();

router.get("/", booksController.getAllBooks);
router.get("/search", booksController.searchBooks);
router.get("/genre/:genreId", genresController.getBooksByGenreId);
router.get("/:id", booksController.getBookById);

module.exports = router;