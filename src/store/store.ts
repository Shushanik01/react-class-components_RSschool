import { configureStore } from '@reduxjs/toolkit';
import pokemonListReducer from '../slices/pokemonListSlice';
import selectedItemsReducer from '../slices/selectedItemsSlice';
import { pokemonApi } from '../api/api';
import userInfoReducer from '../slices/userInfoSlice';
import userProfileReducer from '../slices/userProfileSlice';

const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    pokemonList: pokemonListReducer,
    selectedItems: selectedItemsReducer,
    userInfo: userInfoReducer,
    userProfile: userProfileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
