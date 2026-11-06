import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const NotFound = () => {
    const { user } = useAuth();

    return (
        <main className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-visual" aria-hidden="true">
                    <span className="not-found-orbit not-found-orbit-outer" />
                    <span className="not-found-orbit not-found-orbit-inner" />
                    <span className="not-found-code">404</span>
                    <span className="not-found-signal">SIGNAL LOST</span>
                </div>
                <p className="not-found-kicker">Page not found</p>
                <h1 id="not-found-title">This page is off the map.</h1>
                <p className="not-found-description">
                    The link may be outdated, or the page may have moved. Let&apos;s
                    get you back to somewhere safe.
                </p>
                <Link className="not-found-link" to={user ? "/vault" : "/"}>
                    {user ? "Return to your vault" : "Back to home"}
                    <span aria-hidden="true">→</span>
                </Link>
            </div>
        </main>
    );
};

export default NotFound;
