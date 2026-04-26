const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const projectRoutes = require("./project.routes");
const projectMemberRoutes = require("./projectMember.routes");
const taskRoutes = require("./task.routes");
const contractRoutes = require("./contract.routes");
const attendanceRoutes = require("./attendance.routes");
const newsRoutes = require("./news.routes");
const dashboardRoutes = require("./dashboard.routes");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");
const roleRoutes = require("./role.routes");

/* ================= PUBLIC ROUTES ================= */
router.use("/auth", authRoutes);

/* ================ PROTECTED ROUTES ================ */
router.use(verifyToken);

/* ===== Routes for all authenticated users ===== */
router.use("/projects", projectRoutes);
router.use(projectMemberRoutes);
router.use("/tasks", taskRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/news", newsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/roles", roleRoutes);

/* ===== Admin / Manager only ===== */
router.use("/users", userRoutes);
router.use("/contracts", contractRoutes);

module.exports = router;
