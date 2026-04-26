const router = require("express").Router();
const ctrl = require("../controllers/attendance.controller");
const auth = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/rbac.middleware");

router.use(auth.verifyToken);

// ===== SELF ACTION =====
router.post("/check-in", ctrl.checkIn);
router.post("/check-out", ctrl.checkOut);

// ===== VIEW =====
router.get("/today", checkPermission("attendance.read"), ctrl.getToday);

// ===== HISTORY =====
router.get("/users/:userId", checkPermission("attendance.read"), ctrl.history);

// ===== LIST =====
router.get("/", checkPermission("attendance.read"), ctrl.getAll);

module.exports = router;