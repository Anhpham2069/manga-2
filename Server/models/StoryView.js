const mongoose = require("mongoose");

const storyViewSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
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
    lastViewedAt: {
        type: Date,
        default: Date.now,
    },
});

const StoryView = mongoose.model("StoryView", storyViewSchema);

module.exports = StoryView;
