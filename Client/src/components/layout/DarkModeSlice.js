import { createSlice } from '@reduxjs/toolkit';

export const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState: {
    isEnabled: false,
  },
  reducers: {
    toggleDarkMode: state => {
      state.isEnabled = !state.isEnabled;
    },
  },
});

export const { toggleDarkMode } = darkModeSlice.actions;
export const selectDarkMode = state => state.darkMode.isEnabled;
export default darkModeSlice.reducer;