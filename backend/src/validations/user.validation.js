const { body, param } = require("express-validator");

exports.createUser = [
  body("username")
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 4 }).withMessage("Username min 4 chars"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password min 6 chars"),

  body("email")
    .isEmail().withMessage("Invalid email"),

  body("role_id")
    .isInt().withMessage("Role is invalid")
];

exports.updateUser = [
  param("id").isInt(),
  body("email").optional().isEmail()
];
