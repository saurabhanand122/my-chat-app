import axios from "axios";
import { BACKEND_BASE_URL } from "./config.js";

export const axiosInstance = axios.create({
  baseURL: `${BACKEND_BASE_URL}/api`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
