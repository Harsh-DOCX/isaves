import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { userCredential } from "./Signup";
export default function Login() {
    const [password, setPassword] = useState("");
    const Navigate = useNavigate()


    let tryLogin = () => {
        let enteredPassword = password.trim();
        let result = document.getElementById("result")
        result.style.display = "flex";
        result.style.alignItems = "center"
        result.style.justifyContent = "center";
        result.style.flexDirection = "column"
        result.style.fontWeight = "bold"
        if (!enteredPassword) {
            result.textContent = "Please enter your password."
            result.style.color = "red"
            setTimeout(() => {
                result.textContent = ""
            }, 2000);
        }
        else {
            if (enteredPassword === userCredential.password) {
                result.innerHTML = `
                    Logged in successfully
                    <p>Redirecting...</p>
                    <div class="wait"></div>
                `;
                result.style.color = "green";
                setTimeout(() => {
                    Navigate("/show-passwords")
                }, 2500);
            }
            else {
                result.textContent = "Invalid password";
                result.style.color = "red";
                setTimeout(() => {
                    result.textContent = ""
                }, 3000);
            }
        }
    }

    return (
        <>
            <div className="container">
                <h1>Please Login First.</h1>
                <label htmlFor="userPass">Enter your password: </label>
                <input
                    type="password"
                    name="password"
                    id="userPass"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <p> <Link to={"/forget-password"}> forgot password</Link></p>
                <p className="result" id="result"></p>

                <button className="submitUserPAssword" id="submitUserPAssword" onClick={tryLogin}>SUBMIT</button>
                <p>want to change Credentials? <Link to={"/change-credentials"}>click here</Link> </p>
                <button className="backToHome" onClick={() => { Navigate("/") }}>Home</button>
            </div>
        </>
    )
}