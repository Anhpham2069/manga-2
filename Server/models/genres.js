const mongoose = require("mongoose");

const genresSchema = new mongoose.Schema({
  genreId: {
    type: String,
    require: true,
  },
  genreName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
},
  { timestamps: true }
);

const genresModel = mongoose.model("Genre", genresSchema);

module.exports = genresModel;
