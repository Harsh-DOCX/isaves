// Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const userCredential = JSON.parse(localStorage.getItem("userCredentials")) || {
    password: "",
    teacher: "",
    school: ""
};

export default function Signup() {
    const Navigate = useNavigate();
    const [teacher, setTeacher] = useState("");
    const [school, setSchool] = useState("");
    const [password, setPassword] = useState("");

    const saveToLocal = () => {
        localStorage.setItem("userCredentials", JSON.stringify(userCredential));
    };

    const signup = () => {
        const userPassword = password.trim();
        const userSchool = school.trim();
        const userTeacher = teacher.trim();

        if (!userPassword || !userSchool || !userTeacher) {
            document.getElementById("result").textContent = "Please fill all the required details!";
        } else {
            userCredential.school = userSchool;
            userCredential.password = userPassword;
            userCredential.teacher = userTeacher;

            saveToLocal();
            document.getElementById("result").textContent = "Signup successful!";
        }
    };

    return (
        <div className="container">
            <h1>Please Sign-up First</h1>
            <label htmlFor="createSchool">Enter your school name: </label>
            <input
                type="text"
                id="createSchool"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
            />
            <label htmlFor="createTeacher">Enter your Fav. Teacher's name: </label>
            <input
                type="text"
                id="createTeacher"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
            />
            <label htmlFor="createPassword">Create Password: </label>
            <input
                type="password"
                id="createPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <p id="result"></p>
            <button onClick={signup}>SUBMIT</button>
            <button className="backToHome" onClick={()=>{Navigate("/")}}>Home</button>
        </div>
    );
}
