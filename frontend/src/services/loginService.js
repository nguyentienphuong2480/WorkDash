import axiosClient from "./axiosClient";

export const loginService = {
  login: (data) => axiosClient.post("/auth/login", data),

  refreshToken: (refreshToken) =>
    axiosClient.post("/auth/refresh-token", { refreshToken }),

  logout: (refreshToken) =>
    axiosClient.post("/auth/logout", { refreshToken }),

  getMe: () => axiosClient.get("/auth/me"),
};