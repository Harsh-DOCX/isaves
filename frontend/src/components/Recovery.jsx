import React, { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE =
    process.env.REACT_APP_API_URL ||
    (window.__APP_CONFIG__ && window.__APP_CONFIG__.REACT_APP_API_URL) ||
    "";

const parseError = async (response) => {
    try {
        const data = await response.json();
        return data.message || "Request failed.";
    } catch {
        return "Request failed.";
    }
};

const Recovery = () => {
    const [email, setEmail] = useState("");
    const [recoveryQuestion, setRecoveryQuestion] = useState("");
    const [recoveryAnswer, setRecoveryAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState("email");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error(await parseError(response));
            }

            const data = await response.json();
            if (data.question) {
                setRecoveryQuestion(data.question);
                setMessage(data.message || "Please answer your recovery question.");
                setStep("answer");
            } else {
                setMessage(data.message || "No account found for this email.");
            }
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (recoveryAnswer.trim().length === 0) {
            setError("Recovery answer is required.");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Password confirmation does not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    recoveryAnswer,
                    newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error(await parseError(response));
            }

            const data = await response.json();
            setMessage(data.message || "Password updated successfully.");
            setEmail("");
            setRecoveryAnswer("");
            setNewPassword("");
            setConfirmPassword("");
            setRecoveryQuestion("");
            setStep("email");
        } catch (resetError) {
            setError(resetError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="futuristic-container">
            <div className="auth-card">
                <h2 className="auth-title">RESTORE_ACCESS</h2>

                {step === "email" ? (
                    <form onSubmit={handleEmailSubmit}>
                        <p
                            style={{
                                color: "#888",
                                marginBottom: "20px",
                                fontSize: "14px",
                            }}
                        >
                            ENTER YOUR IDENTIFIER TO PROCEED WITH PASSWORD RECOVERY.
                        </p>
                        <div className="input-group">
                            <label>IDENTIFIER [EMAIL]</label>
                            <input
                                type="email"
                                className="futuristic-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="form-feedback error">{error}</p>}
                        {message && <p className="form-feedback success">{message}</p>}

                        <button type="submit" className="primary-btn" disabled={isSubmitting}>
                            {isSubmitting ? "VERIFYING..." : "VERIFY EMAIL"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordReset}>
                        <p
                            style={{
                                color: "#00f3ff",
                                marginBottom: "20px",
                                textShadow: "0 0 5px #00f3ff",
                            }}
                        >
                            ANSWER YOUR SECURITY QUESTION TO PROCEED.
                        </p>

                        <div className="input-group">
                            <label>RECOVERY_QUESTION</label>
                            <p
                                style={{
                                    color: "#00f3ff",
                                    marginBottom: "12px",
                                    marginTop: "8px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                }}
                            >
                                {recoveryQuestion}
                            </p>
                        </div>

                        <div className="input-group">
                            <label>YOUR ANSWER</label>
                            <input
                                type="text"
                                className="futuristic-input"
                                placeholder="Enter your recovery answer"
                                value={recoveryAnswer}
                                onChange={(e) => setRecoveryAnswer(e.target.value)}
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div className="input-group">
                            <label>NEW ACCESS_KEY [PASSWORD]</label>
                            <input
                                type="password"
                                className="futuristic-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="input-group">
                            <label>CONFIRM NEW ACCESS_KEY</label>
                            <input
                                type="password"
                                className="futuristic-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        {error && <p className="form-feedback error">{error}</p>}
                        {message && <p className="form-feedback success">{message}</p>}

                        <button type="submit" className="primary-btn" disabled={isSubmitting}>
                            {isSubmitting ? "UPDATING..." : "UPDATE PASSWORD"}
                        </button>

                        <button
                            type="button"
                            className="primary-btn"
                            style={{ marginTop: "10px", backgroundColor: "#666" }}
                            onClick={() => {
                                setStep("email");
                                setRecoveryAnswer("");
                                setError("");
                                setMessage("");
                            }}
                        >
                            BACK TO EMAIL
                        </button>
                    </form>
                )}

                <div className="auth-links" style={{ marginTop: "30px" }}>
                    <p>
                        <Link to="/login">ABORT & RETURN</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Recovery;
