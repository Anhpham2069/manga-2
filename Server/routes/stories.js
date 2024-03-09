const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path"); // Import the 'path' module
const storiesController = require("../controllers/stories");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/stories");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Serve static files
router.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Your existing routes...
router.post("/add", upload.any(), storiesController.addStory);
router.get("/all-story", storiesController.getAllStory);
router.put("/update/:id", storiesController.updateStory);
router.put("/update-chapter",upload.any(), storiesController.addChapterToStory);
router.post("/search", storiesController.searchStory);
router.delete("/delete/:id", storiesController.deleteStory);

module.exports = router;
