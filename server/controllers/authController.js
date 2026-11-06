const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {
    googleClient,
    GOOGLE_CLIENT_ID,
} = require("../config");
const User = require("../models/User");
const {
    clearAuthCookie,
    hashRecoveryAnswer,
    issueToken,
    setAuthCookie,
} = require("../services/securityService");
const { normalizeEmail, sanitizeUser } = require("../utils/users");

const signup = async (req, res) => {
    const { username, email, password, recoveryQuestion, recoveryAnswer } = req.body;

    if (!username || !email || !password || !recoveryQuestion || !recoveryAnswer) {
        return res
            .status(400)
            .json({ message: "Username, email, password, recovery question, and recovery answer are required." });
    }

    if (password.length < 8) {
        return res
            .status(400)
            .json({ message: "Password must be at least 8 characters long." });
    }

    if (recoveryAnswer.trim().length === 0) {
        return res
            .status(400)
            .json({ message: "Recovery answer cannot be empty." });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
        return res.status(409).json({
            message: "An account already exists for this email.",
        });
    }

    const user = await User.create({
        username: username.trim(),
        email: normalizedEmail,
        passwordHash: await bcrypt.hash(password, 10),
        recoveryQuestion: recoveryQuestion.trim(),
        recoveryAnswer: hashRecoveryAnswer(recoveryAnswer),
    });

    setAuthCookie(res, issueToken(user));

    return res.status(201).json({
        user: sanitizeUser(user),
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
        return res.status(401).json({ message: "Invalid email or password." });
    }

    setAuthCookie(res, issueToken(user));

    return res.json({
        user: sanitizeUser(user),
    });
};

const googleLogin = async (req, res) => {
    if (!googleClient || !GOOGLE_CLIENT_ID) {
        return res.status(500).json({ message: "Google authentication is not configured." });
    }

    const {
        credential,
        mode = "login",
        password,
        recoveryQuestion,
        recoveryAnswer,
    } = req.body;
    if (!credential) {
        return res.status(400).json({ message: "Google credential is required." });
    }
    if (mode !== "login" && mode !== "signup") {
        return res.status(400).json({ message: "Google authentication mode is invalid." });
    }

    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified) {
        return res.status(401).json({ message: "Google account email is not verified." });
    }

    const normalizedEmail = normalizeEmail(payload.email);
    let user = await User.findOne({ email: normalizedEmail });
    const needsProfileSetup =
        mode === "signup" &&
        (!user || !user.recoveryQuestion || !user.recoveryAnswer);

    if (needsProfileSetup) {
        if (
            typeof password === "undefined" &&
            typeof recoveryQuestion === "undefined" &&
            typeof recoveryAnswer === "undefined"
        ) {
            return res.json({ requiresSetup: true, email: normalizedEmail });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res
                .status(400)
                .json({ message: "Password must be at least 8 characters long." });
        }

        if (
            typeof recoveryQuestion !== "string" ||
            !recoveryQuestion.trim() ||
            typeof recoveryAnswer !== "string" ||
            !recoveryAnswer.trim()
        ) {
            return res.status(400).json({
                message: "Recovery question and answer are required.",
            });
        }

        const baseUsername =
            (payload.name || normalizedEmail.split("@")[0] || "user")
                .replace(/\s+/g, "_")
                .slice(0, 30) || "user";
        const suffix = crypto.randomBytes(2).toString("hex");

        const passwordHash = await bcrypt.hash(password, 10);
        if (user) {
            user.passwordHash = passwordHash;
            user.recoveryQuestion = recoveryQuestion.trim();
            user.recoveryAnswer = hashRecoveryAnswer(recoveryAnswer);
            await user.save();
        } else {
            user = await User.create({
                username: `${baseUsername}_${suffix}`,
                email: normalizedEmail,
                passwordHash,
                recoveryQuestion: recoveryQuestion.trim(),
                recoveryAnswer: hashRecoveryAnswer(recoveryAnswer),
            });
        }
    } else if (!user) {
        const baseUsername =
            (payload.name || normalizedEmail.split("@")[0] || "user")
                .replace(/\s+/g, "_")
                .slice(0, 30) || "user";
        const suffix = crypto.randomBytes(2).toString("hex");
        user = await User.create({
            username: `${baseUsername}_${suffix}`,
            email: normalizedEmail,
            passwordHash: await bcrypt.hash(crypto.randomBytes(24).toString("hex"), 10),
        });
    }

    setAuthCookie(res, issueToken(user));
    return res.json({ user: sanitizeUser(user) });
};

const getCurrentUser = async (req, res) =>
    res.json({ user: sanitizeUser(req.user) });

const updateProfile = async (req, res) => {
    const { username, mobileNumber, personalInfo, recoveryQuestion, recoveryAnswer } = req.body;
    const updates = {};

    if (typeof username !== "undefined") {
        const trimmedUsername = String(username).trim();
        if (!trimmedUsername) {
            return res.status(400).json({ message: "Username cannot be empty." });
        }
        updates.username = trimmedUsername;
    }

    if (typeof mobileNumber !== "undefined") {
        const trimmedMobile = String(mobileNumber).trim();
        const mobilePattern = /^[+]?[\d\s()-]{7,20}$/;
        if (trimmedMobile && !mobilePattern.test(trimmedMobile)) {
            return res.status(400).json({
                message: "Mobile number format is invalid.",
            });
        }
        updates.mobileNumber = trimmedMobile;
    }

    if (typeof personalInfo !== "undefined") {
        updates.personalInfo = String(personalInfo).trim();
    }

    if (typeof recoveryQuestion !== "undefined") {
        const trimmedQuestion = String(recoveryQuestion).trim();
        if (!trimmedQuestion) {
            return res.status(400).json({ message: "Recovery question cannot be empty." });
        }
        updates.recoveryQuestion = trimmedQuestion;
    }

    if (typeof recoveryAnswer !== "undefined") {
        const trimmedAnswer = String(recoveryAnswer).trim();
        if (!trimmedAnswer) {
            return res.status(400).json({ message: "Recovery answer cannot be empty." });
        }
        updates.recoveryAnswer = hashRecoveryAnswer(recoveryAnswer);
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No profile changes provided." });
    }

    Object.assign(req.user, updates);
    await req.user.save();

    return res.json({ user: sanitizeUser(req.user) });
};

const logout = (req, res) => {
    clearAuthCookie(res);
    return res.status(204).send();
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        return res.json({
            question: null,
            message: "If an account exists for that email, you can reset your password.",
        });
    }

    return res.json({
        question: user.recoveryQuestion || null,
        message: "Please answer your recovery question to reset your password.",
    });
};

const resetPassword = async (req, res) => {
    const { email, recoveryAnswer, newPassword } = req.body;

    if (!email || !recoveryAnswer || !newPassword) {
        return res
            .status(400)
            .json({ message: "Email, recovery answer, and new password are required." });
    }

    if (String(newPassword).length < 8) {
        return res
            .status(400)
            .json({ message: "Password must be at least 8 characters long." });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.recoveryAnswer) {
        return res.status(400).json({ message: "User not found or recovery is not configured." });
    }

    if (hashRecoveryAnswer(recoveryAnswer) !== user.recoveryAnswer) {
        return res.status(400).json({ message: "Incorrect recovery answer." });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password updated successfully. You can now log in." });
};

module.exports = {
    forgotPassword,
    getCurrentUser,
    googleLogin,
    login,
    logout,
    resetPassword,
    signup,
    updateProfile,
};
