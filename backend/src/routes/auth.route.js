const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/me", verifyToken, authController.me);

module.exports = router;
