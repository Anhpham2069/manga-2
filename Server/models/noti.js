const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    message: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AnnouncementModel = mongoose.model("Announcement", announcementSchema);

module.exports = AnnouncementModel;
