const axios = require("axios");
const qs = require("qs");

module.exports = {
  addToBacklog,
};

async function addToBacklog(req, res) {
  try {
    // const { userId, gameId, status } = req.body;
    // // Validate request data
    // if (!userId || !gameId) {
    //   return res
    //     .status(400)
    //     .json({ message: "User ID and Game ID are required" });
    // }
    // // Check if the game is already in the user's backlog
    // const existingEntry = await Backlog.findOne({ userId, gameId });
    // if (existingEntry) {
    //   return res
    //     .status(400)
    //     .json({ message: "Game already exists in backlog" });
    // }
    // // Create a new backlog entry
    // const newBacklogEntry = new Backlog({
    //   userId,
    //   gameId,
    //   status: status || "not started", // Default status to "not started" if not provided
    // });
    // // Save the backlog entry to the database
    // await newBacklogEntry.save();
    // res.status(201).json(newBacklogEntry);
  } catch (error) {
    // console.error(error);
    // res.status(500).json({ message: "Internal server error" });
  }
}
