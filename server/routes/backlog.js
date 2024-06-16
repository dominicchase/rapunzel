const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addToBacklog,
  getBacklog,
  removeFromBacklog,
} = require("../controllers/backlog");

router.get("/", getBacklog);

router.post("/add", authMiddleware, addToBacklog);

router.delete("/delete", authMiddleware, removeFromBacklog);

module.exports = router;
