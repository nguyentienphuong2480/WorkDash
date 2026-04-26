const router = require("express").Router();
const ctrl = require("../controllers/profile.controller");
const auth = require("../middlewares/auth.middleware");

router.use(auth.verifyToken);

router.post("/", ctrl.create);
router.get("/:userId", ctrl.getByUser);
router.put("/:userId", ctrl.update);

module.exports = router;
