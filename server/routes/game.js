const express = require("express");
const router = express.Router();
const { getGames } = require("../controllers/game");

router.get("/", getGames);

module.exports = router;
