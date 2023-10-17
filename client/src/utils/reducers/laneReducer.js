import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const laneReducer = createSlice({
  name: "lane",
  initialState,
  reducers: {
    initialiseLanes(state, action) {
      return action.payload;
    },
    addLanes(state, action) {
      console.log(action);
      return [...state, action.payload];
    },
  },
});
export const { addLanes, initialiseLanes } = laneReducer.actions;

export default laneReducer.reducer;
