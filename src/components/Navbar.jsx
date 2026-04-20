import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const isLoggedIn = Boolean(user);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to={isLoggedIn ? "/vault" : "/"}>
                    i<span style={{ color: "aqua" }}>SAVES</span>
                </Link>
            </div>

            <ul className="navbar-links">
                <li>
                    <Link to={isLoggedIn ? "/vault" : "/"}>
                        {isLoggedIn ? "Vault" : "Home"}
                    </Link>
                </li>
                {isLoggedIn && (
                    <li>
                        <Link to="/add-password">Add Credential</Link>
                    </li>
                )}
                <li>
                    <Link to="/About-us">About</Link>
                </li>
            </ul>

            <div className="navbar-auth">
                {isLoggedIn ? (
                    <div className="user-profile">
                        <span className="username">Welcome, {user.username}</span>
                        <button
                            type="button"
                            className="auth-btn logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="guest-actions">
                        <Link to="/sign-up" className="auth-btn signup-btn">
                            Sign Up
                        </Link>
                        <Link to="/login" className="auth-btn login-btn">
                            Login
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
