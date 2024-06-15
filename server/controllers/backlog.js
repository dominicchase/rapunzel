const axios = require("axios");
const qs = require("qs");
const { Backlog } = require("../models/backlog");

module.exports = {
  getBacklog,
  addToBacklog,
};

async function getBacklog(req, res) {
  try {
    const userId = req.query.userId;
    const type = req.query.type;
    const page = req.query.page || 0;
    const size = req.query.size || 10;

    console.log({ userId, type, page, size });

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID and Game ID are required" });
    }

    const backlog = await Backlog.find({ userId });

    // TODO: return paginated response using sort and slice

    // // find the user's backlog document by userId
    // const allGamesInBacklog = await Backlog.find({ userId })
    //   .sort({ name: "ascending" })
    //   .skip(page * size);

    // // find the user's backlog document by userId
    // const limitedGamesInBacklog = await Backlog.find({ userId })
    //   .sort({ name: "ascending" })
    //   .skip(page * size)
    //   .limit(size);

    // const totalGames = allGamesInBacklog.length;
    // const totalPages = Math.ceil(totalGames / size);

    // res.status(200).send({
    //   backlog: limitedGamesInBacklog,
    //   page: +page,
    //   totalPages: +totalPages,
    //   totalGames: +totalGames,
    // });
  } catch (error) {}
}

async function addToBacklog(req, res) {
  try {
    const { userId, gameId, status, startedAt, completedAt } = req.body;

    // Validate request data
    if (!userId || !gameId || !status || (!startedAt && !completedAt)) {
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
            ...(startedAt && { startedAt }),
            ...(completedAt && { completedAt }),
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

async function getGameData() {
  const client_id = process.env.CLIENT_ID;

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": client_id,
      Authorization: `Bearer ${accessToken}`,
    },
    body: `search "${search}"; fields name,genres.name,platforms.name,first_release_date,cover.url;`,
  });
}
