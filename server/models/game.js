const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  igdbId: {
    type: String,
    required: true,
    unique: true, // Ensure that each game from IGDB is only stored once
  },
  name: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
  },
  coverUrl: {
    type: String,
  },
});

exports.Game = mongoose.model("Game", gameSchema);
