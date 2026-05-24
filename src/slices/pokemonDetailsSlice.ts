import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData } from '../services/api';
import type { Item } from '../types';

interface PokemonDetailsState {
  details: Item | null;
  loading: boolean;
  error: string | null;
}

const initialState: PokemonDetailsState = {
  details: null,
  loading: false,
  error: null,
};

export const fetchPokemonDetails = createAsyncThunk(
  'pokemonDetails/fetch',
  async (id: string, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    try {
      return await getData(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const pokemonDetailsSlice = createSlice({
  name: 'pokemonDetails',
  initialState,
  reducers: {
    clearDetails(state) {
      state.details = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemonDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.details = null;
      })
      .addCase(fetchPokemonDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchPokemonDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDetails } = pokemonDetailsSlice.actions;
export default pokemonDetailsSlice.reducer;
