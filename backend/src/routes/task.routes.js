const router = require("express").Router();
const ctrl = require("../controllers/task.controller");
const auth = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/rbac.middleware");

router.use(auth.verifyToken);

// ===== VIEW =====
router.get("/", checkPermission("task.read"), ctrl.getList);
router.get("/project/:projectId", checkPermission("task.read"), ctrl.getByProject);

// ===== CREATE =====
router.post("/", checkPermission("task.create"), ctrl.create);

// ===== ASSIGN =====
router.post("/:taskId/assign", checkPermission("task.assign"), ctrl.assignTask);

// ===== UPDATE =====
router.put("/:id", checkPermission("task.update"), ctrl.update);

// ===== DELETE =====
router.delete("/:id", checkPermission("task.delete"), ctrl.remove);

module.exports = router;