import React, { useState } from "react";

const Recovery = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleRecovery = (e) => {
        e.preventDefault();
        console.log("Sending recovery link to:", email);
        // Implement password reset logic here
        setSubmitted(true);
    };

    return (
        <div className="futuristic-container">
            <div className="auth-card">
                <h2 className="auth-title">RESTORE_ACCESS</h2>

                {!submitted ? (
                    <form onSubmit={handleRecovery}>
                        <p
                            style={{
                                color: "#888",
                                marginBottom: "20px",
                                fontSize: "14px",
                            }}
                        >
                            ENTER YOUR IDENTIFIER TO RECEIVE A DECRYPTION LINK.
                        </p>
                        <div className="input-group">
                            <label>IDENTIFIER [EMAIL]</label>
                            <input
                                type="email"
                                className="futuristic-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="primary-btn">
                            TRANSMIT PROTOCOL
                        </button>
                    </form>
                ) : (
                    <div>
                        <p
                            style={{
                                color: "#00f3ff",
                                marginBottom: "20px",
                                textShadow: "0 0 5px #00f3ff",
                            }}
                        >
                            PROTOCOL TRANSMITTED. CHECK YOUR NETWORK MESSAGES.
                        </p>
                    </div>
                )}

                <div className="auth-links" style={{ marginTop: "30px" }}>
                    <p>
                        <a href="/login">ABORT & RETURN</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Recovery;
