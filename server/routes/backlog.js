const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addToBacklog, getBacklog } = require("../controllers/backlog");

router.get("/", getBacklog);

router.post("/add", authMiddleware, addToBacklog);

module.exports = router;
