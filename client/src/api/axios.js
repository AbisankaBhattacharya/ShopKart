import axios from "axios";
import {
  clearStoredAuth,
  getStoredToken,
  notifyUnauthorized,
} from "../utils/authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth();
      notifyUnauthorized();
    }

    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error, fallbackMessage) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.request) {
    return "Unable to reach the server. Please try again.";
  }

  return fallbackMessage;
};

export default api;
