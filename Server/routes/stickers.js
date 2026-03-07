const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const stickerController = require("../controllers/sticker");
const verifyToken = require("../controllers/verifyToken");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const category = req.body.category || 'misc';
        return {
            folder: `stickers/${category}`,
            allowed_formats: ['jpg', 'png', 'gif', 'jpeg', 'webp'],
            public_id: file.originalname.split('.')[0]
        };
    },
});

const upload = multer({ storage: storage });

router.get("/all", stickerController.getAllStickers);
router.post("/upsert", verifyToken.verifyTokenAndAdmin, stickerController.upsertCategory);
router.post("/upload", verifyToken.verifyTokenAndAdmin, upload.array("files"), stickerController.uploadStickers);
router.delete("/delete/:id", verifyToken.verifyTokenAndAdmin, stickerController.deleteCategory);

module.exports = router;
