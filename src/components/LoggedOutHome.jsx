import { Link } from "react-router-dom";

export default function LoggedOutHome() {
    return (
        <>
            <div className="landing-view">
                <div className="hero-section">
                    <h1 className="hero-title">Secure Your Digital Life</h1>
                    <p className="hero-subtitle">
                        The ultimate vault to store, generate, and autofill your
                        passwords safely. Never forget a password again.
                    </p>
                    <Link to={"/login"} className="primary-btn hero-btn">
                        Create Free Account
                    </Link>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>AES-256 Encryption</h3>
                        <p>
                            Your data is locked with military-grade,
                            zero-knowledge encryption.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Password Generator</h3>
                        <p>
                            Create strong, unique, and complex passwords with a
                            single click.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Cross-Device Sync</h3>
                        <p>
                            Access your vault seamlessly from your phone,
                            tablet, or desktop.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
