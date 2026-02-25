const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        storySlug: {
            type: String,
            required: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
            maxLength: 1000,
        },
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
