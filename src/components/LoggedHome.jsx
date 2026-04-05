import { Link } from "react-router-dom";

export default function LoggedHome() {
    return (
        <>
            <div className="dashboard-view">
                <header className="dashboard-header">
                    <h1>Your Secure Vault</h1>
                    <Link to={"/add-password"} className="primary-btn">+ Add Password</Link>
                </header>

                <div className="vault-stats">
                    <div className="stat-card">
                        <h3>Total Logins</h3>
                        <p className="stat-number">42</p>
                    </div>
                    <div className="stat-card">
                        <h3>Weak Passwords</h3>
                        <p className="stat-number warning">3</p>
                    </div>
                    <div className="stat-card">
                        <h3>Compromised</h3>
                        <p className="stat-number danger">0</p>
                    </div>
                </div>

                <div className="recent-logins">
                    <h2>Recently Used</h2>
                    <ul className="password-list">
                        <li className="password-item">
                            <span className="site-name">GitHub</span>
                            <span className="hidden-pass">••••••••••••</span>
                            <button className="copy-btn">Copy</button>
                        </li>
                        <li className="password-item">
                            <span className="site-name">Google Workspace</span>
                            <span className="hidden-pass">••••••••••••</span>
                            <button className="copy-btn">Copy</button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
