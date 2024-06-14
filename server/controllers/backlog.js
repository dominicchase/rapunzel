const axios = require("axios");
const qs = require("qs");
const { Backlog } = require("../models/backlog");

module.exports = {
  addToBacklog,
};

async function addToBacklog(req, res) {
  try {
    const { userId, gameId, status } = req.body;

    // Validate request data
    if (!userId || !gameId) {
      return res
        .status(400)
        .json({ message: "User ID and Game ID are required" });
    }

    // Find the user's backlog document by userId
    let backlog = await Backlog.findOne({ userId });

    // If the backlog document doesn't exist, create a new one
    if (!backlog) {
      backlog = new Backlog({ userId, backlog: [] });
    }

    // Check if the game is already in the backlog
    const existingGame = backlog.userBacklog.find(
      (entry) => entry.gameId.toString() === gameId
    );

    if (!existingGame) {
      // Add the game to the backlog
      backlog.userBacklog.push({ gameId, status });

      // Save the document after modifying the array
      await backlog.save();

      return res
        .status(200)
        .json({ message: "Game added to backlog", backlog });
    } else {
      return res
        .status(400)
        .json({ message: "Game is already in the backlog" });
    }
  } catch (error) {
    // console.error(error);
    // res.status(500).json({ message: "Internal server error" });
  }
}
