import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Divider from "./ui/Divider";
import GoogleAuthButton from "./GoogleAuthButton";
import Input from "./ui/Input";

const RECOVERY_QUESTIONS = [
    "What was the name of your first pet?",
    "What city were you born in?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
    "What is your favorite book or movie?",
];

const Signup = () => {
    const navigate = useNavigate();
    const {
        signup,
        beginGoogleSignup,
        completeGoogleSignup,
    } = useAuth();
    const dropdownRef = useRef(null);
    const [googleSignup, setGoogleSignup] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        recoveryQuestion: "",
        recoveryAnswer: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showQuestionDropdown, setShowQuestionDropdown] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowQuestionDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectQuestion = (question) => {
        setFormData({ ...formData, recoveryQuestion: question });
        setShowQuestionDropdown(false);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await signup(formData);
            navigate("/vault");
        } catch (signupError) {
            setError(signupError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignup = useCallback(async (credential) => {
        setError("");
        setIsSubmitting(true);

        try {
            const result = await beginGoogleSignup(credential);
            if (result.requiresSetup) {
                setGoogleSignup({ credential, email: result.email });
                setFormData((current) => ({
                    ...current,
                    password: "",
                    recoveryQuestion: "",
                    recoveryAnswer: "",
                }));
            } else {
                navigate("/vault");
            }
        } catch (googleError) {
            setError(googleError.message);
        } finally {
            setIsSubmitting(false);
        }
    }, [beginGoogleSignup, navigate]);

    const handleGoogleSignupCompletion = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await completeGoogleSignup(googleSignup.credential, {
                password: formData.password,
                recoveryQuestion: formData.recoveryQuestion,
                recoveryAnswer: formData.recoveryAnswer,
            });
            navigate("/vault");
        } catch (googleError) {
            setError(googleError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card title={googleSignup ? "SECURE_GOOGLE_PROFILE" : "NEW_CONSTRUCT"}>
            {googleSignup ? (
                <form onSubmit={handleGoogleSignupCompletion}>
                    <p className="google-signup-email">
                        GOOGLE ACCOUNT: <strong>{googleSignup.email}</strong>
                    </p>

                    <Input
                        id="google-password-input"
                        label="NEW ACCESS_KEY [PASSWORD]"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={8}
                        autoComplete="new-password"
                        required
                    />

                    <div className="input-group">
                        <label htmlFor="google-recovery-question">RECOVERY_QUESTION [SECURITY]</label>
                        <select
                            id="google-recovery-question"
                            className="futuristic-input"
                            name="recoveryQuestion"
                            value={formData.recoveryQuestion}
                            onChange={handleChange}
                            required
                        >
                            <option value="">SELECT A SECURITY QUESTION</option>
                            {RECOVERY_QUESTIONS.map((question) => (
                                <option key={question} value={question}>
                                    {question}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        id="google-recovery-answer-input"
                        label="RECOVERY_ANSWER [ANSWER]"
                        name="recoveryAnswer"
                        type="text"
                        value={formData.recoveryAnswer}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />

                    {error && <p className="form-feedback error">{error}</p>}

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "SECURING PROFILE..." : "COMPLETE GOOGLE SIGNUP"}
                    </Button>
                    <Button
                        type="button"
                        variant="google"
                        disabled={isSubmitting}
                        onClick={() => {
                            setGoogleSignup(null);
                            setError("");
                        }}
                    >
                        CANCEL AND RETURN
                    </Button>
                </form>
            ) : (
                <>
                    <form onSubmit={handleSignup}>
                        <Input
                            id="username-input"
                            label="DESIGNATION [USERNAME]"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            id="email-input"
                            label="IDENTIFIER [EMAIL]"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            id="password-input"
                            label="NEW ACCESS_KEY [PASSWORD]"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <div className="input-group">
                            <label htmlFor="recovery-question">RECOVERY_QUESTION [SECURITY]</label>
                            <div className="custom-dropdown" ref={dropdownRef}>
                                <button
                                    type="button"
                                    className={`custom-dropdown-toggle futuristic-input ${showQuestionDropdown ? "active" : ""}`}
                                    onClick={() => setShowQuestionDropdown(!showQuestionDropdown)}
                                >
                                    {formData.recoveryQuestion || "SELECT A SECURITY QUESTION"}
                                    <span className="dropdown-arrow">▼</span>
                                </button>
                                {showQuestionDropdown && (
                                    <div className="custom-dropdown-menu">
                                        {RECOVERY_QUESTIONS.map((question, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                className="custom-dropdown-item"
                                                onClick={() => handleSelectQuestion(question)}
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <input
                                type="hidden"
                                name="recoveryQuestion"
                                value={formData.recoveryQuestion}
                                required
                            />
                        </div>

                        <Input
                            id="recovery-answer-input"
                            label="RECOVERY_ANSWER [ANSWER]"
                            name="recoveryAnswer"
                            type="text"
                            value={formData.recoveryAnswer}
                            onChange={handleChange}
                            required
                        />

                        {error && <p className="form-feedback error">{error}</p>}

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "GENERATING..." : "GENERATE PROFILE"}
                        </Button>
                    </form>

                    <Divider text="OR" />
                    <GoogleAuthButton
                        mode="signup"
                        onCredential={handleGoogleSignup}
                        disabled={isSubmitting}
                    />
                </>
            )}

            <div className="auth-links">
                <p>
                    EXISTING PROFILE? <Link to="/login">RETURN TO LOGIN</Link>
                </p>
                <p className="auth-helper">
                    Session-only access is used for the vault. Remember-me is not part of this flow.
                </p>
            </div>
        </Card>
    );
};

export default Signup;
