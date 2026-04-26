// src/services/attendanceService.js

import axiosClient from "./axiosClient";

export const attendanceService = {
  // CHECK IN
  checkIn: () => axiosClient.post("/attendance/check-in"),

  // CHECK OUT
  checkOut: () => axiosClient.post("/attendance/check-out"),

  // LẤY HÔM NAY
  getToday: () => axiosClient.get("/attendance/today"),

  // LẤY DANH SÁCH (admin hoặc user)
  getList: (params) => axiosClient.get("/attendance", { params }),

  // HISTORY USER
  getHistory: (userId) => axiosClient.get(`/attendance/users/${userId}`),
};