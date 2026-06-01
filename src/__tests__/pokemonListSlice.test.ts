import { configureStore } from '@reduxjs/toolkit';
import pokemonListReducer, {
  fetchPokemonList,
  setSearchTerm,
  setCurrentPage,
  selectTotalPages,
} from '../slices/pokemonListSlice';
import selectedItemsReducer from '../slices/selectedItemsSlice';
import { pokemonApi } from '../api/api';
import { mockItem, mockItems } from './mocks/mockData';

vi.mock('../api/api', () => ({
  pokemonApi: {
    reducerPath: 'pokemonAPI',
    reducer: (state: unknown = {}) => state,
    middleware:
      (_api: unknown) =>
      (next: (a: unknown) => unknown) =>
      (action: unknown) =>
        next(action),
    endpoints: {
      getSinglePokemon: { initiate: vi.fn() },
      getAllPokemons: { initiate: vi.fn() },
    },
  },
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      pokemonList: pokemonListReducer,
      selectedItems: selectedItemsReducer,
    },
  });

describe('pokemonListSlice', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('setSearchTerm updates searchTerm and resets currentPage to 1', () => {
    const store = createTestStore();
    store.dispatch(setCurrentPage(3));
    store.dispatch(setSearchTerm('pikachu'));
    expect(store.getState().pokemonList.searchTerm).toBe('pikachu');
    expect(store.getState().pokemonList.currentPage).toBe(1);
  });

  it('setCurrentPage updates currentPage', () => {
    const store = createTestStore();
    store.dispatch(setCurrentPage(5));
    expect(store.getState().pokemonList.currentPage).toBe(5);
  });

  it('selectTotalPages computes correct number of pages', () => {
    const state = {
      pokemonList: {
        totalCount: 60,
        items: [],
        loading: false,
        error: null,
        currentPage: 1,
        searchTerm: '',
      },
    };
    expect(selectTotalPages(state)).toBe(3);
  });

  it('fetchPokemonList sets loading to true while pending', async () => {
    const store = createTestStore();
    vi.mocked(pokemonApi.endpoints.getAllPokemons.initiate).mockReturnValue(
      (() => Promise.resolve({ data: { results: mockItems, count: 40 } })) as never
    );
    const promise = store.dispatch(fetchPokemonList({ searchTerm: '', page: 1 }));
    expect(store.getState().pokemonList.loading).toBe(true);
    await vi.runAllTimersAsync();
    await promise;
  });

  it('fetchPokemonList fetches all pokemons when searchTerm is empty', async () => {
    const store = createTestStore();
    vi.mocked(pokemonApi.endpoints.getAllPokemons.initiate).mockReturnValue(
      (() => Promise.resolve({ data: { results: mockItems, count: 40 } })) as never
    );
    const promise = store.dispatch(fetchPokemonList({ searchTerm: '', page: 1 }));
    await vi.runAllTimersAsync();
    await promise;
    expect(pokemonApi.endpoints.getAllPokemons.initiate).toHaveBeenCalledWith({
      offset: 0,
      limit: 20,
    });
    expect(store.getState().pokemonList.items).toEqual(mockItems);
    expect(store.getState().pokemonList.totalCount).toBe(40);
    expect(store.getState().pokemonList.loading).toBe(false);
  });

  it('fetchPokemonList fetches single pokemon when searchTerm is provided', async () => {
    const store = createTestStore();
    vi.mocked(pokemonApi.endpoints.getSinglePokemon.initiate).mockReturnValue(
      (() => Promise.resolve({ data: mockItem })) as never
    );
    const promise = store.dispatch(
      fetchPokemonList({ searchTerm: 'bulbasaur', page: 1 })
    );
    await vi.runAllTimersAsync();
    await promise;
    expect(pokemonApi.endpoints.getSinglePokemon.initiate).toHaveBeenCalledWith(
      'bulbasaur'
    );
    expect(store.getState().pokemonList.items).toEqual([mockItem]);
    expect(store.getState().pokemonList.totalCount).toBe(1);
  });

  it('fetchPokemonList rejects when single pokemon result has no data', async () => {
    const store = createTestStore();
    vi.mocked(pokemonApi.endpoints.getSinglePokemon.initiate).mockReturnValue(
      (() => Promise.resolve({ data: null })) as never
    );
    const promise = store.dispatch(
      fetchPokemonList({ searchTerm: 'unknown', page: 1 })
    );
    await vi.runAllTimersAsync();
    await promise;
    expect(store.getState().pokemonList.error).toBe('Pokemon not found');
    expect(store.getState().pokemonList.loading).toBe(false);
  });

  it('fetchPokemonList rejects when all pokemons result has no data', async () => {
    const store = createTestStore();
    vi.mocked(pokemonApi.endpoints.getAllPokemons.initiate).mockReturnValue(
      (() => Promise.resolve({ data: null })) as never
    );
    const promise = store.dispatch(fetchPokemonList({ searchTerm: '', page: 1 }));
    await vi.runAllTimersAsync();
    await promise;
    expect(store.getState().pokemonList.error).toBe('Failed to fetch pokemon list');
    expect(store.getState().pokemonList.loading).toBe(false);
  });

  it('fetchPokemonList sets error when API throws', async () => {
    const store = createTestStore();
    vi.mocked(pokemonApi.endpoints.getAllPokemons.initiate).mockReturnValue(
      (() => Promise.reject(new Error('Network error'))) as never
    );
    const promise = store.dispatch(fetchPokemonList({ searchTerm: '', page: 1 }));
    await vi.runAllTimersAsync();
    await promise;
    expect(store.getState().pokemonList.error).toBe('Network error');
    expect(store.getState().pokemonList.items).toEqual([]);
    expect(store.getState().pokemonList.loading).toBe(false);
  });
});
