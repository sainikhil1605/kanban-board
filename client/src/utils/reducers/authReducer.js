import { createSlice } from "@reduxjs/toolkit";
const initialState = localStorage.getItem("access_token");

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      localStorage.setItem("access_token", action.payload);
      return action.payload;
    },
    logout(state, action) {
      localStorage.removeItem("access_token");
      return null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
