const jwt = require("jsonwebtoken");
const { JWT_SECRET, TOKEN_COOKIE } = require("../config");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.[TOKEN_COOKIE];
        const bearerToken = authHeader?.startsWith("Bearer ")
            ? authHeader.replace("Bearer ", "")
            : null;
        const token = bearerToken || cookieToken;

        if (!token) {
            return res.status(401).json({ message: "Authentication required." });
        }

        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.sub);

        if (!user) {
            return res.status(401).json({ message: "Session is no longer valid." });
        }

        req.user = user;
        return next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired session." });
    }
};

module.exports = authMiddleware;
