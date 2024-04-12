const router = require("express").Router();
const storyErrorController = require('../controllers/storyError');
const { verifyToken } = require("../controllers/verifyToken");


router.post('/add', verifyToken, storyErrorController.addStoryError)
router.post('/delete',storyErrorController.deleteStoryError)
router.get('/get-all', storyErrorController.getAllStoryError)
router.get('/get-single/:userId', storyErrorController.getUserStoryError)


module.exports = router;