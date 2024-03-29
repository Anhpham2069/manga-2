import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
    name:"story",
    initialState:{
        storys: {
            allstorys:null,
            isFetching:false,
            error:false
        },
        msg:"",
    },
    reducers:{
        getstorysStart: (state)=>{
            state.storys.isFetching = true;
        },
        getstorysSuccess: (state,action) =>{
            state.storys.isFetching = false;
            state.storys.allstorys = action.payload;
        },
        getstorysFailed: (state) => {
            state.storys.isFetching = false;
            state.storys.error = true;
        },
        deletestoryStart: (state)=>{
            state.storys.isFetching = true;
        },
        deletestorysSuccess: (state,action)=>{
            state.storys.isFetching = false;
            state.msg = action.payload;
        },
        deletestoryFailed: (state,action)=>{
            state.storys.isFetching = false;
            state.storys.error = true;
            state.msg = action.payload;
        } 
    }
})

export const {
    getstorysStart,
    getstorysSuccess,
    getstorysFailed,
    deletestoryStart,
    deletestorysSuccess,
    deletestoryFailed
} = storySlice.actions;

export default storySlice.reducer;