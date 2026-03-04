const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Mỗi user chỉ rate 1 lần cho 1 truyện
ratingSchema.index({ slug: 1, userId: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
