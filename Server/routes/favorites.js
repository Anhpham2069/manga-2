const router = require("express").Router();
const favoritesController = require('../controllers/favorites');
const { verifyToken } = require("../controllers/verifyToken");


router.post('/add', verifyToken, favoritesController.addFavorite)
router.delete('/delete', verifyToken, favoritesController.deleteFavorites)
router.get('/get-all', verifyToken, favoritesController.getAllFavorites)


module.exports = router;