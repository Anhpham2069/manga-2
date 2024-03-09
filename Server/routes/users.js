const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const middlewareController = require('../middleware/middlewareController');


router.get("/all-user",middlewareController.verifyToken, userController.getAllUsers);

//DELETE USER
router.delete("/delete-user/:id", userController.deleteUser);


module.exports = router;
