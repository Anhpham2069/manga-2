const mongoose = require('mongoose');

const ReadHistorySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true
  },
  storyInfo: {
    type: Object,
  },
  readCount: {
    type: Number,
    default: 1
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ReadHistory = mongoose.model('ReadHistory', ReadHistorySchema);

module.exports = ReadHistory;
