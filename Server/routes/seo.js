const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const seoController = require("../controllers/seo");
const sitemapController = require("../controllers/sitemap");
const verifyToken = require("../controllers/verifyToken");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'seo_assets',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'svg'],
        resource_type: 'auto'
    },
});

const upload = multer({ storage: storage });

router.get("/sitemap.xml", sitemapController.generateSitemap);
router.get("/sitemap-index.xml", sitemapController.generateSitemapIndex);
router.get("/sitemap-chapters-:page.xml", sitemapController.generateChapterSitemap);
router.get("/sitemap-chapters-count", sitemapController.getChapterSitemapCount);
router.get("/", seoController.getSeoConfig);

const uploadMiddleware = upload.fields([{ name: 'ogImage', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]);
const handleUpload = (req, res, next) => {
    uploadMiddleware(req, res, function (err) {
        if (err) {
            console.error("Lỗi upload file:", err);
            return res.status(500).json({ message: "Lỗi upload file", error: err.message || err });
        }
        next();
    });
};

router.post("/update", verifyToken.verifyTokenAndAdmin, handleUpload, seoController.updateSeoConfig);

module.exports = router;
