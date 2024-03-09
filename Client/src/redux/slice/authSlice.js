import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
    register: {
      isFetching: false,
      error: false,
      success: false,
    },
    logout: {
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.error = false;
    },
    loginFail: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    // register
    registerStart: (state) => {
      state.register = {
        ...state.register,
        isFetching: true,
      };
    },
    registerSuccess: (state) => {
      state.register = {
        ...state.register,
        isFetching: false,
        success: true,
        error: false,
      };
    },
    registerFail: (state) => {
      state.register = {
        ...state.register,
        isFetching: false,
        success: false,
        error: true,
      };
    },
    //logout
    logoutStart: (state) => {
      state.logout = {
        ...state.logout,
        isFetching: true,
      };
    },
    logoutSuccess: (state) => {
      state.logout = {
        ...state.logout,
        isFetching: false,
        success: true,
        error: false,
      };
    },
    logoutFail: (state) => {
      state.logout = {
        ...state.logout,
        isFetching: false,
        success: false,
        error: true,
      };
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFail,
  registerStart,
  registerSuccess,
  registerFail,
  logoutStart,
  logoutSuccess,
  logoutFail,
} = authSlice.actions;

export default authSlice.reducer;
