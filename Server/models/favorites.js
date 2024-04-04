const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    // slug: { type: String, required: true },
    storyInfo: {
      type: Object,
    },
  },
  {
    timestamps: {
      currentTime: () =>
        new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
    },
  }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
