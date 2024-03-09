const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema({
    time: { type: Date, required: true },
    storyName: { type: String, required: true },
    chapterName: { type: String, required: true },
  });
  
  
const NotificationModel = mongoose.model("Noti", notificationSchema);

module.exports = NotificationModel;
