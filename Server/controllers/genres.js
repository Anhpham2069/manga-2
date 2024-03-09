const Genre = require('../models/genres');

exports.addGenre = async (req, res) => {
  const { genreId,genreName } = req.body;

  try {
    const newGenre = new Genre(genreId, genreName );
    await newGenre.save();
    res.status(201).json({ newGenre });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating genre" });
  }
};

exports.updateGenre = async (req, res) => {
  try {
    const { genreName } = req.body;
    const genreId = req.params.id;

    const updatedGenre = await Genre.findByIdAndUpdate(
      genreId,
      { genreName },
      { new: true, runValidators: true }
    );

    if (!updatedGenre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    res.status(200).json(updatedGenre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    const deletedGenre = await Genre.findByIdAndDelete(req.params.id);

    if (!deletedGenre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    res.json({ message: 'Genre deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);

    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    res.json(genre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
