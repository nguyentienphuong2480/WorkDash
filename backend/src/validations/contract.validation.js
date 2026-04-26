const { body } = require("express-validator");

exports.createContract = [
  body("user_id").isInt(),
  body("type").notEmpty(),
  body("start_date").isISO8601(),
  body("end_date").isISO8601(),
  body("salary").isNumeric()
];
