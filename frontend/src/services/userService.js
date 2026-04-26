import axiosClient from "./axiosClient";

export const userService = {
  getList: () => axiosClient.get("/users"),
  create: (data) => axiosClient.post("/users", data),
  update: (id, data) => axiosClient.put(`/users/${id}`, data),
  delete: (id) => axiosClient.delete(`/users/${id}`),

  updateStatus: (id, is_active) =>
    axiosClient.patch(`/users/${id}/status`, { is_active }),

  recycleBin: () => axiosClient.get("/users/recycle-bin"),
  restore: (id) => axiosClient.patch(`/users/${id}/restore`),
  forceDelete: (id) => axiosClient.delete(`/users/${id}/force`),
};