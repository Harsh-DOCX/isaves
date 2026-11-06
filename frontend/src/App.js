import {
    BrowserRouter as Router,
    Navigate,
    Outlet,
    Route,
    Routes,
} from "react-router-dom";

import { useAuth } from "./AuthContext";
import AddPassword from "./components/Addpassword";
import About from "./components/About";
import Footer from "./components/Footer";
import Home from "./components/Home";
import LoggedHome from "./components/LoggedHome";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Recovery from "./components/Recovery";
import Signup from "./components/Signup";
import CookieBanner from "./components/CookieBanner";

import "./assets/css/Home.css";
import "./assets/css/navbar.css";
import "./assets/css/auth.css";
import "./assets/css/app.css";
import "./assets/css/About.css";
import "./assets/css/Footer.css";
import "./assets/css/dialog.css";
import "./assets/css/siteExtras.css";

const LayoutWithNavbar = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
};

const PublicOnlyRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    return user ? <Navigate to="/vault" replace /> : children;
};

const App = () => {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route element={<LayoutWithNavbar />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Navigate to="/vault" replace />} />
                    <Route
                        path="/vault"
                        element={(
                            <ProtectedRoute>
                                <LoggedHome />
                            </ProtectedRoute>
                        )}
                    />
                    <Route
                        path="/add-password"
                        element={(
                            <ProtectedRoute>
                                <AddPassword />
                            </ProtectedRoute>
                        )}
                    />
                    <Route path="/About-us" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                </Route>

                <Route
                    path="/login"
                    element={(
                        <PublicOnlyRoute>
                            <Login />
                        </PublicOnlyRoute>
                    )}
                />
                <Route
                    path="/sign-up"
                    element={(
                        <PublicOnlyRoute>
                            <Signup />
                        </PublicOnlyRoute>
                    )}
                />
                <Route path="/forget-Password" element={<Recovery />} />
            </Routes>
            <CookieBanner />
        </Router>
    );
};

export default App;
