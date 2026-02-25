import axios from "axios";
import {
  loginFail,
  loginStart,
  loginSuccess,
  logoutFail,
  logoutStart,
  logoutSuccess,
  registerFail,
  registerStart,
  registerSuccess,
} from "../redux/slice/authSlice";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());

  try {
    const res = await axios.post(
      "http://localhost:8000/api/auth/login",
      user
    );

    dispatch(loginSuccess(res.data));
    navigate("/");

    return res.data; // optional
  } catch (error) {
    dispatch(loginFail());

    throw error; // 🔥 QUAN TRỌNG
  }
};


export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post("http://localhost:8000/api/auth/register", user);
    dispatch(registerSuccess());
    navigate("/login");
  } catch (error) {
    dispatch(registerFail());
  }
};
export const logOut = async (dispatch, id, navigate, accessToken) => {
  dispatch(logoutStart());
  try {
    await axios.post("http://localhost:8000/api/auth/logout",
      id,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(logoutSuccess());
    navigate("/login");
  } catch (err) {
    // Token hết hạn hoặc lỗi -> vẫn đăng xuất ở client
    dispatch(logoutSuccess());
    navigate("/login");
  }
};
export const changePasswordUser = async (userId, currentPassword, newPassword) => {
  try {
    await axios.post(`http://localhost:8000/api/auth/change-password`, userId, currentPassword, newPassword)
  } catch (error) {
    console.log(error)
  }
}

export const googleLogin = async (credential, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(
      "http://localhost:8000/api/auth/google-login",
      { credential }
    );
    dispatch(loginSuccess(res.data));
    navigate("/");
    return res.data;
  } catch (error) {
    dispatch(loginFail());
    throw error;
  }
};
