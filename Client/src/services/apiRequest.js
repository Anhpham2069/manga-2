import axios from "axios";
import {
  loginFail,
  loginStart,
  loginSuccess,
  logoutStart,
  logoutSuccess,
  registerFail,
  registerStart,
  registerSuccess,
} from "../redux/slice/authSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
  try {
    const res = await axios.post("http://localhost:8000/api/auth/login", user);
    dispatch(loginSuccess(res.data));
    navigate("/");
  } catch (error) {
    dispatch(loginFail());
  }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
  try {
    await axios.post("http://localhost:8000/api/auth/register", user);
    dispatch(registerSuccess());
    navigate("/");
  } catch (error) {
    dispatch(registerFail());
  }
};
export const logoutUser = async (user, dispatch, navigate) => {
    dispatch(logoutStart());
  try {
    await axios.post("http://localhost:8000/api/auth/logout", user);
    dispatch(logoutSuccess());
    navigate("/");
  } catch (error) {
    dispatch(loginFail());
  }
};
