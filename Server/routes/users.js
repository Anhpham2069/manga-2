const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyTokenAndUserAuthorization } = require('../controllers/verifyToken');



router.get("/all-user",verifyToken, userController.getAllUsers);

//DELETE USER
router.delete("/delete-user/:id",verifyTokenAndUserAuthorization, userController.deleteUser);


module.exports = router;
