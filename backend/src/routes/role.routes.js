const router = require("express").Router();
const ctrl = require("../controllers/role.controller");
const auth = require("../middlewares/auth.middleware");

// router.use(auth.verifyToken);

router.post("/", ctrl.create);
router.get("/", ctrl.getAll);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
