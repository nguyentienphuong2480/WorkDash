const dashboardService = require("../services/dashboard.service");

exports.getStats = async (req, res) => {
  try {
    const data = await dashboardService.getOverviewStats();
    res.json({ data: data ?? {} });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.getAttendanceChart = async (req, res) => {
  try {
    const data = await dashboardService.getAttendanceData();
    res.json({ data: Array.isArray(data) ? data : [] });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.getSalaryChart = async (req, res) => {
  try {
    const data = await dashboardService.getSalaryData();
    res.json({ data: Array.isArray(data) ? data : [] });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};