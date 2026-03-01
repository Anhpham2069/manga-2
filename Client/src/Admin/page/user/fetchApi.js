import axios from "axios";
import {
  deleteUserFailed,
  deleteUserStart,
  deleteUsersSuccess,
  getUsersFailed,
  getUsersStart,
  getUsersSuccess,
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
} from "../../../redux/slice/userSlice";

const apiURL = process.env.REACT_APP_API_URL;

export const getAllUser = async (dispatch, accessToken) => {
  dispatch(getUsersStart());
  try {
    const res = await axios.get(`${apiURL}/api/user/all-user`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(getUsersSuccess(res.data));
  } catch (error) {
    dispatch(getUsersFailed());
  }
};

export const deleteUser = async (id, accessToken, dispatch) => {
  dispatch(deleteUserStart());
  try {
    const res = await axios.delete(`${apiURL}/api/user/delete-user/` + id, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(deleteUsersSuccess(res.data));
  } catch (err) {
    dispatch(deleteUserFailed(err.response?.data));
    console.log(err);
  }
};

export const updateUser = async (id, data, accessToken, dispatch) => {
  dispatch(updateUserStart());
  try {
    const res = await axios.put(`${apiURL}/api/user/update-user/${id}`, data, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(updateUserSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateUserFailed(err.response?.data));
    throw err;
  }
};

export const toggleAdmin = async (id, accessToken, dispatch) => {
  dispatch(updateUserStart());
  try {
    const res = await axios.put(
      `${apiURL}/api/user/toggle-admin/${id}`,
      {},
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(updateUserSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateUserFailed(err.response?.data));
    throw err;
  }
};
