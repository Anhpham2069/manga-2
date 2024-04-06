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
import {
  getstorysFailed,
  getstorysStart,
  getstorysSuccess,
} from "../redux/slice/storySlice";
const apiURL = process.env.REACT_APP_API_URL;
const apiURLOTruyen = process.env.API_URL_OTruyen;
console.log(apiURL)

export const getStoriesByList = async (slug) => {
  try {
    const res = await axios.get(
      `https://otruyenapi.com/v1/api/danh-sach/${slug}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
export const addFavoritesStory = async (
  accessToken,
  slug,
  storyInfo,
  userId,
  dispatch
) => {
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
export const removeFavoritesStory = async (
  accessToken,
  slug,
  userId,
  dispatch
) => {
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

// stories

export const getAllStories = async (dispatch) => {
  dispatch(getstorysStart());
  try {
    const res = await axios.get(`${apiURLOTruyen}/home`);
    dispatch(getstorysSuccess(res.data));
  } catch (error) {
    dispatch(getstorysFailed());
 
  }
};
//history

export const getAllHistory = async()=>{
  try {
    const res = await axios.get(`${apiURL}/api/history/get-all`)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

//category

export const getAllCategory =  async () =>{
  try {
    const res = await axios.get(`https://otruyenapi.com/v1/api/the-loai`);
    if(res.data)
      return res.data.data
  } catch (error) {
    console.log(error)
  }
}

