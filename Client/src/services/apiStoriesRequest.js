import axios from "axios";
import {
  addFavoriteFailed,
  addFavoriteStart,
  addFavoriteSuccess,
  getCountFavoritesSuccess,
  getCountFavoritesStart,
  getCountHistorySuccess,
  getFavoritesFailed,
  getFavoritesStart,
  getFavoritesSuccess,
  removeFavoriteFailed,
  removeFavoriteStart,
  removeFavoriteSuccess,
  getCountFavoritesFail,
} from "../redux/slice/favoritesSlice";
import {
  getstorysFailed,
  getstorysStart,
  getstorysSuccess,
} from "../redux/slice/storySlice";
const apiURL = process.env.REACT_APP_API_URL;
const apiURLOTruyen = process.env.REACT_APP_API_URL_OTruyen;
console.log(apiURLOTruyen);


const authHeader = (token) => ({
  headers: { token: `Bearer ${token}` },
});
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

export const getStoriesByList = async (slug) => {
  try {
    const res = await axios.get(`${apiURLOTruyen}/danh-sach/${slug}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
export const getDetailStory = async (slug) => {
  try {
    const res = await axios.get(`${apiURLOTruyen}/truyen-tranh/${slug}`);
    return res;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const addFavoritesStory = async (
  accessToken,
  storyInfo,
  userId,
  dispatch
) => {
  console.log(storyInfo);
  dispatch(addFavoriteStart());
  try {
    const res = await axios.post(
      `${apiURL}/api/favorites/add`,
      { userId, storyInfo },
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

export const addFavoritesStoryAPI = (token, storyInfo, userId) =>
  axios
    .post(`${apiURL}/api/favorites/add`, { userId, storyInfo }, authHeader(token))
    .then((res) => res.data);
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

//favorite

export const getNumberSaveStory = async (dispatch) => {
  dispatch(getCountFavoritesStart());
  try {
    const res = await axios.get(`${apiURL}/api/favorites/get-all`);
    dispatch(getCountFavoritesSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getCountFavoritesFail(error));
  }
};
export const getFavoritesByUser = async (accessToken, userId, dispatch) => {
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

//history

export const getAllHistory = async (dispatch) => {
  try {
    const res = await axios.get(`${apiURL}/api/history/get-all`);
    dispatch(getCountHistorySuccess(res.data));
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getLastChapter = async (slug, userId) => {
  try {
    const params = userId ? `?userId=${userId}` : '';
    const res = await axios.get(`${apiURL}/api/history/last/${slug}${params}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getHistoryByUser = async (userId) => {
  try {
    const res = await axios.get(`${apiURL}/api/history/user/${userId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getRanking = async (period = 'week') => {
  try {
    const res = await axios.get(`${apiURL}/api/history/ranking?period=${period}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

//category

export const getAllCategory = async () => {
  try {
    const res = await axios.get(`${apiURLOTruyen}/the-loai`);
    if (res.data) return res.data.data;
  } catch (error) {
    console.log(error);
  }
};
export const getStorybyCategory = async (cate) => {
  try {
    const res = await axios.get(`${apiURLOTruyen}/the-loai/${cate}`);
    if (res.data) return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

// error

export const addStoryError = async (
  userID,
  userName,
  nameErr,
  storyInfo,
  accessToken,
  chapterInfo
) => {
  try {
    const res = await axios.post(
      `${apiURL}/api/error/add`,
      {
        userID,
        userName,
        nameErr,
        storyInfo,
        chapterInfo: chapterInfo || "",
      },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllErorr = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/error/get-all`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const deleteStoryError = async (id) => {
  try {
    const res = await axios.delete(`${apiURL}/api/error/delete/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateStoryErrorStatus = async (id, status) => {
  try {
    const res = await axios.put(`${apiURL}/api/error/update-status/${id}`, { status });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// comment

export const addComment = async (accessToken, storySlug, userId, username, content) => {
  try {
    const res = await axios.post(
      `${apiURL}/api/comment/add`,
      { storySlug, userId, username, content },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCommentsByStory = async (slug) => {
  try {
    const res = await axios.get(`${apiURL}/api/comment/${slug}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// story views (tất cả người dùng, kể cả chưa đăng nhập)

export const incrementStoryView = async (slug, storyName) => {
  try {
    const res = await axios.post(`${apiURL}/api/views/increment`, { slug, storyName });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getStoryViewCount = async (slug) => {
  try {
    const res = await axios.get(`${apiURL}/api/views/get/${slug}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return { viewCount: 0 };
  }
};

export const getTotalStoryViews = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/views/total`);
    return res.data;
  } catch (error) {
    console.log(error);
    return { totalViews: 0 };
  }
};