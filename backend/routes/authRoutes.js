const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

/**
 * Auth Routes
 *
 * POST /api/auth/register — create a new user account
 * POST /api/auth/login    — log in with email and password
 *
 * Both routes are public (no JWT required).
 */
router.post("/register", register);
router.post("/login", login);

module.exports = router;
