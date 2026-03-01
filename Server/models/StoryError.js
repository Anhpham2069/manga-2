const mongoose = require("mongoose");

const storyErrorSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userID: { type: String, required: true },
    nameErr: { type: String, required: true },
    storyInfo: {
      type: String,
      required: true,
    },
    chapterInfo: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
);

const StoryError = mongoose.model("StoryError", storyErrorSchema);

module.exports = StoryError;
