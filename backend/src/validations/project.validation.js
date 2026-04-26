const { body, param } = require("express-validator");

exports.createProject = [
  body("name")
    .notEmpty().withMessage("Project name required")
    .isLength({ min: 3 }),

  body("start_date")
    .isISO8601().withMessage("Invalid start date"),

  body("end_date")
    .optional()
    .isISO8601().withMessage("Invalid end date")
];

exports.projectId = [
  param("id").isInt()
];
