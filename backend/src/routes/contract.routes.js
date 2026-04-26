const router = require("express").Router();
const ctrl = require("../controllers/contract.controller");

router.get("/", ctrl.getAll);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

router.post("/users/:userId/contract", ctrl.create);
router.get("/users/:userId/contract", ctrl.getByUser);
router.post("/:id/terminate", ctrl.terminate);

module.exports = router;
