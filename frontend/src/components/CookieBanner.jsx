import { useState } from "react";

const CONSENT_STORAGE_KEY = "isaves-cookie-notice-dismissed";

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(
        () => window.localStorage.getItem(CONSENT_STORAGE_KEY) !== "true",
    );

    const dismissBanner = () => {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, "true");
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <aside className="cookie-banner" role="region" aria-label="Cookie notice">
            <div className="cookie-banner-copy">
                <span className="cookie-banner-label">A quick note</span>
                <p>
                    iSAVES uses essential cookies to keep you signed in and protect
                    your vault. They are required for the service to work.
                </p>
            </div>
            <button className="cookie-banner-button" onClick={dismissBanner}>
                Got it
            </button>
        </aside>
    );
};

export default CookieBanner;
