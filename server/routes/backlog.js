const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addToBacklog } = require("../controllers/backlog");

router.post("/add", authMiddleware, addToBacklog);

module.exports = router;
