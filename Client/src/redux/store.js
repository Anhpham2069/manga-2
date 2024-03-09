import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// import StoriesSlice from '../components/Stories/StoriesSlice';
import darkModeReducer  from '../components/layout/DarkModeSlice';
import searchReducer  from './slice/searchSlice';
import genreReducer  from './slice/genreSlice';
import storyReducer from './slice/storiesSlice'
import authReducer from './slice/authSlice';


const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}
const rootReducer =  combineReducers({
  darkMode: darkModeReducer,
  search: searchReducer,
  genres: genreReducer,
  stories: storyReducer,
  auth: authReducer,
},)

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)
