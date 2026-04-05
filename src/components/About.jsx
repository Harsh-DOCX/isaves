const About = () => {
    return (
        <div className="home-container">
            <div className="about-wrapper">
                <div className="hero-section text-center">
                    <h1 className="hero-title">The Architect's Vision</h1>
                    <p className="hero-subtitle" style={{ margin: "0 auto 3rem" }}>
                        Born from the necessity of absolute digital security, iSAVES is a state-of-the-art password management protocol designed for the modern web.
                    </p>
                </div>

                <div className="about-grid">
                    <div className="feature-card about-card">
                        <div className="feature-icon" style={{ color: "#00f3ff" }}>👁️‍🗨️</div>
                        <h3>Zero-Knowledge Architecture</h3>
                        <p>
                            We cannot see your data. Your vault is encrypted locally on your device before it ever reaches our servers. Only your Master Access Key can decrypt the payload.
                        </p>
                    </div>

                    <div className="feature-card about-card">
                        <div className="feature-icon" style={{ color: "#bc13fe" }}>🛡️</div>
                        <h3>Encription</h3>
                        <p>
                            Your data is protected by a robust custom security system designed to resist brute-force attacks and unauthorized access.
                        </p>
                    </div>
                </div>

                {/* Updated MERN Stack Section */}
                <div className="tech-stack-section">
                    <h2 className="auth-title" style={{ textAlign: "center", marginTop: "4rem" }}>SYSTEM COMPONENTS</h2>
                    <p style={{ textAlign: "center", color: "#888", marginBottom: "1.5rem" }}>
                        Powered by the MERN Stack
                    </p>
                    <div className="stack-badges">
                        <span className="badge mongo">MongoDB</span>
                        <span className="badge express">Express.js</span>
                        <span className="badge react">React.js</span>
                        <span className="badge node">Node.js</span>
                    </div>
                </div>

                {/* New Developer Section */}
                <div className="developer-section">
                    <h2 className="auth-title" style={{ textAlign: "center", marginTop: "4rem", fontSize: "1.2rem" }}>
                        INITIATED BY
                    </h2>
                    <div className="dev-card">
                        <p>System Architect & Lead Developer</p>
                        <a 
                            href="https://github.com/Harsh-DOCX/isaves" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="github-btn"
                        >
                            <svg viewBox="0 0 24 24" className="github-icon">
                                <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                            VIEW GITHUB REPOSITORY
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;