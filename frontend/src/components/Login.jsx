import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Divider from "./ui/Divider";
import GoogleAuthButton from "./GoogleAuthButton";
import Input from "./ui/Input";

const Login = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await login({ email, password });
            navigate("/vault");
        } catch (loginError) {
            setError(loginError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = useCallback(async (credential) => {
        setError("");
        setIsSubmitting(true);

        try {
            await loginWithGoogle(credential);
            navigate("/vault");
        } catch (googleError) {
            setError(googleError.message);
        } finally {
            setIsSubmitting(false);
        }
    }, [loginWithGoogle, navigate]);

    return (
        <Card title="SYSTEM_LOGIN">
            <form onSubmit={handleLogin}>
                <Input
                    id="email-input"
                    label="IDENTIFIER [EMAIL]"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input
                    id="password-input"
                    label="ACCESS_KEY [PASSWORD]"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="form-feedback error">{error}</p>}

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "CONNECTING..." : "INITIALIZE CONNECTION"}
                </Button>
            </form>

            <Divider text="OR" />
            <GoogleAuthButton
                mode="login"
                onCredential={handleGoogleLogin}
                disabled={isSubmitting}
            />

            <div className="auth-links">
                <p>
                    <Link to="/forget-Password">LOST ACCESS_KEY?</Link>
                </p>
                <p>
                    NO PROFILE? <Link to="/sign-up">REGISTER CONSTRUCT</Link>
                </p>
                <p className="auth-helper">
                    Session-only authentication is enabled. Remember-me is intentionally omitted.
                </p>
            </div>
        </Card>
    );
};

export default Login;
