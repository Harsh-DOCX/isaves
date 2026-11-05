const express = require("express");
const {
    health,
    siteImage,
} = require("../controllers/utilityController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/health", health);
router.get("/site-image", authMiddleware, siteImage);

module.exports = router;
