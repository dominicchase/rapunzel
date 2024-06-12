const mongoose = require("mongoose");

const backlogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  status: {
    type: String,
    enum: ["not started", "in progress", "completed"],
    default: "not started",
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

backlogSchema.pre("save", function (next) {
  this.lastModified = Date.now();
  next();
});

exports.Backlog = mongoose.model("Backlog", backlogSchema);
