import { Link } from "react-router-dom";

export default function LoggedOutHome() {
    return (
        <main className="landing-view">
            <section className="hero-panel">
                <div className="hero-copy">
                    <span className="hero-badge">
                        Password Manager for Modern Teams and Individuals
                    </span>
                    <h1 className="hero-title">
                        Secure your digital life with a vault built for clarity,
                        speed, and control.
                    </h1>
                    <p className="hero-subtitle">
                        iSAVES helps you store credentials, generate stronger
                        passwords, and access your private vault through a
                        focused session-based workflow.
                    </p>
                    <div className="hero-cta-row">
                        <Link to="/sign-up" className="primary-btn hero-btn">
                            Create Secure Vault
                        </Link>
                        <Link to="/login" className="secondary-btn ghost-btn hero-btn">
                            Log In
                        </Link>
                    </div>
                    <ul className="hero-trust-list" aria-label="Security highlights">
                        <li>Encrypted vault records</li>
                        <li>JWT-based authentication</li>
                        <li>No remember-me session storage</li>
                    </ul>
                </div>

                <aside className="hero-visual" aria-label="Vault preview">
                    <div className="signal-orb"></div>
                    <div className="vault-preview-card">
                        <p className="preview-label">Active Security Layers</p>
                        <div className="preview-metric">
                            <span className="preview-value">256-bit</span>
                            <span className="preview-caption">
                                vault encryption profile
                            </span>
                        </div>
                        <div className="preview-grid">
                            <div className="preview-chip">
                                <span className="chip-title">Session Access</span>
                                <span className="chip-copy">
                                    Short-lived auth tokens
                                </span>
                            </div>
                            <div className="preview-chip">
                                <span className="chip-title">Credential Vault</span>
                                <span className="chip-copy">
                                    Add and review saved entries
                                </span>
                            </div>
                            <div className="preview-chip">
                                <span className="chip-title">Generator</span>
                                <span className="chip-copy">
                                    Create stronger access keys
                                </span>
                            </div>
                            <div className="preview-chip">
                                <span className="chip-title">Recovery Flow</span>
                                <span className="chip-copy">
                                    Dedicated restore entry point
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            <section className="stats-band" aria-label="Platform summary">
                <article className="stat-strip-card">
                    <strong>Fast onboarding</strong>
                    <span>
                        Create an account and move directly into your vault.
                    </span>
                </article>
                <article className="stat-strip-card">
                    <strong>Focused security</strong>
                    <span>
                        Built around session auth instead of persistent
                        remember-me shortcuts.
                    </span>
                </article>
                <article className="stat-strip-card">
                    <strong>Credential workflow</strong>
                    <span>
                        Save, review, and copy passwords from one dashboard.
                    </span>
                </article>
            </section>

            <section
                className="features-section"
                aria-labelledby="feature-heading"
            >
                <div className="section-heading">
                    <p className="section-kicker">Why iSAVES</p>
                    <h2 id="feature-heading">
                        A sharper vault experience without the clutter.
                    </h2>
                </div>

                <div className="features-grid">
                    <article className="feature-card">
                        <div className="feature-icon">01</div>
                        <h3>Encrypted vault architecture</h3>
                        <p>
                            Credential records are encrypted before storage so
                            the vault behaves like a real security layer instead
                            of a plain notes app.
                        </p>
                    </article>
                    <article className="feature-card">
                        <div className="feature-icon">02</div>
                        <h3>Session-first authentication</h3>
                        <p>
                            The login flow keeps access temporary by design,
                            which is a better fit for a password manager than
                            sticky long-term device trust.
                        </p>
                    </article>
                    <article className="feature-card">
                        <div className="feature-icon">03</div>
                        <h3>Password generation built in</h3>
                        <p>
                            Create stronger credentials directly from the
                            add-password flow instead of relying on separate
                            tools or weak manual habits.
                        </p>
                    </article>
                </div>
            </section>

            <section
                className="workflow-section"
                aria-labelledby="workflow-heading"
            >
                <div className="section-heading">
                    <p className="section-kicker">Workflow</p>
                    <h2 id="workflow-heading">
                        From landing page to protected vault in three steps.
                    </h2>
                </div>

                <div className="workflow-grid">
                    <article className="workflow-step">
                        <span className="workflow-index">1</span>
                        <h3>Create your account</h3>
                        <p>
                            Register with username, email, and master password
                            to initialize your private vault.
                        </p>
                    </article>
                    <article className="workflow-step">
                        <span className="workflow-index">2</span>
                        <h3>Authenticate securely</h3>
                        <p>
                            Log in through the session-based auth flow and
                            enter the protected dashboard.
                        </p>
                    </article>
                    <article className="workflow-step">
                        <span className="workflow-index">3</span>
                        <h3>Store and manage credentials</h3>
                        <p>
                            Add saved logins, generate stronger passwords, and
                            copy them when needed.
                        </p>
                    </article>
                </div>
            </section>
        </main>
    );
}
