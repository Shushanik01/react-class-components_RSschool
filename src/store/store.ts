import { configureStore } from '@reduxjs/toolkit';
import pokemonListReducer from '../slices/pokemonListSlice';
import pokemonDetailsReducer from '../slices/pokemonDetailsSlice';
import selectedItemsReducer from '../slices/selectedItemsSlice';
import { pokemonApi } from '../api/api';

const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    pokemonList: pokemonListReducer,
    pokemonDetails: pokemonDetailsReducer,
    selectedItems: selectedItemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
