import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { userCredential } from "./Signup";

export default function Forgot() {

    const Navigate = useNavigate()
    const [recoveryQue, setRecoveryQue] = useState("");
    const [newPass, setNewPass] = useState("");

    let saveToLocal = () =>{
        localStorage.setItem("userCredentials", JSON.stringify(userCredential));
    }


    let tryForget = () => {
        let confirmation = recoveryQue.trim();
        let newPassword = newPass.trim();
        let result = document.getElementById("result");
        result.style.fontWeight = "bold";

        if (!confirmation || !newPassword) {
            result.innerhtml = "Please fill all the details"
            setTimeout(() => {
                result.innerHTML = ""
            }, 1000);
        }
        else {
            if (confirmation === userCredential.teacher || confirmation === userCredential.school) {
                userCredential.password = newPassword;
                result.style.color = "green";
                result.innerHTML = "Password changed successfully"
                saveToLocal();
                setTimeout(() => {
                    Navigate("/")
                }, 800);
            }
            else {
                result.textContent = "invalid password";
                result.style.colot = "red"
                setTimeout(() => {
                    result.innerHTML = ""
                }, 1000);
            }
        }
    }

    return (
        <>
            <div className="container">
                <h1>Please Answer the Questions: </h1>
                <label htmlFor="confirmTeacher">Enter fav teacher's or school's name:</label>
                <input
                    type="text"
                    name="confirmTeacher"
                    id="confirmTeacher"
                    value={recoveryQue}
                    onChange={(e) => { setRecoveryQue(e.target.value) }}
                />
                <label htmlFor="newPassword">Enter new Password: </label>
                <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={newPass}
                    onChange={(e) => { setNewPass(e.target.value) }}
                />
                <p id="result"></p>
                <button id="changePassword" onClick={tryForget}>SUBMIT</button>
                <button className="backToHome" onClick={() => { Navigate("/") }}>Home</button>
            </div>
        </>
    )
}