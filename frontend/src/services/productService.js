import axiosClient from "./axiosClient";

export const productService = {
  getList: () => axiosClient.get("/projects"),
  create: (data) => axiosClient.post("/projects", data),
  update: (id, data) => axiosClient.put(`/projects/${id}`, data),
  delete: (id) => axiosClient.delete(`/projects/${id}`),

  addEmployees: (projectId, user_ids) =>
    axiosClient.post(`/projects/${projectId}/members`, { user_ids }),
  changeManager: (projectId, manager_id) =>
    axiosClient.patch(`/projects/${projectId}/manager`, { manager_id }),

  recycleBin: () => axiosClient.get("/projects/recycle-bin"),
  restore: (id) => axiosClient.patch(`/projects/${id}/restore`),
  forceDelete: (id) => axiosClient.delete(`/projects/${id}/force`),
};