const VaultEntry = require("../models/VaultEntry");
const {
    decryptSecret,
    encryptSecret,
} = require("../services/securityService");

const listEntries = async (req, res) => {
    const entries = await VaultEntry.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .lean();

    return res.json({
        entries: entries.map((entry) => ({
            id: entry._id.toString(),
            userId: entry.userId.toString(),
            siteName: entry.siteName,
            username: entry.username,
            password: decryptSecret(entry.password),
            notes: entry.notes,
            createdAt: entry.createdAt,
        })),
    });
};

const createEntry = async (req, res) => {
    const { siteName, username, password, notes = "" } = req.body;

    if (!siteName || !username || !password) {
        return res
            .status(400)
            .json({ message: "Site name, username, and password are required." });
    }

    const newEntry = await VaultEntry.create({
        userId: req.user._id,
        siteName: siteName.trim(),
        username: username.trim(),
        password: encryptSecret(password),
        notes: notes.trim(),
    });

    return res.status(201).json({
        entry: {
            id: newEntry._id.toString(),
            userId: newEntry.userId.toString(),
            siteName: newEntry.siteName,
            username: newEntry.username,
            password,
            notes: newEntry.notes,
            createdAt: newEntry.createdAt,
        },
    });
};

const deleteEntry = async (req, res) => {
    const { entryId } = req.params;

    const result = await VaultEntry.deleteOne({
        _id: entryId,
        userId: req.user._id,
    });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Vault entry not found." });
    }

    return res.status(204).send();
};

module.exports = { createEntry, deleteEntry, listEntries };
