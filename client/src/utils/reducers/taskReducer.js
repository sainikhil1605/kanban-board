import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const taskReducer = createSlice({
  name: "task",
  initialState,
  reducers: {
    initialiseTasks(state, action) {
      return action.payload;
    },
    addTask(state, action) {
      console.log(action);
      return [...state, action.payload];
    },
  },
});
export const { addTask, initialiseTasks } = taskReducer.actions;

export default taskReducer.reducer;
