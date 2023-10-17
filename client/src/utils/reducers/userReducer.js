import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    initialiseUsers(state, action) {
      return action.payload;
    },
    addUsers(state, action) {
      console.log(action);
      return [...state, action.payload];
    },
  },
});
export const { addUsers, initialiseUsers } = userReducer.actions;

export default userReducer.reducer;
