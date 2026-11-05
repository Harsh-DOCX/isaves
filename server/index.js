const fs = require("fs");
const path = require("path");

const serverEnvPath = path.resolve(__dirname, ".env");
const rootEnvPath = path.resolve(__dirname, "..", ".env");
require("dotenv").config({
    path: fs.existsSync(serverEnvPath) ? serverEnvPath : rootEnvPath,
});

const mongoose = require("mongoose");
const app = require("./app");
const { MONGODB_URI, PORT } = require("./config");

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`iSaves API listening on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB.", error);
        process.exit(1);
    });
