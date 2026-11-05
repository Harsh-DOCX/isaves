const mongoose = require("mongoose");

const encryptedSecretSchema = new mongoose.Schema(
    {
        iv: { type: String, required: true },
        content: { type: String, required: true },
        authTag: { type: String, required: true },
    },
    { _id: false },
);

const vaultEntrySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        siteName: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: encryptedSecretSchema,
            required: true,
        },
        notes: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    },
);

module.exports = mongoose.model("VaultEntry", vaultEntrySchema);
