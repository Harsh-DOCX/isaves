const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {
    encryptionKey,
    isProduction,
    JWT_SECRET,
    TOKEN_COOKIE,
} = require("../config");

const hashRecoveryAnswer = (answer) =>
    crypto
        .createHash("sha256")
        .update(`${answer.trim().toLowerCase()}:${JWT_SECRET}`)
        .digest("hex");

const encryptSecret = (value) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);
    const encrypted = Buffer.concat([
        cipher.update(value, "utf8"),
        cipher.final(),
    ]);

    return {
        iv: iv.toString("hex"),
        content: encrypted.toString("hex"),
        authTag: cipher.getAuthTag().toString("hex"),
    };
};

const decryptSecret = (payload) => {
    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        encryptionKey,
        Buffer.from(payload.iv, "hex"),
    );

    decipher.setAuthTag(Buffer.from(payload.authTag, "hex"));

    return Buffer.concat([
        decipher.update(Buffer.from(payload.content, "hex")),
        decipher.final(),
    ]).toString("utf8");
};

const issueToken = (user) =>
    jwt.sign({ sub: user._id.toString(), email: user.email }, JWT_SECRET, {
        expiresIn: "12h",
    });

const authCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 12 * 60 * 60 * 1000,
    path: "/",
};

const setAuthCookie = (res, token) => {
    res.cookie(TOKEN_COOKIE, token, authCookieOptions);
};

const clearAuthCookie = (res) => {
    res.clearCookie(TOKEN_COOKIE, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    });
};

module.exports = {
    clearAuthCookie,
    decryptSecret,
    encryptSecret,
    hashRecoveryAnswer,
    issueToken,
    setAuthCookie,
};
