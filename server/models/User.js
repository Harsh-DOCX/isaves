const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        mobileNumber: {
            type: String,
            trim: true,
            default: "",
        },
        personalInfo: {
            type: String,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        recoveryQuestion: {
            type: String,
            trim: true,
            default: "",
        },
        recoveryAnswer: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    },
);

module.exports = mongoose.model("User", userSchema);
