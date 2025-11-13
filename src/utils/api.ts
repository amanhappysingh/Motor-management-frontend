import axios from "axios";
import { useAuthStore } from "../store/auth";
import { URL } from "./urls";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: URL.baseUrl,
  withCredentials: true,
});

// =================== REQUEST INTERCEPTOR ===================
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// =================== RESPONSE INTERCEPTOR ===================

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const { refreshToken, logout, login, user } = useAuthStore.getState();

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = "Bearer " + token;
          return api(original);
        });
      }

      isRefreshing = true;

      try {
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const newAccessToken = refreshRes.data.access_token;
        const newRefreshToken = refreshRes.data.refresh_token; // if backend returns

        login(user!, newAccessToken, newRefreshToken);

        api.defaults.headers.Authorization = "Bearer " + newAccessToken;
        processQueue(null, newAccessToken);
        return api(original);

      } catch (err) {
        processQueue(err, null);
        toast.success("Session expired please login again.")
        logout();
        window.location.href = "/login";
        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
