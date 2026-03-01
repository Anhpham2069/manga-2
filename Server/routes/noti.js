const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/noti");

// CRUD routes
router.post("/noti", announcementController.createAnnouncement);
router.get("/noti", announcementController.getAllAnnouncements);
router.get("/noti/active", announcementController.getActiveAnnouncement);
router.put("/noti/:id", announcementController.updateAnnouncement);
router.delete("/noti/:id", announcementController.deleteAnnouncement);
router.patch("/noti/:id/toggle", announcementController.toggleAnnouncement);

module.exports = router;
