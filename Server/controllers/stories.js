const storiesModel = require("../models/stories");

exports.getAllStory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const aggregationResult = await storiesModel.aggregate([
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const allStories = aggregationResult;
    const totalDocuments = await storiesModel.countDocuments(); // Count all documents in the collection
    const totalPages = Math.ceil(totalDocuments / limit);

    res.status(200).json({
      data: allStories,
      page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fs = require("fs/promises"); // Node.js fs module with promises

exports.addStory = async (req, res) => {
  try {
    const {
      sTitle,
      sDescription,
      sAuthor,
      sGenres,
      // sChapter,
      // sViews,
      // sSaves,
      sStatus,
    } = req.body;
    const sChapter = req.files

    const newStory = new storiesModel({
      sTitle,
      sDescription,
      sAuthor,
      sGenres,
      sViews: 0,
      sSaves: 0,
      sStatus,
      sChapter, // Assuming sChapter is an array of chapter objects
    });

    // Validate and handle file upload
    if (req.file) {
      const allowedFileTypes = ["image/jpeg", "image/png"];

      // Validate file type
      if (!allowedFileTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Invalid file type" });
      }

      // Update image field for each chapter
      newStory.sChapter.sChapter.forEach((chapter) => {
        chapter.image = req.file.filename;
      });
    }

    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      // Update image array for each chapter
      newStory.sChapter.forEach((chapter, index) => {
        chapter.sChapterImages = req.files.map((file) => file.filename);
      });
    }

    const savedStory = await newStory.save();

    res.status(201).json(savedStory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// {
//     sChaperTitle: sChaper[0].sChaperTitle,
//     // Thêm các trường khác của chương nếu có
// },

exports.updateStory = async (req, res) => {
  try {
    const { storyId } = req.body; // Assuming the storyId is passed in the request parameters
    const {
      sTitle,
      sDescription,
      sAuthor,
      sGenres,
      sChapter,
      sViews,
      sSaves,
      sStatus,
    } = req.body;

    // Find the existing story by ID
    const existingStory = await storiesModel.findById(storyId);

    if (!existingStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Update the story fields
    existingStory.sTitle = sTitle || existingStory.sTitle;
    existingStory.sDescription = sDescription || existingStory.sDescription;
    existingStory.sAuthor = sAuthor || existingStory.sAuthor;
    existingStory.sGenres = sGenres || existingStory.sGenres;
    existingStory.sViews = sViews || existingStory.sViews;
    existingStory.sSaves = sSaves || existingStory.sSaves;
    existingStory.sStatus = sStatus || existingStory.sStatus;

    // Update sChapter if provided
    if (sChapter) {
      existingStory.sChapter = sChapter;
    }

    // Check if there is an uploaded file
    if (req.file) {
      existingStory.sChapter[0].sChapterImage = req.file.filename;
    }

    // Save the updated story
    const updatedStory = await existingStory.save();

    res.status(200).json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.addChapterToStory = async (req, res) => {
  try {
    // const { storyId } = req.params; // Assuming the storyId is passed in the URL
    const { storyId } = req.body
    // Find the existing story by ID
    const existingStory = await storiesModel.findById(storyId);

    if (!existingStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Extract chapter details from the request body
    const newChapter = req.files

    // Create a new chapter object
    if (req.file) {
      const allowedFileTypes = ["image/jpeg", "image/png"];

      // Validate file type
      if (!allowedFileTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Invalid file type" });
      }

      // Update image field for each chapter
      newChapter.forEach((chapter) => {
        chapter.image = req.file.filename;
      });
    }

    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      // Update image array for each chapter
      newChapter.forEach((chapter, index) => {
        chapter.sChapterImages = req.files.map((file) => file.filename);
      });
    }
    // Add the new chapter to the existing story
    existingStory.sChapter.push(newChapter);

    // Update the story with the new chapter
    const updatedStory = await existingStory.save();

    res.status(200).json(updatedStory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteChapterFromStory = async (req, res) => {
  try {
    const { storyId, chapterId } = req.params;

    // Find the existing story by ID
    const existingStory = await storiesModel.findById(storyId);

    if (!existingStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Find the index of the chapter to be deleted
    const chapterIndex = existingStory.sChapter.findIndex((chapter) => chapter._id == chapterId);

    if (chapterIndex === -1) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    // Remove the chapter from the array
    existingStory.sChapter.splice(chapterIndex, 1);

    // Save the updated story
    const updatedStory = await existingStory.save();

    res.status(200).json(updatedStory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const storyId = req.params.id; // Assuming the story ID is passed as a route parameter

    // Check if the story with the given ID exists
    const existingStory = await storiesModel.findById(storyId);
    if (!existingStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Delete the story
    await storiesModel.findByIdAndDelete(storyId);

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchStory = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const regex = new RegExp(searchTerm, "i"); // Case-insensitive search

    const searchResults = await storiesModel
      .find({
        $or: [
          { sTitle: { $regex: regex } },
          { sDescription: { $regex: regex } },
          { sAuthor: { $regex: regex } },
          { sGenres: { $regex: regex } },
        ],
      })
      .exec();

    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
