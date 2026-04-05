import { useState } from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("Alex");

    const handleAuthAction = () => {
        setIsLoggedIn(!isLoggedIn);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to={"/home"}>
                    i<span style={{ color: "aqua" }}>SAVES</span>
                </Link>
            </div>

            <ul className="navbar-links">
                <li>
                    <Link to={"/"}>Home</Link>
                </li>
                {/* <li>
                    <a href="#features">Features</a>
                </li> */}
                <li>
                    <Link to={"/About-us"} href="#about">About</Link>
                </li>
            </ul>

            <div className="navbar-auth">
                {isLoggedIn ? (
                    <div className="user-profile">
                        <span className="username">Welcome, {username}</span>

                    </div>
                ) : (
                    <Link to={"/login"}
                        className="auth-btn login-btn"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
