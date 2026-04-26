const router = require("express").Router();
const ctrl = require("../controllers/project.controller");
const auth = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/rbac.middleware");

router.use(auth.verifyToken);

// ===== VIEW =====
router.get("/", checkPermission("project.read"), ctrl.getList);

// ===== CREATE =====
router.post("/", checkPermission("project.create"), ctrl.create);

// ===== UPDATE =====
router.put("/:id", checkPermission("project.update"), ctrl.update);

// ===== UPDATE MANAGER =====
router.patch("/:id/manager", checkPermission("project.assign_manager"), ctrl.updateManager);

// ===== DELETE =====
router.delete("/:id", checkPermission("project.delete"), ctrl.softDelete);

// ===== RECYCLE BIN =====
router.get("/recycle-bin", checkPermission("project.read"), ctrl.getRecycleBin);
router.patch("/:id/restore", checkPermission("project.restore"), ctrl.restore);
router.delete("/:id/force", checkPermission("project.delete"), ctrl.forceDelete);

module.exports = router;