const mongoose = require("mongoose");

const backlogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userBacklog: [
    {
      id: {
        type: Number,
        required: true,
        unique: true, // Ensure that each game from IGDB is only stored once
      },
      cover: {
        id: {
          type: Number,
          requred: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
      first_release_date: {
        type: Date,
        required: true,
      },
      genres: [
        {
          id: {
            type: Number,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
        },
      ],
      name: {
        type: String,
        required: true,
      },
      platforms: [
        {
          id: { type: Number, required: true },
          name: {
            type: String,
            required: true,
          },
        },
      ],
      status: {
        type: String,
        enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
        default: "not started",
      },
      startedAt: {
        type: Date,
      },
      completedAt: {
        type: Date,
      },
    },
  ],
});

backlogSchema.pre("save", function (next) {
  this.lastModified = Date.now();
  next();
});

const Backlog = mongoose.model("Backlog", backlogSchema);
module.exports = { Backlog };
