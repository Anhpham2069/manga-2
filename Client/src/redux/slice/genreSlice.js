// src/features/genreSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getAllStoriesApi } from '../../Admin/page/stories/fetchApi';
// const res = await getAllStoriesApi()


const genreSlice = createSlice({
  name: 'genres',
  initialState: [],
  reducers: {
    addGenre: (state, action) => {
      state.push(action.payload);
    },
    getAllGenre: (state, action) => {
      return action.payload
    },
    deleteGenreById: (state, action) => {
      const genreIdToDelete = action.payload;
      return state.filter(genre => genre._id !== genreIdToDelete);
    },
    updateGenreById: (state, action) => {
      const { id, updatedGenre } = action.payload;
      const genreToUpdate = state.find((genre) => genre._id === id);

      if (genreToUpdate) {
        // Update the properties of the found genre
        if (updatedGenre.genreName !== undefined) genreToUpdate.genreName = updatedGenre.genreName;
        if (updatedGenre.slug !== undefined) genreToUpdate.slug = updatedGenre.slug;
        if (updatedGenre.description !== undefined) genreToUpdate.description = updatedGenre.description;
      }
    },
  },
});

export const { addGenre, getAllGenre, deleteGenreById, updateGenreById } = genreSlice.actions;
export default genreSlice.reducer;
