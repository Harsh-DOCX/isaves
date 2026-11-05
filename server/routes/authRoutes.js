const express = require("express");
const {
    forgotPassword,
    getCurrentUser,
    googleLogin,
    login,
    logout,
    resetPassword,
    signup,
    updateProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const {
    authLimiter,
    passwordResetLimiter,
} = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/google", authLimiter, googleLogin);
router.get("/me", authMiddleware, getCurrentUser);
router.put("/profile", authMiddleware, updateProfile);
router.post("/logout", logout);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", passwordResetLimiter, resetPassword);

module.exports = router;
