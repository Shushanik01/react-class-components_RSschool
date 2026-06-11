import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../types';

export const COUNTRIES = [
  'Armenia',
  'Australia',
  'Canada',
  'France',
  'Germany',
  'India',
  'Italy',
  'Japan',
  'Mexico',
  'Russia',
  'Spain',
  'Ukraine',
  'United Kingdom',
  'United States',
];

const initialState = {
  profiles: [] as UserProfile[],
  countries: COUNTRIES,
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    addProfileDetails: (state, action: PayloadAction<UserProfile>) => {
      state.profiles.push(action.payload);
    },
  },
});

export const { addProfileDetails } = userProfileSlice.actions;
export default userProfileSlice.reducer;
