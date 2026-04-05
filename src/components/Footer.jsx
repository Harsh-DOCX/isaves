import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <h2>
                        i<span style={{ color: "aqua" }}>SAVES</span>
                    </h2>
                    <p>Securing your digital existence.</p>
                </div>
                
                <div className="footer-links-group">
                    <h4>NAVIGATION</h4>
                    <ul className="footer-links">
                        <li><Link to="/home">Home / Vault</Link></li>
                        <li><Link to="/About-us">About Protocol</Link></li>
                        <li><Link to="/login">System Login</Link></li>
                    </ul>
                </div>

                
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} iSAVES Protocol. All rights reserved.</p>
                <div className="scanline-divider"></div>
            </div>
        </footer>
    );
};

export default Footer;