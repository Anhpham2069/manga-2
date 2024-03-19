const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../controllers/verifyToken');



router.get("/all-user",verifyToken, userController.getAllUsers);

//DELETE USER
router.delete("/delete-user/:id", userController.deleteUser);


module.exports = router;
