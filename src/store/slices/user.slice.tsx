import { createSlice } from "@reduxjs/toolkit";
//import { User } from "firebase/auth";

import { RootState } from "../store";

interface UserState {
  currentUser: {
    email: string;
  } | null;
}

const INITIAL_STATE: UserState = {
  currentUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
  },
});

export const selectCurrentUser = (state: RootState) => state.user.currentUser;

export const { setCurrentUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
