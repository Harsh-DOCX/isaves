import { useEffect, useRef, useState } from "react";

const GOOGLE_CLIENT_ID =
    process.env.REACT_APP_GOOGLE_CLIENT_ID ||
    (window.__APP_CONFIG__ && window.__APP_CONFIG__.REACT_APP_GOOGLE_CLIENT_ID) ||
    "";
const SCRIPT_ID = "google-identity-services-script";

const loadGoogleScript = () =>
    new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) {
            resolve();
            return;
        }

        const existingScript = document.getElementById(SCRIPT_ID);
        if (existingScript) {
            existingScript.addEventListener("load", resolve, { once: true });
            existingScript.addEventListener("error", reject, { once: true });
            return;
        }

        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

const GoogleAuthButton = ({ mode = "login", onCredential, disabled }) => {
    const buttonRef = useRef(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const initGoogleButton = async () => {
            if (!GOOGLE_CLIENT_ID) {
                setError("Google login is unavailable. Missing REACT_APP_GOOGLE_CLIENT_ID.");
                return;
            }

            try {
                await loadGoogleScript();
                if (cancelled || !buttonRef.current || !window.google?.accounts?.id) {
                    return;
                }

                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: async (response) => {
                        if (!response?.credential || disabled) {
                            return;
                        }
                        await onCredential(response.credential);
                    },
                });

                buttonRef.current.innerHTML = "";
                window.google.accounts.id.renderButton(buttonRef.current, {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    text: mode === "signup" ? "signup_with" : "signin_with",
                    shape: "pill",
                    width: 320,
                });
            } catch {
                if (!cancelled) {
                    setError("Failed to load Google login.");
                }
            }
        };

        initGoogleButton();

        return () => {
            cancelled = true;
        };
    }, [mode, onCredential, disabled]);

    return (
        <div className="google-auth-wrap">
            <div ref={buttonRef} className="google-auth-button" />
            {error && <p className="form-feedback error">{error}</p>}
        </div>
    );
};

export default GoogleAuthButton;
