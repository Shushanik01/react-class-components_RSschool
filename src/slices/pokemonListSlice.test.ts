import reducer, {
  setSearchTerm,
  setCurrentPage,
  selectTotalPages,
  fetchPokemonList,
} from './pokemonListSlice';

describe('pokemonListSlice', () => {
  it('returns initial state with defaults', () => {
    const state = reducer(undefined, { type: '' });
    expect(state.loading).toBe(false);
    expect(state.items).toEqual([]);
    expect(state.error).toBeNull();
    expect(state.totalCount).toBe(0);
  });

  it('setSearchTerm updates searchTerm', () => {
    const state = reducer(undefined, setSearchTerm('pikachu'));
    expect(state.searchTerm).toBe('pikachu');
  });

  it('setSearchTerm resets currentPage to 1', () => {
    let state = reducer(undefined, setCurrentPage(5));
    state = reducer(state, setSearchTerm('pikachu'));
    expect(state.currentPage).toBe(1);
  });

  it('setCurrentPage updates currentPage', () => {
    const state = reducer(undefined, setCurrentPage(7));
    expect(state.currentPage).toBe(7);
  });

  it('selectTotalPages calculates correctly', () => {
    const storeState = {
      pokemonList: {
        items: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalCount: 100,
        searchTerm: '',
      },
    };
    expect(selectTotalPages(storeState as never)).toBe(5);
  });

  it('selectTotalPages rounds up', () => {
    const storeState = {
      pokemonList: {
        items: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalCount: 21,
        searchTerm: '',
      },
    };
    expect(selectTotalPages(storeState as never)).toBe(2);
  });

  it('fetchPokemonList.pending sets loading true and clears error', () => {
    const state = reducer(undefined, { type: fetchPokemonList.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchPokemonList.fulfilled sets items and loading false', () => {
    const payload = {
      results: [{ id: 1, name: 'bulbasaur' }],
      count: 1,
    };
    const state = reducer(undefined, {
      type: fetchPokemonList.fulfilled.type,
      payload,
    });
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(payload.results);
    expect(state.totalCount).toBe(1);
  });

  it('fetchPokemonList.rejected sets error and clears items', () => {
    const state = reducer(undefined, {
      type: fetchPokemonList.rejected.type,
      payload: 'Pokemon not found',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Pokemon not found');
    expect(state.items).toEqual([]);
  });
});
