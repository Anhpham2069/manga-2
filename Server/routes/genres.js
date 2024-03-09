// routes/genres.js

const express = require('express');
const router = express.Router();
const genresController = require('../controllers/genres');

router.post('/add', genresController.addGenre);
router.put('/update/:id', genresController.updateGenre);
router.delete('/delete/:id', genresController.deleteGenre);
router.get('/all', genresController.getAllGenres);
router.get('/:id', genresController.getGenreById);

module.exports = router;
