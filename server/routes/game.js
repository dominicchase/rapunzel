const express = require("express");
const router = express.Router();
const { getGames, getGame } = require("../controllers/game");

router.get("/", getGames);

router.get("/:gameId", getGame);

module.exports = router;
