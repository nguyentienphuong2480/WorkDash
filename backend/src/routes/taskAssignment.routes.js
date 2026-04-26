const router = require("express").Router();
const ctrl = require("../controllers/taskAssignment.controller");

// giao task cho user
router.post("/tasks/:taskId/assign", ctrl.assign);

// thu hồi task
router.delete("/tasks/:taskId/assign/:userId", ctrl.unassign);

// danh sách user của task
router.get("/tasks/:taskId/assignees", ctrl.listAssignees);

// danh sách task của user
router.get("/users/:userId/tasks", ctrl.listUserTasks);

module.exports = router;
