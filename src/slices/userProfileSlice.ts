import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../types';

const initialState: UserProfile[] = [];

const UserProfileSlice = createSlice({
    name: 'UserProfile',
    initialState,
    reducers:{
        addProfileDetails: (state, action:PayloadAction<UserProfile>)=>{
            state.push(action.payload)
        }
    }
})
export const {addProfileDetails} = UserProfileSlice.actions;
export default UserProfileSlice.reducer