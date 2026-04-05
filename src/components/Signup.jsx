import{ useState } from "react";
import Card from "./ui/Card";
import Input from "./ui/Input";
import Button from "./ui/Button";
import Divider from "./ui/Divider";
import GoogleLogo from "./ui/GoogleLogo";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = (e) => {
        e.preventDefault();
        console.log("Registering:", formData);
    };

    const handleGoogleSignup = () => {
        console.log("Triggering Google OAuth...");
    };

    return (
        <Card title="NEW_CONSTRUCT">
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

                <Button type="submit">GENERATE PROFILE</Button>
            </form>

            <Divider text="OR LINK WITH" />

            <Button
                variant="google"
                onClick={handleGoogleSignup}
                
            >
                < GoogleLogo /> SYNC VIA GOOGLE
            </Button>

            <div className="auth-links">
                <p>
                    EXISTING PROFILE? <a href="/login">RETURN TO LOGIN</a>
                </p>
            </div>
        </Card>
    );
};

export default Signup;
