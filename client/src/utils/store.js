import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import taskReducer from "./reducers/taskReducer";
import userReducer from "./reducers/userReducer";
import laneReducer from "./reducers/laneReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    users: userReducer,
    lanes: laneReducer,
  },
});

export default store;
