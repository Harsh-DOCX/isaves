const mongoose = require("mongoose");
const {
    buildLogoUrls,
    resolveSiteDomain,
} = require("../services/siteImageService");

const health = (req, res) => {
    const dbState =
        mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    res.json({ status: "ok", database: dbState });
};

const siteImage = (req, res) => {
    const query = String(req.query.query || "").trim();
    if (!query) {
        return res.status(400).json({ message: "Query is required." });
    }

    const { domain, matchType } = resolveSiteDomain(query);
    const imageUrls = buildLogoUrls(domain, query);

    return res.json({
        query,
        domain: domain || null,
        matchType,
        imageUrls,
    });
};

module.exports = { health, siteImage };
