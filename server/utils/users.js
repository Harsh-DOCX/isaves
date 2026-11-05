const sanitizeUser = (user) => ({
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    mobileNumber: user.mobileNumber || "",
    personalInfo: user.personalInfo || "",
    createdAt: user.createdAt,
});

const normalizeEmail = (email) => email.trim().toLowerCase();

module.exports = { normalizeEmail, sanitizeUser };
