const express = require('express');
const router = express.Router();
const authController = require("../controller/authController");
const { registerRateLimitMiddleware, loginRateLimitMiddleware } = require('../middleware/rateLimiter');

router.post("/signup", registerRateLimitMiddleware, authController.userRegister);
router.get("/verify-email", authController.verifyEmail);
router.post("/login", loginRateLimitMiddleware, authController.userLogin);

module.exports = router;