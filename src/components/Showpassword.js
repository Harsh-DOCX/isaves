import { useState, useEffect } from "react";
import { allPasswords as initialPasswords } from "./Addpassword";

export default function Showpassword() {
    const [passwords, setPasswords] = useState([]);
    const [revealPasswords, setRevealPasswords] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("allpassword");
        if (stored) {
            const parsed = JSON.parse(stored);
            setPasswords(parsed);
            setRevealPasswords(parsed.map(() => false)); // initialize all to hidden
        } else {
            setPasswords([...initialPasswords]);
            setRevealPasswords(initialPasswords.map(() => false));
        }
    }, []);

    const toggleReveal = (index) => {
        const updatedReveal = [...revealPasswords];
        updatedReveal[index] = !updatedReveal[index];
        setRevealPasswords(updatedReveal);
    };

    const saveToLocal = (updatedPasswords) => {
        localStorage.setItem("allpassword", JSON.stringify(updatedPasswords));
    };

    const removePassword = (indexToRemove) => {
        const updated = passwords.filter((_, i) => i !== indexToRemove);
        setPasswords(updated);
        saveToLocal(updated);

        const updatedReveal = revealPasswords.filter((_, i) => i !== indexToRemove);
        setRevealPasswords(updatedReveal);
    };

    if (initialPasswords.length > 0) {

        return (
            <div className="allPasswordContainer">
                {passwords.map((item, index) => (
                    <div className={`password${index} passwordContainer`} key={index}>
                        <div className="imgHolder">
                            <img
                                src={`./images/${item.platform}.png`}
                                alt={item.platform}
                                className="img"
                            />
                        </div>

                        <div className="detailsHolder">
                            <h3 className="id">{item.username}</h3>
                            <h4 className="password">
                                {revealPasswords[index]
                                    ? item.password
                                    : "*".repeat(item.password.length)}
                            </h4>
                        </div>

                        <div className="eyeHolder" onClick={() => toggleReveal(index)}>
                            <i
                                className={`fas ${revealPasswords[index] ? "fa-eye-slash" : "fa-eye"
                                    } fa-2x`}
                            ></i>
                        </div>

                        <div className="removeButtonHolder">
                            <button
                                className="removeButton"
                                onClick={() => removePassword(index)}
                            >
                                REMOVE
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    else{
        return(
            <h2 className="result" style={
                {
                    marginTop: "30px",
                    color: "red"
                }
            }>NOTHING TO DISPLAY HERE.. <br />Click on the "iSaves" to go  back to home</h2>
        )
    }
}