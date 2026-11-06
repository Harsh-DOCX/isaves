import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

const RECOVERY_QUESTIONS = [
    "What was the name of your first pet?",
    "What city were you born in?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
    "What is your favorite book or movie?",
];

export default function Profile() {
    const { updateProfile, user } = useAuth();
    const [profileForm, setProfileForm] = useState({
        username: user.username || "",
        mobileNumber: user.mobileNumber || "",
        personalInfo: user.personalInfo || "",
        recoveryQuestion: user.recoveryQuestion || "",
        recoveryAnswer: "",
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setProfileForm({
            username: user.username || "",
            mobileNumber: user.mobileNumber || "",
            personalInfo: user.personalInfo || "",
            recoveryQuestion: user.recoveryQuestion || "",
            recoveryAnswer: "",
        });
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfileForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");
        setSaving(true);

        try {
            await updateProfile(profileForm);
            setMessage("Profile updated successfully.");
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="dashboard-view command-deck profile-view">
            <header className="dashboard-header">
                <div className="dashboard-intro">
                    <span className="dashboard-badge">Account Settings</span>
                    <h1>Your Operator Profile</h1>
                    <p className="dashboard-subtitle">
                        Manage your account details and recovery information.
                    </p>
                </div>
            </header>

            <div className="profile-layout">
                <aside className="vault-side-panel profile-summary">
                    <p className="panel-label">Profile Summary</p>
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
                </aside>

                <section className="dashboard-feature-panel profile-form-panel">
                    <p className="panel-label">Edit Profile</p>
                    <form className="profile-editor" onSubmit={handleSave}>
                        <label htmlFor="profile-username">Username</label>
                        <input
                            id="profile-username"
                            name="username"
                            type="text"
                            value={profileForm.username}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="profile-mobile">Mobile Number</label>
                        <input
                            id="profile-mobile"
                            name="mobileNumber"
                            type="tel"
                            value={profileForm.mobileNumber}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                        />
                        <label htmlFor="profile-info">Personal Info</label>
                        <textarea
                            id="profile-info"
                            name="personalInfo"
                            rows="3"
                            value={profileForm.personalInfo}
                            onChange={handleChange}
                            placeholder="Add personal info or notes"
                        />
                        <label htmlFor="profile-recovery-question">Recovery Question</label>
                        <select
                            id="profile-recovery-question"
                            name="recoveryQuestion"
                            value={profileForm.recoveryQuestion}
                            onChange={handleChange}
                            className="profile-input"
                        >
                            <option value="">Select a security question</option>
                            {RECOVERY_QUESTIONS.map((question) => (
                                <option key={question} value={question}>
                                    {question}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="profile-recovery-answer">Recovery Answer</label>
                        <input
                            id="profile-recovery-answer"
                            name="recoveryAnswer"
                            type="text"
                            value={profileForm.recoveryAnswer}
                            onChange={handleChange}
                            placeholder="Leave empty to keep your current answer"
                        />
                        {message && <p className="form-feedback success">{message}</p>}
                        {error && <p className="form-feedback error">{error}</p>}
                        <button
                            type="submit"
                            className="copy-btn profile-save-btn"
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Profile"}
                        </button>
                    </form>
                </section>
            </div>
        </section>
    );
}
