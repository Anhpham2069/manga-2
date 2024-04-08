const router = require("express").Router();
const favoritesController = require('../controllers/favorites');
const { verifyToken } = require("../controllers/verifyToken");


router.post('/add/:slug', verifyToken, favoritesController.addFavorite)
router.post('/delete',favoritesController.deleteFavorites)
router.get('/get-all', verifyToken, favoritesController.getAllFavorites)
router.get('/get-single/:userId', favoritesController.getUserFavorites)


module.exports = router;