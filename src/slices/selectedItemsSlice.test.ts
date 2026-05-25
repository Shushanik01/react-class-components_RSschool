import reducer, { toggleItem, clearAll } from './selectedItemsSlice';

describe('selectedItemsSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual({ selectedIds: [] });
  });

  it('toggleItem adds id when not present', () => {
    const state = reducer(undefined, toggleItem(1));
    expect(state.selectedIds).toContain(1);
  });

  it('toggleItem removes id when already present', () => {
    let state = reducer(undefined, toggleItem(1));
    state = reducer(state, toggleItem(1));
    expect(state.selectedIds).not.toContain(1);
  });

  it('toggleItem can add multiple different ids', () => {
    let state = reducer(undefined, toggleItem(1));
    state = reducer(state, toggleItem(2));
    state = reducer(state, toggleItem(3));
    expect(state.selectedIds).toEqual([1, 2, 3]);
  });

  it('toggleItem only removes the targeted id', () => {
    let state = reducer(undefined, toggleItem(1));
    state = reducer(state, toggleItem(2));
    state = reducer(state, toggleItem(1));
    expect(state.selectedIds).not.toContain(1);
    expect(state.selectedIds).toContain(2);
  });

  it('clearAll empties all selected ids', () => {
    let state = reducer(undefined, toggleItem(1));
    state = reducer(state, toggleItem(2));
    state = reducer(state, clearAll());
    expect(state.selectedIds).toHaveLength(0);
  });

  it('clearAll on empty state stays empty', () => {
    const state = reducer(undefined, clearAll());
    expect(state.selectedIds).toEqual([]);
  });
});
