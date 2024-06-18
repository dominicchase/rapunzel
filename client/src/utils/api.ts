import axios, { AxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAuthData,
  removeAuthData,
} from "./auth";

const baseURL = import.meta.env.BASE_URL;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post("/refresh", { refreshToken });
          if (response.status === 200) {
            const {
              accessToken,
              refreshToken: newRefreshToken,
              id,
            } = response.data;
            setAuthData(accessToken, newRefreshToken, id);
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          removeAuthData();
          window.location.href = "/auth";
        }
      } else {
        removeAuthData();
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

export function getBacklog(params: {
  userId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  page?: number;
  size?: number;
}) {
  const config: AxiosRequestConfig = {
    params: {
      userId: params.userId,
      status: params.status,
      page: params.page,
      size: params.size,
    },
  };

  return api.get("/backlog", config);
}

export default api;
