const express = require('express');
const router = express.Router();
const preferencesController = require("../controller/preferencesController");
const { authenticateToken } = require('../middleware/authMiddleware');
const { preferenceRateLimitMiddleware } = require('../middleware/rateLimiter');

router.get("/", authenticateToken, preferencesController.getUserPreferences);
router.put("/", authenticateToken, preferenceRateLimitMiddleware,  preferencesController.updateUserPreferences);

module.exports = router;