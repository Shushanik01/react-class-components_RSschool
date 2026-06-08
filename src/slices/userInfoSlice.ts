import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  name: string;
  email: string;
  gender: string;
  age: number;
  termsAccepted: boolean;
}

const initialState:UserInfo[] = [];

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers : {
        addUserInfo:(state, action: PayloadAction<UserInfo>)=> {
            state.push(action.payload)
        }
    }
})
export const {addUserInfo} = userInfoSlice.actions;
export default userInfoSlice.reducer