const { body, param } = require("express-validator");

exports.createTask = [
  body("title")
    .notEmpty().withMessage("Task title required"),

  body("project_id")
    .isInt().withMessage("Invalid project"),

  body("status")
    .optional()
    .isIn(["todo", "in_progress", "done"])
    .withMessage("Invalid status")
];

exports.taskId = [
  param("id").isInt()
];
