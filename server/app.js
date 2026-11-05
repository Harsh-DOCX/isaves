const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const { allowedOrigins } = require("./config");
const authRoutes = require("./routes/authRoutes");
const utilityRoutes = require("./routes/utilityRoutes");
const vaultRoutes = require("./routes/vaultRoutes");

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }

            callback(null, allowedOrigins.includes(origin));
        },
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api", utilityRoutes);

app.use((error, req, res, next) => {
    if (error?.name === "ValidationError") {
        return res.status(400).json({ message: "Invalid request payload." });
    }

    if (error?.code === 11000) {
        return res.status(409).json({ message: "A record already exists." });
    }

    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
});

module.exports = app;
