const { body } = require("express-validator");

exports.login = [
  body("username").notEmpty(),
  body("password").notEmpty()
];

exports.refresh = [
  body("refreshToken").notEmpty()
];
