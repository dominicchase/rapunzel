const axios = require("axios");
const qs = require("qs");
const { Backlog } = require("../models/backlog");

module.exports = {
  getBacklog,
  addToBacklog,
  removeFromBacklog,
  updateBacklog,
};

async function getBacklog(req, res) {
  try {
    const userId = req.query.userId;
    const status = req.query.status;
    const page = req.query.page || 0;
    const size = req.query.size || 10;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID and Game ID are required" });
    }

    const backlog = await Backlog.findOne({ userId });

    const filteredBacklog = backlog.userBacklog.filter(
      (game) => game.status === status
    );

    // TODO: sorting options

    const sortedBacklog = filteredBacklog.sort((a, b) =>
      a.name < b.name ? -1 : 1
    );

    // pagination
    const start = page * size;
    const end = start + size;
    const backlogSlice = sortedBacklog.slice(start, end);

    return res.json({
      games: backlogSlice,
      totalItems: filteredBacklog.length,
      totalPages: Math.ceil(filteredBacklog.length / size),
    });
  } catch (error) {}
}

async function addToBacklog(req, res) {
  try {
    const { userId, gameId, status } = req.body;

    // validate request data
    if (!userId || !gameId || !status) {
      return res
        .status(400)
        .json({ message: "User ID, Game ID, and status are required" });
    }

    const validStatuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];

    // validate the status
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the user's backlog document by userId
    let backlog = await Backlog.findOne({ userId });

    // If the backlog document doesn't exist, create a new one
    if (!backlog) {
      backlog = new Backlog({ userId, backlog: [] });
    }

    // Check if the game is already in the backlog
    const existingGame = backlog.userBacklog.find(
      (entry) => entry.id === gameId
    );

    if (!existingGame) {
      fetch(`http://localhost:3001/api/game/${gameId}`)
        .then((res) => {
          return res.json();
        })
        .then(async (data) => {
          const game = data[0];

          backlog.userBacklog.push({
            ...game,
            status,
            completedAt: status === "COMPLETED" ? Date.now() : null,
          });

          await backlog.save();

          return res
            .status(200)
            .json({ message: `${game.name} added to backlog` });
        });
    } else {
      return res
        .status(400)
        .json({ message: "Game is already in the backlog" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function removeFromBacklog(req, res) {
  try {
    const { userId, gameId } = req.body;

    if (!userId || !gameId) {
      return res
        .status(400)
        .json({ message: "User ID and Game ID are required" });
    }

    // Find the user's backlog document by userId
    let backlog = await Backlog.findOne({ userId });

    // If the backlog document doesn't exist, create a new one
    if (!backlog) {
      return res.status(400).json({ message: "User backlog not found" });
    }

    // Check if the game is already in the backlog
    const existingGame = backlog.userBacklog.find(
      (entry) => entry.id === gameId
    );

    if (!existingGame) {
      return res.status(400).json({ message: "Game is not in backlog" });
    }

    backlog.userBacklog = backlog.userBacklog.filter(
      (game) => game.id !== gameId
    );

    await backlog.save();

    return res
      .status(200)
      .json({ message: `${existingGame.name} removed from backlog` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateBacklog(req, res) {
  try {
    const { userId, gameId, status } = req.body;

    if (!userId || !gameId || !status) {
      return res
        .status(400)
        .json({ message: "User ID, Game ID, and status are required" });
    }

    const validStatuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];

    // validate the status
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the user's backlog document by userId
    let backlog = await Backlog.findOne({ userId });

    // If the backlog document doesn't exist, create a new one
    if (!backlog) {
      return res.status(400).json({ message: "Backlog not found" });
    }

    // Check if the game is already in the backlog
    const existingGame = backlog.userBacklog.find(
      (entry) => entry.id === gameId
    );

    if (!existingGame) {
      return res.status(400).json({ message: "Game is not in backlog" });
    }

    // Build the update object
    const updateFields = {
      "userBacklog.$.status": status,
    };

    switch (status) {
      // case "IN_PROGRESS": {
      //   updateFields["userBacklog.$.startedAt"] = Date.now();
      //   updateFields["userBacklog.$.completedAt"] = null;
      //   break;
      // }

      case "COMPLETED": {
        updateFields["userBacklog.$.completedAt"] = Date.now();
        break;
      }

      default: {
        // updateFields["userBacklog.$.startedAt"] = null;
        updateFields["userBacklog.$.completedAt"] = null;
      }
    }

    // update the specific game in the user's backlog
    await Backlog.findOneAndUpdate(
      { userId, "userBacklog.id": gameId },
      { $set: updateFields },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Game status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
