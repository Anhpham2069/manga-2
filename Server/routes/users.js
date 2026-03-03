const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyTokenAndUserAuthorization } = require('../controllers/verifyToken');

// GET ALL USERS
router.get("/all-user", verifyToken, userController.getAllUsers);

// UPDATE USER
router.put("/update-user/:id", verifyTokenAndUserAuthorization, userController.updateUser);

// TOGGLE ADMIN STATUS
router.put("/toggle-admin/:id", verifyTokenAndUserAuthorization, userController.toggleAdmin);

// DELETE USER
router.delete("/delete-user/:id", verifyTokenAndUserAuthorization, userController.deleteUser);
// UPDATE AVATAR
router.put("/update-avatar/:id", verifyToken, userController.updateAvatar);

module.exports = router;
