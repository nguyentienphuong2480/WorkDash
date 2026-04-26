import axiosClient from "./axiosClient";

export const projectService = {
  // ===== CRUD =====
  getList: () => axiosClient.get("/projects"),
  create: (data) => axiosClient.post("/projects", data),
  update: (id, data) => axiosClient.put(`/projects/${id}`, data),
  softDelete: (id) => axiosClient.delete(`/projects/${id}`),

  // ===== MANAGER =====
  updateManager: (id, manager_id) =>
    axiosClient.patch(`/projects/${id}/manager`, { manager_id }),

  // ===== RECYCLE BIN =====
  getRecycleBin: () => axiosClient.get("/projects/recycle-bin"),
  restore: (id) => axiosClient.patch(`/projects/${id}/restore`),
  forceDelete: (id) => axiosClient.delete(`/projects/${id}/force`),
};