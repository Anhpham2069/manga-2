const Sticker = require("../models/Sticker");

const stickerController = {
    // Add or Update a Category
    upsertCategory: async (req, res) => {
        try {
            const { category, label, stickers } = req.body;
            const existing = await Sticker.findOne({ category });
            if (existing) {
                existing.label = label || existing.label;
                if (stickers) existing.stickers = stickers;
                await existing.save();
                return res.status(200).json(existing);
            } else {
                const newCategory = new Sticker({ category, label, stickers });
                await newCategory.save();
                return res.status(201).json(newCategory);
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Get all Stickers
    getAllStickers: async (req, res) => {
        try {
            const stickers = await Sticker.find({});
            res.status(200).json(stickers);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete a Category
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            await Sticker.findByIdAndDelete(id);
            res.status(200).json("Deleted Successfully");
        } catch (err) {
            res.status(500).json(err);
        }
    },

    uploadStickers: async (req, res) => {
        try {
            const { category, label } = req.body;
            if (!req.files || req.files.length === 0) {
                return res.status(400).json("No files uploaded");
            }
            const stickers = req.files.map((file) => ({
                id: file.originalname.split('.')[0],
                url: file.path // Cloudinary returns the full URL in file.path
            }));
            const existing = await Sticker.findOne({ category });
            if (existing) {
                existing.label = label || existing.label;
                const existingIds = new Set(existing.stickers.map(s => s.id));
                stickers.forEach(s => {
                    if (!existingIds.has(s.id)) {
                        existing.stickers.push(s);
                    }
                });
                await existing.save();
                return res.status(200).json(existing);
            } else {
                const newCategory = new Sticker({ category, label: label || category, stickers });
                await newCategory.save();
                return res.status(201).json(newCategory);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = stickerController;
