import { configureStore } from '@reduxjs/toolkit';
import pokemonListReducer from '../slices/pokemonListSlice';
import pokemonDetailsReducer from '../slices/pokemonDetailsSlice';
import selectedItemsReducer from '../slices/selectedItemsSlice';

const store = configureStore({
  reducer: {
    pokemonList: pokemonListReducer,
    pokemonDetails: pokemonDetailsReducer,
    selectedItems: selectedItemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
