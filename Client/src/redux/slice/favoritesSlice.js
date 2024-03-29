import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorite",
  initialState: {
    favorites: {
      allFavorites: [],
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    addFavoriteStart: (state) => {
      state.favorites.isFetching = true;
      state.favorites.error = false;
    },
    addFavoriteSuccess: (state, action) => {
      state.favorites.isFetching = false;
      state.favorites.allFavorites = null;

      const isStoryExists = state.favorites.allFavorites.some(
        (favorite) => favorite.slug === action.payload.slug
      );
      if (!isStoryExists) {
        state.favorites.allFavorites.push(action.payload);
      } else {
        console.log("Story already exists in favorites.");
      }

      state.favorites.error = false;
    },
    addFavoriteFailed: (state) => {
      state.favorites.isFetching = false;
      state.favorites.error = true;
    },
    removeFavoriteStart: (state) => {
      state.favorites.isFetching = true;
    },
    removeFavoriteSuccess: (state, action) => {
      state.favorites.isFetching = false;
      state.favorites.error = false;
      state.favorites.allFavorites = state.favorites.allFavorites.filter(
        (favorite) => favorite.slug !== action.payload.slug
      );
    },
    removeFavoriteFailed: (state) => {
      state.favorites.isFetching = false; 
      state.favorites.error = true;
    },

    getFavoritesStart: (state) => {
      state.favorites.isFetching = true;
    },
    getFavoritesSuccess: (state, action) => {
      state.favorites.isFetching = false;
      state.favorites.allFavorites = action.payload;
      state.favorites.error = false;
    },
    getFavoritesFailed: (state) => {
      state.favorites.error = true;
    },
  },
});
export const {
  addFavoriteStart,
  addFavoriteSuccess,
  addFavoriteFailed,
  getFavoritesStart,
  getFavoritesSuccess,
  getFavoritesFailed,
  removeFavoriteStart,
  removeFavoriteSuccess,
  removeFavoriteFailed,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
