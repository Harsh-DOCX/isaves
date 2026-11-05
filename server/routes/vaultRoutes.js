const express = require("express");
const {
    createEntry,
    deleteEntry,
    listEntries,
} = require("../controllers/vaultController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, listEntries);
router.post("/", authMiddleware, createEntry);
router.delete("/:entryId", authMiddleware, deleteEntry);

module.exports = router;
