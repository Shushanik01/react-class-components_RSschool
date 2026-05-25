import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getData, getAllData } from '../services/api';
import type { Item } from '../types';

const ITEMS_PER_PAGE = 20;

interface PokemonListState {
  items: Item[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  searchTerm: string;
}

const initialState: PokemonListState = {
  items: [],
  loading: false,
  error: null,
  currentPage: Number(
    new URLSearchParams(window.location.search).get('page') || 1
  ),
  totalCount: 0,
  searchTerm: localStorage.getItem('searchTerm') || '',
};

export const fetchPokemonList = createAsyncThunk(
  'pokemonList/fetch',
  async (
    { searchTerm, page }: { searchTerm: string; page: number },
    { rejectWithValue }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      if (searchTerm.trim()) {
        const item = await getData(searchTerm.trim());
        return { results: [item], count: 1 };
      }
      const offset = (page - 1) * ITEMS_PER_PAGE;
      return await getAllData(offset, ITEMS_PER_PAGE);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const pokemonListSlice = createSlice({
  name: 'pokemonList',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemonList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemonList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchPokemonList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.items = [];
      });
  },
});

export const { setSearchTerm, setCurrentPage } = pokemonListSlice.actions;

export const selectTotalPages = (state: { pokemonList: PokemonListState }) =>
  Math.ceil(state.pokemonList.totalCount / ITEMS_PER_PAGE);

export default pokemonListSlice.reducer;
