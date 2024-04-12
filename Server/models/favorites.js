const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
   
    storyInfo: {
      type: Array,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
