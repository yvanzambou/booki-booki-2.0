const express = require("express");
const genresController = require("../controllers/genres.controller");

const router = express.Router();

router.get("/", genresController.getAllGenres);

module.exports = router;