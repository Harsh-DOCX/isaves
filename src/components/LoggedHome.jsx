import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useDialog } from "./ui/DialogProvider";

const RECOVERY_QUESTIONS = [
    "What was the name of your first pet?",
    "What city were you born in?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
    "What is your favorite book or movie?",
];

export default function LoggedHome() {
    const { authFetch, updateProfile, user } = useAuth();
    const { showAlert, showConfirm } = useDialog();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState(null);
    const [visibleId, setVisibleId] = useState(null);
    const [profileForm, setProfileForm] = useState({
        username: user.username || "",
        mobileNumber: user.mobileNumber || "",
        personalInfo: user.personalInfo || "",
        recoveryQuestion: user.recoveryQuestion || "",
        recoveryAnswer: "",
    });
    const [siteImageMap, setSiteImageMap] = useState({});
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMessage, setProfileMessage] = useState("");

    useEffect(() => {
        const loadVault = async () => {
            try {
                const data = await authFetch("/api/vault");
                setEntries(data.entries);
            } catch (loadError) {
                setError(loadError.message);
            } finally {
                setLoading(false);
            }
        };

        loadVault();
    }, [authFetch]);

    useEffect(() => {
        setProfileForm({
            username: user.username || "",
            mobileNumber: user.mobileNumber || "",
            personalInfo: user.personalInfo || "",
            recoveryQuestion: user.recoveryQuestion || "",
            recoveryAnswer: "",
        });
    }, [user]);

    useEffect(() => {
        if (entries.length === 0) {
            return undefined;
        }

        let isCancelled = false;
        const controller = new AbortController();
        const uniqueSites = [...new Set(entries.map((entry) => entry.siteName.trim()))].filter(Boolean);

        const unresolvedSites = uniqueSites.filter((siteName) => !siteImageMap[siteName]);
        if (unresolvedSites.length === 0) {
            return undefined;
        }

        const loadSiteImages = async () => {
            await Promise.all(
                unresolvedSites.map(async (siteName) => {
                    try {
                        const data = await authFetch(
                            `/api/site-image?query=${encodeURIComponent(siteName)}`,
                            { signal: controller.signal },
                        );

                        if (isCancelled) {
                            return;
                        }

                        setSiteImageMap((current) => (
                            current[siteName]
                                ? current
                                : {
                                    ...current,
                                    [siteName]: {
                                        imageUrls: data.imageUrls || [],
                                        activeIndex: 0,
                                    },
                                }
                        ));
                    } catch (loadError) {
                        if (loadError.name === "AbortError") {
                            return;
                        }

                        setSiteImageMap((current) => (
                            current[siteName]
                                ? current
                                : {
                                    ...current,
                                    [siteName]: {
                                        imageUrls: [],
                                        activeIndex: 0,
                                    },
                                }
                        ));
                    }
                }),
            );
        };

        loadSiteImages();

        return () => {
            isCancelled = true;
            controller.abort();
        };
    }, [authFetch, entries, siteImageMap]);

    const weakPasswords = entries.filter((entry) => entry.password.length < 12).length;
    const newestEntry = entries[0];

    const handleCopy = async (entry) => {
        try {
            await navigator.clipboard.writeText(entry.password);
            setCopiedId(entry.id);
            setTimeout(() => setCopiedId(null), 1500);
        } catch {
            setError("Clipboard access failed. Copy manually from a secure device.");
        }
    };

    const handleToggleVisibility = (entryId) => {
        setVisibleId((currentId) => (currentId === entryId ? null : entryId));
    };

    const handleDelete = async (entryId) => {
        const confirmed = await showConfirm({
            title: "Delete Credential",
            message: "Delete this credential from your vault?",
            confirmText: "Delete",
            cancelText: "Keep",
        });
        if (!confirmed) {
            return;
        }

        try {
            await authFetch(`/api/vault/${entryId}`, { method: "DELETE" });
            setEntries((currentEntries) =>
                currentEntries.filter((entry) => entry.id !== entryId),
            );
        } catch (deleteError) {
            setError(deleteError.message);
            await showAlert({
                title: "Delete Failed",
                message: deleteError.message,
                buttonText: "Close",
            });
        }
    };

    const handleEntrySiteImageError = (siteName) => {
        setSiteImageMap((current) => {
            const currentSite = current[siteName];
            if (!currentSite || currentSite.activeIndex >= currentSite.imageUrls.length - 1) {
                return current;
            }

            return {
                ...current,
                [siteName]: {
                    ...currentSite,
                    activeIndex: currentSite.activeIndex + 1,
                },
            };
        });
    };

    const handleProfileChange = (event) => {
        const { name, value } = event.target;
        setProfileForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const handleProfileSave = async (event) => {
        event.preventDefault();
        setProfileMessage("");
        setError("");
        setProfileSaving(true);

        try {
            await updateProfile(profileForm);
            setProfileMessage("Profile updated successfully.");
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setProfileSaving(false);
        }
    };

    return (
        <section className="dashboard-view command-deck">
            <header className="dashboard-header">
                <div className="dashboard-intro">
                    <span className="dashboard-badge">Secure Command Deck</span>
                    <h1>Your Secure Vault</h1>
                    <p className="dashboard-subtitle">
                        Operator {user.username} is authenticated. Review recent
                        credentials, inspect signal quality, and add new records
                        from a single control surface.
                    </p>
                </div>
                <div className="dashboard-actions">
                    <Link to="/add-password" className="primary-btn">
                        + Add Credential
                    </Link>
                </div>
            </header>

            <section className="dashboard-hero-grid">
                <article className="dashboard-feature-panel">
                    <p className="panel-label">Vault Status</p>
                    <div className="vault-status-row">
                        <div>
                            <h2>Live security overview</h2>
                            <p>
                                The vault is available for session-limited
                                operations only. No persistent remember-me state
                                is retained on this device.
                            </p>
                        </div>
                        <div className="vault-signal">
                            <span className="signal-ring"></span>
                            <strong>ACTIVE</strong>
                        </div>
                    </div>
                    <div className="status-matrix">
                        <div className="status-chip">
                            <span className="status-chip-label">Last Added</span>
                            <strong>{newestEntry ? newestEntry.siteName : "No entries yet"}</strong>
                        </div>
                        <div className="status-chip">
                            <span className="status-chip-label">Auth Mode</span>
                            <strong>Session Token</strong>
                        </div>
                        <div className="status-chip">
                            <span className="status-chip-label">Copy Actions</span>
                            <strong>Direct clipboard relay</strong>
                        </div>
                    </div>
                </article>

                <aside className="vault-side-panel">
                    <p className="panel-label">Operator Profile</p>
                    <div className="operator-card">
                        <span className="operator-avatar">
                            {user.username.slice(0, 1).toUpperCase()}
                        </span>
                        <div>
                            <h3>{user.username}</h3>
                            <p>{user.email}</p>
                            {user.mobileNumber && <p>{user.mobileNumber}</p>}
                        </div>
                    </div>
                    <div className="operator-notes">
                        <p>
                            {user.personalInfo ||
                                "Vault access is optimized for focused, deliberate credential work."}
                        </p>
                    </div>
                    <form className="profile-editor" onSubmit={handleProfileSave}>
                        <label htmlFor="profile-username">Username</label>
                        <input
                            id="profile-username"
                            name="username"
                            type="text"
                            value={profileForm.username}
                            onChange={handleProfileChange}
                            required
                        />
                        <label htmlFor="profile-mobile">Mobile Number</label>
                        <input
                            id="profile-mobile"
                            name="mobileNumber"
                            type="tel"
                            value={profileForm.mobileNumber}
                            onChange={handleProfileChange}
                            placeholder="+91 98765 43210"
                        />
                        <label htmlFor="profile-info">Personal Info</label>
                        <textarea
                            id="profile-info"
                            name="personalInfo"
                            rows="3"
                            value={profileForm.personalInfo}
                            onChange={handleProfileChange}
                            placeholder="Add personal info or notes"
                        />
                        <label htmlFor="profile-recovery-question">Recovery Question</label>
                        <select
                            id="profile-recovery-question"
                            name="recoveryQuestion"
                            value={profileForm.recoveryQuestion}
                            onChange={handleProfileChange}
                            className="profile-input"
                        >
                            <option value="">Select a security question</option>
                            {RECOVERY_QUESTIONS.map((q, index) => (
                                <option key={index} value={q}>
                                    {q}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="profile-recovery-answer">Recovery Answer</label>
                        <input
                            id="profile-recovery-answer"
                            name="recoveryAnswer"
                            type="text"
                            value={profileForm.recoveryAnswer}
                            onChange={handleProfileChange}
                            placeholder="Answer to your recovery question (leave empty to keep current)"
                        />
                        {profileMessage && (
                            <p className="form-feedback success">{profileMessage}</p>
                        )}
                        <button
                            type="submit"
                            className="copy-btn profile-save-btn"
                            disabled={profileSaving}
                        >
                            {profileSaving ? "Saving..." : "Save Profile"}
                        </button>
                    </form>
                </aside>
            </section>

            {error && <p className="form-feedback error">{error}</p>}

            <div className="vault-stats">
                <div className="stat-card">
                    <h3>Total Logins</h3>
                    <p className="stat-number">{entries.length}</p>
                    <span className="stat-caption">Stored credential records</span>
                </div>
                <div className="stat-card">
                    <h3>Weak Passwords</h3>
                    <p className="stat-number warning">{weakPasswords}</p>
                    <span className="stat-caption">Entries under 12 characters</span>
                </div>
                <div className="stat-card">
                    <h3>Compromised</h3>
                    <p className="stat-number danger">0</p>
                    <span className="stat-caption">No breach feed integrated yet</span>
                </div>
            </div>

            <div className="recent-logins vault-table">
                <div className="section-head-row">
                    <div>
                        <p className="panel-label">Credential Matrix</p>
                        <h2>Stored Credentials</h2>
                    </div>
                    <span className="table-caption">
                        {entries.length} record{entries.length === 1 ? "" : "s"} indexed
                    </span>
                </div>
                {loading ? (
                    <p className="entry-empty">Loading vault entries...</p>
                ) : entries.length === 0 ? (
                    <div className="empty-vault-state">
                        <h3>No credentials stored yet</h3>
                        <p>
                            Start the vault by adding your first credential. The
                            dashboard will populate live once records are saved.
                        </p>
                        <Link to="/add-password" className="primary-btn empty-vault-btn">
                            Initialize First Credential
                        </Link>
                    </div>
                ) : (
                    <ul className="password-list">
                        {entries.map((entry) => (
                            <li className="password-item" key={entry.id}>
                                <div className="password-details">
                                    <div className="site-name-row">
                                        {siteImageMap[entry.siteName]?.imageUrls?.length > 0 ? (
                                            <img
                                                src={siteImageMap[entry.siteName].imageUrls[siteImageMap[entry.siteName].activeIndex]}
                                                alt={`${entry.siteName} logo`}
                                                className="site-icon"
                                                onError={() => handleEntrySiteImageError(entry.siteName)}
                                            />
                                        ) : (
                                            <span className="site-icon-fallback">
                                                {entry.siteName.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                        <span className="site-name">{entry.siteName}</span>
                                    </div>
                                    <span className="entry-meta">{entry.username}</span>
                                </div>
                                <div className="secret-track">
                                    <span className="hidden-pass">
                                        {visibleId === entry.id
                                            ? entry.password
                                            : "*".repeat(Math.max(entry.password.length, 8))}
                                    </span>
                                </div>
                                <div className="credential-actions">
                                    <button
                                        type="button"
                                        className="copy-btn secondary-copy-btn"
                                        onClick={() => handleToggleVisibility(entry.id)}
                                    >
                                        {visibleId === entry.id ? "Hide Password" : "Show Password"}
                                    </button>
                                    <button
                                        type="button"
                                        className="copy-btn"
                                        onClick={() => handleCopy(entry)}
                                    >
                                        {copiedId === entry.id ? "Copied" : "Copy Secret"}
                                    </button>
                                    <button
                                        type="button"
                                        className="copy-btn delete-btn"
                                        onClick={() => handleDelete(entry.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

