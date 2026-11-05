const { rateLimit } = require("express-rate-limit");
const { isProduction } = require("../config");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 50 : 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many authentication attempts. Please try again later." },
});

const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 5 : 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many password reset attempts. Please try again later." },
});

module.exports = { authLimiter, passwordResetLimiter };
