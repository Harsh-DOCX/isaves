import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";

const AddPassword = () => {
    const navigate = useNavigate();
    const { authFetch } = useAuth();
    const [formData, setFormData] = useState({
        siteName: "",
        username: "",
        password: "",
        notes: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [siteImage, setSiteImage] = useState({
        loading: false,
        imageUrls: [],
        activeIndex: 0,
        domain: "",
        matchType: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|?><";
        const randomValues = new Uint32Array(16);
        window.crypto.getRandomValues(randomValues);
        let newPassword = "";
        for (let i = 0; i < randomValues.length; i += 1) {
            newPassword += chars.charAt(randomValues[i] % chars.length);
        }
        setFormData({ ...formData, password: newPassword });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await authFetch("/api/vault", {
                method: "POST",
                body: JSON.stringify(formData),
            });
            navigate("/vault");
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const currentValue = formData.siteName.trim();
        if (!currentValue) {
            setSiteImage({
                loading: false,
                imageUrls: [],
                activeIndex: 0,
                domain: "",
                matchType: "",
            });
            return undefined;
        }

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setSiteImage((current) => ({ ...current, loading: true }));
            try {
                const data = await authFetch(
                    `/api/site-image?query=${encodeURIComponent(currentValue)}`,
                    { signal: controller.signal },
                );
                setSiteImage({
                    loading: false,
                    imageUrls: data.imageUrls || [],
                    activeIndex: 0,
                    domain: data.domain || "",
                    matchType: data.matchType || "",
                });
            } catch (loadError) {
                if (loadError.name !== "AbortError") {
                    setSiteImage((current) => ({
                        ...current,
                        loading: false,
                        imageUrls: [],
                    }));
                }
            }
        }, 320);

        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, [authFetch, formData.siteName]);

    const previewUrl = useMemo(
        () => siteImage.imageUrls[siteImage.activeIndex] || "",
        [siteImage.activeIndex, siteImage.imageUrls],
    );

    const handlePreviewImageError = () => {
        setSiteImage((current) => {
            if (current.activeIndex >= current.imageUrls.length - 1) {
                return current;
            }

            return {
                ...current,
                activeIndex: current.activeIndex + 1,
            };
        });
    };

    return (
        <section className="credential-shell">
            <div className="credential-intro">
                <span className="dashboard-badge">Vault Write Console</span>
                <h1>Store a new credential</h1>
                <p className="dashboard-subtitle">
                    Register a site, identifier, and password inside the vault.
                    Generate a stronger secret on the fly if you do not want to
                    reuse an existing one.
                </p>
                <div className="credential-tips">
                    <div className="tip-card">
                        <strong>Use unique passwords</strong>
                        <span>Keep each site isolated from every other login.</span>
                    </div>
                    <div className="tip-card">
                        <strong>Prefer 16+ characters</strong>
                        <span>The built-in generator already follows that baseline.</span>
                    </div>
                </div>
            </div>

            <Card title="ADD_CREDENTIAL">
                <form onSubmit={handleSave}>
                    <Input
                        id="site-input"
                        label="SYSTEM [SITE NAME / URL]"
                        name="siteName"
                        type="text"
                        value={formData.siteName}
                        onChange={handleChange}
                        required
                    />

                    {formData.siteName.trim() && (
                        <div className="site-preview-card">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt={`${formData.siteName} logo`}
                                    className="site-preview-logo"
                                    onError={handlePreviewImageError}
                                />
                            ) : (
                                <div className="site-preview-fallback">
                                    {formData.siteName.trim().charAt(0).toUpperCase() || "S"}
                                </div>
                            )}
                            <div className="site-preview-copy">
                                <strong>Detected site image</strong>
                                <span>
                                    {siteImage.loading
                                        ? "Resolving best logo..."
                                        : siteImage.domain
                                            ? `${siteImage.domain} (${siteImage.matchType})`
                                            : "Using fallback icon"}
                                </span>
                            </div>
                        </div>
                    )}

                    <Input
                        id="username-input"
                        label="IDENTIFIER [USERNAME / EMAIL]"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <div className="password-generator-wrap">
                        <Input
                            id="password-input"
                            label="ACCESS_KEY [PASSWORD]"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <div className="password-action-row">
                            <button
                                type="button"
                                onClick={handleGenerate}
                                className="inline-generator-btn"
                            >
                                Generate
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPassword((value) => !value)}
                                className="inline-generator-btn secondary-inline-btn"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="notes-input">LOGS [NOTES]</label>
                        <textarea
                            id="notes-input"
                            name="notes"
                            className="futuristic-input futuristic-textarea"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    {error && <p className="form-feedback error">{error}</p>}

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "STORING..." : "STORE CREDENTIAL"}
                    </Button>
                </form>

                <div className="auth-links credential-links">
                    <p>
                        <Link to="/vault">ABORT & RETURN TO VAULT</Link>
                    </p>
                </div>
            </Card>
        </section>
    );
};

export default AddPassword;
