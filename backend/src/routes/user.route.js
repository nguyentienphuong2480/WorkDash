const router = require("express").Router();
const ctrl = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/rbac.middleware");

router.use(auth.verifyToken);

// ===== SELF =====
// router.get("/me", checkPermission("user.read_own"), ctrl.getMe);

// ===== ADMIN / HR =====
router.get("/", checkPermission("user.read"), ctrl.getUsers);
router.get("/recycle-bin", checkPermission("user.recycle"), ctrl.getRecycleBin);
router.get("/:id", checkPermission("user.read"), ctrl.getOne);

router.post("/", checkPermission("user.create"), ctrl.create);
router.put("/:id", checkPermission("user.update"), ctrl.update);
router.patch("/:id/status", checkPermission("user.update"), ctrl.updateStatus);

router.delete("/:id", checkPermission("user.delete"), ctrl.remove);
router.patch("/:id/restore", checkPermission("user.restore"), ctrl.restore);
router.delete("/:id/force", checkPermission("user.force_delete"), ctrl.forceDelete);

module.exports = router;