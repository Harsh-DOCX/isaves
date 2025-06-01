import { useState } from "react";
import { useNavigate } from "react-router-dom";

export var allPasswords = JSON.parse(localStorage.getItem("allpassword")) || [];

export default function Addpassword() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [platform, setPlatform] = useState("")

    let saveToLocal = () =>{
        localStorage.setItem("allpassword", JSON.stringify(allPasswords));
    }

    let showResult = () =>{
        let result = document.getElementById("result");
        result.style.color = 'green'
        result.textContent = "Password saved successfully. do you wish to continue?"
        setTimeout(() => {
            result.textContent=""
        }, 1100);
    }

    let add = (e) =>{
        e.preventDefault();
        let enteredUsername = username.trim();
        let enteredPassword = password.trim();
        let enteredPlatfrom = platform.trim();
        let details = {
            "username": enteredUsername,
            "password": enteredPassword,
            "platform": enteredPlatfrom
        }
        allPasswords.push(details);
        showResult();
        saveToLocal();
        setUsername("");
        setPassword("");
        setPlatform("")
    }

    return (
        <>
            <form className="container" onSubmit={add}>
                <h1>Add Password</h1>
                <label htmlFor="inputUser">Enter username: </label>
                <input
                    type="text"
                    name="username"
                    id="inputUser"
                    value={username}
                    autoComplete="username"
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                    required
                />
                <label htmlFor="inputPass">Enter Password: </label>
                <input
                    type="password"
                    name="password"
                    id="inputPass"
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                    required
                />
                <label htmlFor="selectPlatform">Select Platform: </label>
                <select name="selectPlatform" id="selectPlatform" value={platform} required onChange={(e)=>{setPlatform(e.target.value)}}>
                    <option value="" disabled> SELECT PLATFORM</option>
                    <option value= "amazon">AMAZON</option>
                    <option value= "banking">BANKING</option>
                    <option value= "discord">DISCORD</option>
                    <option value= "facebook">FACEBOOK</option>
                    <option value= "github">GITHUB</option>
                    <option value= "instagram">INSTAGRAM</option>
                    <option value= "linkedin">LINKEDIN</option>
                    <option value= "mail">MAIL</option>
                    <option value= "microsoft">MICROSOFT</option>
                    <option value= "netflix">NETFLIX</option>
                    <option value= "netlify">NETLIFY</option>
                    <option value= "snapchat">SNAPCHAT</option>
                    <option value= "spotify">SPOTIFY</option>
                    <option value= "steam">STEAM</option>
                    <option value= "telegram">TELEGRAM</option>
                    <option value= "twitter">TWITTER</option>
                    <option value= "upi">UPI</option>
                    <option value= "other">OTHER</option>
                </select>
                <p id="result"></p>
                <button type="submit" className="add">SUBMIT</button>
                <button className="backToHome" onClick={()=>{navigate("/")}}>Home</button>
            </form>
        </>
    )
}