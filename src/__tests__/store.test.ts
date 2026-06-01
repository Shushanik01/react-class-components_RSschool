import store from '../store/store';

describe('store', () => {
  it('creates the store with the correct slice keys', () => {
    const state = store.getState();
    expect(state).toHaveProperty('pokemonAPI');
    expect(state).toHaveProperty('pokemonList');
    expect(state).toHaveProperty('selectedItems');
  });

  it('initializes pokemonList with default values', () => {
    const { pokemonList } = store.getState();
    expect(pokemonList.loading).toBe(false);
    expect(pokemonList.items).toEqual([]);
    expect(pokemonList.error).toBeNull();
  });

  it('initializes selectedItems with empty ids', () => {
    const { selectedItems } = store.getState();
    expect(selectedItems.selectedIds).toEqual([]);
  });
});
