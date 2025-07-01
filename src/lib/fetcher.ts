import axios from "axios";
import { useSessionStore } from "../store";

export const API_URL = "https://ciucbc.pythonanywhere.com/api/v01";
export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = useSessionStore.getState().accessToken;
    // console.log("Token d'accès:", token); // Debugging line
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export const authApi = axios.create({
  baseURL: "https://ciucbc.pythonanywhere.com/auth",
  // withCredentials: true,
});

authApi.interceptors.request.use(
  (config) => {
    const token = useSessionStore.getState().accessToken;
    // console.log("Token d'accès:", token); // Debugging line
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default api;
