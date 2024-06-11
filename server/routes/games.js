const express = require("express");
const router = express.Router();
const { getGames } = require("../controllers/games");

router.get("/", getGames);

module.exports = router;
