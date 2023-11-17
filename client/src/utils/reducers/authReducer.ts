import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  id: Number(localStorage.getItem("user_id")),
  email: "",
  name: "",
  avatarSrc: "",
  token: localStorage.getItem("access_token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      localStorage.setItem("user_id", action.payload.id);
      localStorage.setItem("access_token", action.payload.token);
      return { ...action.payload };
    },
    initialiseAuthUser(state, action) {
      return { ...state, ...action.payload };
    },
    logout() {
      localStorage.removeItem("access_token");
      return initialState;
    },
  },
});

export const { login, logout, initialiseAuthUser } = authSlice.actions;

export default authSlice.reducer;
