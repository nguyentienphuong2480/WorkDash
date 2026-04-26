// src/services/roleService.js
import axiosClient from "./axiosClient";

export const roleService = {
  getAll: () => axiosClient.get('/roles'), // Đường dẫn API của bạn
};