import axios from "axios";
import { deleteUserFailed, deleteUserStart, deleteUsersSuccess, getUsersFailed, getUsersStart, getUsersSuccess } from "../../../redux/slice/userSlice";

const apiURL = process.env.REACT_APP_API_URL;

export const getAllUser = async (dispatch,accessToken) => {
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
      console.log(id);
      const res = await axios.delete(`${apiURL}/api/user/delete-user/`+ id, {
        headers: { token: `Bearer ${accessToken}` },
      });
      dispatch(deleteUsersSuccess(res.data));
    } catch (err) {
      dispatch(deleteUserFailed(err.response.data));
      console.log(err)
    }
  };
