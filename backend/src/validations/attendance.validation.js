const { body } = require("express-validator");

exports.checkIn = [
  body("user_id").isInt(),
  body("check_in").isISO8601()
];

exports.checkOut = [
  body("check_out").isISO8601()
];
