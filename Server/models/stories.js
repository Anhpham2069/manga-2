const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const statusEnum = ['Sắp bắt đầu', 'Đang cập nhật', 'Hoàn thành'];
const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: Array, // Assuming the image path is stored as a string
    required: false, // Change to true if it's required
  },
});

const storiesSchema = new mongoose.Schema({
  sTitle: {
    type: String,
    required: true,
  },
  sDescription: {
    type: String,
    required: true,
  },
  sAuthor: {
    type: String,
    required: true,
  },
  sGenres: {
    type: Array,
    required: true,
  },
  // sChapter: [chapterSchema], // Use the sub-schema for sChapter
  sChapter: {
    type: Array,
    required: true,
  }, // Use the sub-schema for sChapter
  sViews: {
    type: Number,
    required: true,
  },
  sSaves: {
    type: Number,
    required: true,
  },
  sStatus: {
    type: String,
    default: 'Sắp bắt đầu',
    enum: ['Sắp bắt đầu', 'Đang cập nhật', 'Hoàn thành'],
  },
},
{
  timestamps: {
    currentTime: () => new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
  },
});

const storiesModel = mongoose.model("stories", storiesSchema);

module.exports = storiesModel;

// required: true,