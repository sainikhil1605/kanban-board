import axios from "axios";
import store from "./store";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: store.getState().auth
      ? "Bearer " + store.getState().auth
      : null,
  },
});
export default axiosInstance;
