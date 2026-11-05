const DOMAIN_REGEX = /^(?:[a-z0-9-]+\.)+[a-z]{2,24}$/i;

const COMMON_SITE_ALIASES = {
    amazon: "amazon.com",
    apple: "apple.com",
    canva: "canva.com",
    chatgpt: "openai.com",
    discord: "discord.com",
    dropbox: "dropbox.com",
    facebook: "facebook.com",
    figma: "figma.com",
    github: "github.com",
    gitlab: "gitlab.com",
    gmail: "google.com",
    google: "google.com",
    hackerrank: "hackerrank.com",
    hotstar: "hotstar.com",
    instagram: "instagram.com",
    linkedin: "linkedin.com",
    medium: "medium.com",
    microsoft: "microsoft.com",
    netflix: "netflix.com",
    notion: "notion.so",
    openai: "openai.com",
    outlook: "outlook.com",
    paypal: "paypal.com",
    pinterest: "pinterest.com",
    primevideo: "primevideo.com",
    reddit: "reddit.com",
    slack: "slack.com",
    snapchat: "snapchat.com",
    spotify: "spotify.com",
    stackoverflow: "stackoverflow.com",
    telegram: "telegram.org",
    tiktok: "tiktok.com",
    twitch: "twitch.tv",
    twitter: "x.com",
    whatsapp: "whatsapp.com",
    wikipedia: "wikipedia.org",
    x: "x.com",
    yahoo: "yahoo.com",
    youtube: "youtube.com",
    zoom: "zoom.us",
};

const COMMON_DOMAINS = [
    "amazon.com",
    "apple.com",
    "chat.openai.com",
    "discord.com",
    "dropbox.com",
    "facebook.com",
    "figma.com",
    "github.com",
    "gitlab.com",
    "google.com",
    "instagram.com",
    "linkedin.com",
    "mail.google.com",
    "medium.com",
    "microsoft.com",
    "netflix.com",
    "notion.so",
    "openai.com",
    "outlook.com",
    "paypal.com",
    "pinterest.com",
    "reddit.com",
    "slack.com",
    "snapchat.com",
    "spotify.com",
    "stackoverflow.com",
    "telegram.org",
    "tiktok.com",
    "twitch.tv",
    "whatsapp.com",
    "wikipedia.org",
    "x.com",
    "yahoo.com",
    "youtube.com",
    "zoom.us",
];

const sanitizeToken = (value) =>
    String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

const toHostname = (input) => {
    const raw = String(input || "").trim();
    if (!raw) {
        return "";
    }

    const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

    try {
        const url = new URL(candidate);
        return url.hostname.toLowerCase().replace(/^www\./, "");
    } catch {
        const noPath = raw.split("/")[0].trim().toLowerCase().replace(/^www\./, "");
        return DOMAIN_REGEX.test(noPath) ? noPath : "";
    }
};

const levenshteinDistance = (source, target) => {
    if (source === target) {
        return 0;
    }

    const sourceLength = source.length;
    const targetLength = target.length;

    if (sourceLength === 0) {
        return targetLength;
    }

    if (targetLength === 0) {
        return sourceLength;
    }

    const matrix = Array.from({ length: sourceLength + 1 }, () =>
        new Array(targetLength + 1).fill(0),
    );

    for (let i = 0; i <= sourceLength; i += 1) {
        matrix[i][0] = i;
    }

    for (let j = 0; j <= targetLength; j += 1) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= sourceLength; i += 1) {
        for (let j = 1; j <= targetLength; j += 1) {
            const substitutionCost = source[i - 1] === target[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + substitutionCost,
            );
        }
    }

    return matrix[sourceLength][targetLength];
};

const bestFuzzyMatch = (value, candidates) => {
    if (!value) {
        return null;
    }

    const source = sanitizeToken(value);
    if (!source) {
        return null;
    }

    let bestCandidate = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const candidate of candidates) {
        const target = sanitizeToken(candidate);
        if (!target) {
            continue;
        }

        const distance = levenshteinDistance(source, target);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestCandidate = candidate;
        }
    }

    if (!bestCandidate) {
        return null;
    }

    const maxAllowedDistance = source.length <= 4 ? 1 : source.length <= 8 ? 2 : 3;
    if (bestDistance > maxAllowedDistance) {
        return null;
    }

    return bestCandidate;
};

const resolveSiteDomain = (query) => {
    const normalized = String(query || "").trim().toLowerCase();
    const hostname = toHostname(normalized);

    if (hostname) {
        if (COMMON_DOMAINS.includes(hostname)) {
            return { domain: hostname, matchType: "exact-domain" };
        }

        const fuzzyDomain = bestFuzzyMatch(hostname, COMMON_DOMAINS);
        if (fuzzyDomain) {
            return { domain: fuzzyDomain, matchType: "fuzzy-domain" };
        }

        return { domain: hostname, matchType: "typed-domain" };
    }

    const compact = sanitizeToken(normalized);

    if (COMMON_SITE_ALIASES[compact]) {
        return {
            domain: COMMON_SITE_ALIASES[compact],
            matchType: "alias",
        };
    }

    const aliasMatch = bestFuzzyMatch(compact, Object.keys(COMMON_SITE_ALIASES));
    if (aliasMatch && COMMON_SITE_ALIASES[aliasMatch]) {
        return {
            domain: COMMON_SITE_ALIASES[aliasMatch],
            matchType: "fuzzy-alias",
        };
    }

    return { domain: "", matchType: "fallback" };
};

const buildLogoUrls = (domain, rawQuery) => {
    const urls = [];

    if (domain) {
        urls.push(
            `https://logo.clearbit.com/${domain}`,
            `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
            `https://icons.duckduckgo.com/ip3/${domain}.ico`,
        );
    }

    const fallbackLabel = sanitizeToken(rawQuery).slice(0, 2).toUpperCase() || "SV";
    urls.push(
        `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(rawQuery)}`,
        `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackLabel)}&size=128&background=0f1f3b&color=ecf4ff&rounded=true`,
    );

    return [...new Set(urls)];
};

module.exports = { buildLogoUrls, resolveSiteDomain };
