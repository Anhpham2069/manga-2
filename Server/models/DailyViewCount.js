const mongoose = require("mongoose");

const dailyViewCountSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        index: true,
    },
    date: {
        type: String, // Format: "YYYY-MM-DD"
        required: true,
        index: true,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    storyName: {
        type: String,
        default: "",
    },
});

// Compound index để tìm nhanh theo slug + date
dailyViewCountSchema.index({ slug: 1, date: 1 }, { unique: true });
// Index để query theo date range hiệu quả
dailyViewCountSchema.index({ date: 1, viewCount: -1 });

const DailyViewCount = mongoose.model("DailyViewCount", dailyViewCountSchema);

module.exports = DailyViewCount;
