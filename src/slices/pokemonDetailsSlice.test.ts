import reducer, { clearDetails, fetchPokemonDetails } from './pokemonDetailsSlice';
import type { Item } from '../types';

const mockItem: Item = {
  id: 1,
  name: 'bulbasaur',
  weight: 69,
  types: [{ type: { name: 'grass' } }],
  abilities: [{ ability: { name: 'overgrow' } }],
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
};

describe('pokemonDetailsSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual({
      details: null,
      loading: false,
      error: null,
    });
  });

  it('clearDetails sets details and error to null', () => {
    const state = reducer(
      { details: mockItem, loading: false, error: 'some error' },
      clearDetails()
    );
    expect(state.details).toBeNull();
    expect(state.error).toBeNull();
  });

  it('fetchPokemonDetails.pending sets loading true and clears state', () => {
    const state = reducer(
      { details: mockItem, loading: false, error: null },
      { type: fetchPokemonDetails.pending.type }
    );
    expect(state.loading).toBe(true);
    expect(state.details).toBeNull();
    expect(state.error).toBeNull();
  });

  it('fetchPokemonDetails.fulfilled sets details and loading false', () => {
    const state = reducer(
      undefined,
      { type: fetchPokemonDetails.fulfilled.type, payload: mockItem }
    );
    expect(state.loading).toBe(false);
    expect(state.details).toEqual(mockItem);
  });

  it('fetchPokemonDetails.rejected sets error and loading false', () => {
    const state = reducer(
      undefined,
      { type: fetchPokemonDetails.rejected.type, payload: 'Pokemon not found' }
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Pokemon not found');
  });
});
