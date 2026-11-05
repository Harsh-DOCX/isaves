const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const PORT = process.env.PORT;
const isProduction = process.env.NODE_ENV === "production";
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
const TOKEN_COOKIE = "isaves_token";

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
}

if (!ENCRYPTION_SECRET) {
    throw new Error("ENCRYPTION_SECRET is missing");
}

if (!GOOGLE_CLIENT_ID) {
    console.warn("GOOGLE_CLIENT_ID is missing");
}

if (!FRONTEND_ORIGIN) {
    throw new Error("FRONTEND_ORIGIN is missing");
}

const requiredEnvInProd = [
    "MONGODB_URI",
    "JWT_SECRET",
    "ENCRYPTION_SECRET",
    "GOOGLE_CLIENT_ID",
    "FRONTEND_ORIGIN",
];

if (isProduction) {
    const missing = requiredEnvInProd.filter((name) => !process.env[name]);
    if (missing.length > 0) {
        console.error(
            `Missing required environment variables in production: ${missing.join(", ")}`,
        );
        process.exit(1);
    }
}

const allowedOrigins = FRONTEND_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

module.exports = {
    allowedOrigins,
    encryptionKey: crypto.scryptSync(ENCRYPTION_SECRET, "isaves-salt", 32),
    FRONTEND_ORIGIN,
    GOOGLE_CLIENT_ID,
    googleClient: GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null,
    isProduction,
    JWT_SECRET,
    MONGODB_URI,
    PORT,
    TOKEN_COOKIE,
};
