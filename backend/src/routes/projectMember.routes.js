const router = require("express").Router();
const ctrl = require("../controllers/projectMember.controller");

router.post("/projects/:id/members", ctrl.add);
router.delete("/projects/:id/members/:userId", ctrl.remove);
router.get("/projects/:id/members", ctrl.list);

module.exports = router;
