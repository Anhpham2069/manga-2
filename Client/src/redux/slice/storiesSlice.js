import { createSlice } from '@reduxjs/toolkit';

const storiesSlice = createSlice({
  name: 'stories',
  initialState:{stories: []},
  reducers: {
    setStories: (state, action) => {
      state.stories = action.payload
    },
    addStory: (state, action) => {
      state.stories.push(action.payload);
      console.log('New state:', state.stories);

    },
    deleteStoryById: (state, action) => {   
      const storyIdToDelete = action.payload;
      state.stories = state.stories.filter(story => story._id !== storyIdToDelete);
      
    
    },
    updateStoryById: (state, action) => {
      const updatedStory = action.payload;
      const index = state.stories.findIndex((story) => story._id === updatedStory._id);

      if (index !== -1) {
        // Update the story in the array if found
        state.stories[index] = updatedStory;
      }
    },
    
    // other reducers...
  },
});

export const { setStories, addStory,deleteStoryById,updateStoryById } = storiesSlice.actions;
export default storiesSlice.reducer;
