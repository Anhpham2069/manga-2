import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: {
            allUsers: null,
            isFetching: false,
            error: false
        },
        msg: "",
    },
    reducers: {
        getUsersStart: (state) => {
            state.users.isFetching = true;
        },
        getUsersSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.allUsers = action.payload;
        },
        getUsersFailed: (state) => {
            state.users.isFetching = false;
            state.users.error = true;
        },
        deleteUserStart: (state) => {
            state.users.isFetching = true;
        },
        deleteUsersSuccess: (state, action) => {
            state.users.isFetching = false;
            state.msg = action.payload;
        },
        deleteUserFailed: (state, action) => {
            state.users.isFetching = false;
            state.users.error = true;
            state.msg = action.payload;
        },
        updateUserStart: (state) => {
            state.users.isFetching = true;
        },
        updateUserSuccess: (state, action) => {
            state.users.isFetching = false;
            // Cập nhật user trong danh sách
            if (state.users.allUsers) {
                const index = state.users.allUsers.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users.allUsers[index] = action.payload;
                }
            }
        },
        updateUserFailed: (state, action) => {
            state.users.isFetching = false;
            state.users.error = true;
            state.msg = action.payload;
        },
    }
})

export const {
    getUsersStart,
    getUsersSuccess,
    getUsersFailed,
    deleteUserStart,
    deleteUsersSuccess,
    deleteUserFailed,
    updateUserStart,
    updateUserSuccess,
    updateUserFailed,
} = userSlice.actions;

export default userSlice.reducer;