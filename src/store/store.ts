import { configureStore } from '@reduxjs/toolkit';
import pokemonListReducer from '../slices/pokemonListSlice';
import selectedItemsReducer from '../slices/selectedItemsSlice';
import { pokemonApi } from '../api/api';

const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    pokemonList: pokemonListReducer,
    selectedItems: selectedItemsReducer,
  },
  middleware: (getDefaultMiddleware)=> getDefaultMiddleware().concat(pokemonApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
