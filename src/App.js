// dependencies
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

// components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Recovery from "./components/Recovery";
import AddPassword from "./components/Addpassword";
import Footer from "./components/Footer";
import About from "./components/About";

// css
import "./assets/css/Home.css";
import "./assets/css/navbar.css";
import "./assets/css/auth.css";
import "./assets/css/app.css";
import "./assets/css/About.css";
import "./assets/css/Footer.css";

const LayoutWithNavbar = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
};

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route element={<LayoutWithNavbar />}>
                        <Route path="/home" element={<Home isLoggedIn={true}/>} />
                        <Route path="/" element={<Home isLoggedIn={true}/>} />
                        <Route path="/add-password" element={<AddPassword/>} />
                        <Route path="About-us" element={<About />} />
                    </Route>

                    <Route path="/login" element={<Login />} />
                    <Route path="/sign-up" element={<Signup />} />
                    <Route path="/forget-Password" element={<Recovery />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;