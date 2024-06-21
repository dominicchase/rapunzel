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

    // pagination
    const start = page * size;
    const end = start + size;
    const backlogSlice = filteredBacklog.slice(start, end);

    return res.json({
      backlog: backlogSlice,
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

          const nextIndex = backlog.userBacklog.length;

          backlog.userBacklog.push({
            ...game,
            position: nextIndex,
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
    const { userId, gameId, position, status } = req.body;

    if (!userId || !gameId || position === undefined || !status) {
      return res.status(400).json({
        message: "User ID, Game ID, position, and status are required",
      });
    }

    const validStatuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];

    // validate the status
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the user's backlog document by userId
    let backlog = await Backlog.findOne({ userId });

    if (position > backlog.userBacklog.length - 1) {
      return res.status(400).json({ message: "Position out of bounds" });
    }

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

    if (position === existingGame.position && status === existingGame.status) {
      return res.status(400).json({
        message: `${existingGame.name} is already in position ${position}`,
      });
    }

    // remove game from its current position
    backlog.userBacklog.splice(existingGame.position, 1);

    // insert game at the provided position
    backlog.userBacklog.splice(position, 0, existingGame);

    // Rebuild positions for all games in userBacklog
    const rebuiltBacklog = backlog.userBacklog.map((game, index) => ({
      ...game,
      position: index,
      ...(game.id === gameId && { status }),
    }));

    backlog.userBacklog = rebuiltBacklog;

    await backlog.save();

    return res
      .status(200)
      .json({ message: "Game status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
