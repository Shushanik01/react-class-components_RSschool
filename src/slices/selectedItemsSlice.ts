import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SelectedItemsState {
  selectedIds: number[];
}

const initialState: SelectedItemsState = {
  selectedIds: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleItem(state, action: PayloadAction<number>) {
      const id = action.payload;
      const index = state.selectedIds.indexOf(id);
      if (index === -1) {
        state.selectedIds.push(id);
      } else {
        state.selectedIds.splice(index, 1);
      }
    },
    clearAll(state) {
      state.selectedIds = [];
    },
  },
});

export const { toggleItem, clearAll } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
