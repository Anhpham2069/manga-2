import axios from "axios";
import {
  addFavoriteFailed,
  addFavoriteStart,
  addFavoriteSuccess,
  getFavoritesFailed,
  getFavoritesStart,
  getFavoritesSuccess,
  removeFavoriteFailed,
  removeFavoriteStart,
  removeFavoriteSuccess,
} from "../redux/slice/favoritesSlice";
const apiURL = process.env.REACT_APP_API_URL;

export const storiesDataft = async () => {
  try {
    const res = await axios.get(
      `https://otruyenapi.com/v1/api/danh-sach/sap-ra-mat`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
export const addFavoritesStory = async (accessToken,slug,storyInfo,userId,dispatch) => {
  dispatch(addFavoriteStart());
  try {
    const res = await axios.post(
      `${apiURL}/api/favorites/add`,
      { slug, userId, storyInfo }, 
      {
        headers: { token: `Bearer ${accessToken}` }, 
      }
    );
    dispatch(addFavoriteSuccess(res.data));
  } catch (error) {
    console.log(error);
    dispatch(addFavoriteFailed());
  }
};
export const removeFavoritesStory = async (accessToken,slug,userId,dispatch) => {
  dispatch(removeFavoriteStart());
  try {
    const res = await axios.post(
      `${apiURL}/api/favorites/delete`,
      { slug, userId }, 
      {
        headers: { token: `Bearer ${accessToken}` }, 
      }
    );
    dispatch(removeFavoriteSuccess({ slug }));
  } catch (error) {
    dispatch(removeFavoriteFailed());
    console.log(error);
  }
};

export const getAllFavorites = async (accessToken, userId, dispatch) => {
  dispatch(getFavoritesStart());
  try {
    const res = await axios.get(
      `${apiURL}/api/favorites/get-single/${userId}`,
      {
        headers: { token: `Bearer ${accessToken}` }, 
      }
    );
    dispatch(getFavoritesSuccess(res.data));
  } catch (error) {
    dispatch(getFavoritesFailed());
  }
};
