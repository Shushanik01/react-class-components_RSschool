import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserInfo } from '../components/userInfo/userSchema';

export type { UserInfo };

const initialState: UserInfo[] = [];

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    addUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.push(action.payload);
    },
  },
});

export const { addUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
