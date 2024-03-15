const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId:{type: String,required: true},
  slug: { type: String, required: true, unique: true },
  storyInfo: {
    type: Object,
    required: true,
  },
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
