import axios from "axios";

const BACKEND_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

export const axiosInstance = axios.create({
  baseURL: `${BACKEND_BASE_URL}/api`,
  withCredentials: true,
});
