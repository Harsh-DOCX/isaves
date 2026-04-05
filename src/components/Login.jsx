import {useState} from "react";
import { Link } from "react-router-dom";
import Card from "./ui/Card";
import Input from "./ui/Input";
import Button from "./ui/Button";
import Divider from "./ui/Divider";
import GoogleLogo from "./ui/GoogleLogo";



const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging in with:", email, password);
            
    };

    const handleGoogleLogin = () => {
        console.log("Triggering Google OAuth...");
    };

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

                <Button type="submit">INITIALIZE CONNECTION</Button>
            </form>

            <Divider text="OR BYPASS WITH" />

            <Button
                variant="google"
                onClick={handleGoogleLogin}
                icon={<GoogleLogo />}
            >
                AUTHENTICATE VIA GOOGLE
            </Button>

            <div className="auth-links">
                <p>
                    <Link to={"/forget-Password"}>LOST ACCESS_KEY?</Link>
                </p>
                <p>
                    NO PROFILE? <Link to={"/sign-up"}>REGISTER CONSTRUCT</Link>
                </p>
            </div>
        </Card>
    );
};

export default Login;