import axiosClient from "./axiosClient";

export const dashboardService = {
  getStats: () => axiosClient.get("/dashboard/stats"),
  getAttendanceChart: () => axiosClient.get("/dashboard/attendance-chart"),
  getSalaryChart: () => axiosClient.get("/dashboard/salary-chart"),
};