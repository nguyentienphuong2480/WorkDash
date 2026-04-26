const { body } = require("express-validator");

exports.createNews = [
  body("title")
    .notEmpty()
    .isLength({ min: 5 }),

  body("content")
    .notEmpty(),

  body("status")
    .isIn(["draft", "published"])
];
