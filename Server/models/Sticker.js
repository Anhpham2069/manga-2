const mongoose = require("mongoose");

const stickerItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    url: { type: String, required: true },
});

const stickerSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            unique: true,
        },
        label: {
            type: String,
            required: true,
        },
        stickers: {
            type: [stickerItemSchema],
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Sticker", stickerSchema);
