const mongoose = require("mongoose");

const genresSchema = new mongoose.Schema({
    genreId:{
      type:Number,
      require:true,
    },
    genreName: {
      type: String,
      required: true,
  },
},
{ timestamps: true }
);

const genresModel = mongoose.model("Genre", genresSchema);

module.exports = genresModel;
