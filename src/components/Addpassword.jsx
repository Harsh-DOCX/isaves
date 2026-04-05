import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "./ui/Card";
import Input from "./ui/Input";
import Button from "./ui/Button";

const AddPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        siteName: "",
        username: "",
        password: "",
        notes: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = () => {
        // Generates a random 16-character secure password
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|?><";
        let newPassword = "";
        for (let i = 0; i < 16; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, password: newPassword });
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Storing new credential:", formData);
        
        // After saving, redirect the user back to the dashboard
        navigate("/home");
    };

    return (
        <Card title="ADD_CREDENTIAL">
            <form onSubmit={handleSave}>
                <Input
                    id="site-input"
                    label="SYSTEM [SITE NAME / URL]"
                    name="siteName"
                    type="text"
                    value={formData.siteName}
                    onChange={handleChange}
                    required
                />

                <Input
                    id="username-input"
                    label="IDENTIFIER [USERNAME / EMAIL]"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <div style={{ position: "relative", marginBottom: "20px" }}>
                    <Input
                        id="password-input"
                        label="ACCESS_KEY [PASSWORD]"
                        name="password"
                        type="text" // Keeping as text so user can see what gets generated
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {/* Inline Generate Button */}
                    <button
                        type="button"
                        onClick={handleGenerate}
                        style={{
                            position: "absolute",
                            right: "8px",
                            top: "32px",
                            background: "rgba(0, 243, 255, 0.1)",
                            color: "#00f3ff",
                            border: "1px solid #00f3ff",
                            borderRadius: "4px",
                            padding: "6px 10px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontFamily: "'Orbitron', sans-serif",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => e.target.style.background = "rgba(0, 243, 255, 0.3)"}
                        onMouseOut={(e) => e.target.style.background = "rgba(0, 243, 255, 0.1)"}
                    >
                        GENERATE
                    </button>
                </div>

                <Input
                    id="notes-input"
                    label="LOGS [NOTES]"
                    name="notes"
                    type="text"
                    value={formData.notes}
                    onChange={handleChange}
                />

                <Button type="submit">STORE CREDENTIAL</Button>
            </form>
            
            <div className="auth-links" style={{ marginTop: "20px" }}>
                <p><Link to="/home">ABORT & RETURN</Link></p>
            </div>
        </Card>
    );
};

export default AddPassword;