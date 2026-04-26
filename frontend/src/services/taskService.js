import axiosClient from "./axiosClient";

export const taskService = {
  // ===== CRUD =====
  getList: () => axiosClient.get("/tasks"),
  create: (data) => axiosClient.post("/tasks", data),
  update: (id, data) => axiosClient.put(`/tasks/${id}`, data),
  delete: (id) => axiosClient.delete(`/tasks/${id}`),

  // ===== FILTER =====
  getByProject: (projectId) =>
    axiosClient.get(`/tasks/project/${projectId}`),

  // ===== ASSIGN =====
  assign: (taskId, user_id) =>
    axiosClient.post(`/tasks/${taskId}/assign`, { user_id }),
};