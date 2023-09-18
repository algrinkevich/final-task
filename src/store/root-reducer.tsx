import { combineReducers } from "@reduxjs/toolkit";

import { entriesReducer } from "./slices/entries.slice";
import { userReducer } from "./slices/user.slice";

export const rootReducer = combineReducers({
  user: userReducer,
  entries: entriesReducer,
});
