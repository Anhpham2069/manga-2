const mongoose = require("mongoose");

const ReadHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
  },
  chapter: {
    type: Number,
  },
  chapterId:{
    type: String,
  },
  storyInfo: {
    type: Object,
  },
  readCount: {
    type: Number,
    default: 1,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ReadHistory = mongoose.model("ReadHistory", ReadHistorySchema);

module.exports = ReadHistory;
