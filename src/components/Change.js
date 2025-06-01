import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { userCredential } from "./Signup";
export default function Change() {
    const Navigate = useNavigate();
    const [oldPass, setoldPass] = useState("");
    const [teacher, setTeacher] = useState("");
    const [school, setSchool] = useState("");
    const [password, setPassword] = useState("")

    let saveToLocal = () =>{
        localStorage.setItem("userCredentials", JSON.stringify(userCredential));
    }

    let tryChange = () =>{

        let result = document.getElementById("result");
        result.style.fontWeight = "bold";
        const oldPassword = oldPass.trim();
        const enteredTeacher = teacher.trim();
        const enteredSchool = school.trim();
        const newPassword = password.trim();

        if(!oldPassword || !enteredSchool || !enteredTeacher || !newPassword){
            result.textContent = "please enter all the feilds";
            result.style.color = "red";
        }
        else{
            if(oldPassword === userCredential.password){
                userCredential.password = newPassword;
                userCredential.teacher = enteredTeacher;
                userCredential.school = enteredSchool;
                result.textContent = "Credentials changed successfully."
                result.style.color = "green"
                saveToLocal();
                setTimeout(() => {
                    Navigate("/")
                }, 600);
            }
        }

    }

    return (
        <>
            <div className="container">
                <h1>CHANGE CREDENTIALS</h1>
                <label htmlFor="oldPass">Enter old password: </label>
                <input
                    type="password"
                    name="oldPass"
                    id="oldPass"
                    value={oldPass}
                    onChange={(e)=>{setoldPass(e.target.value)}}
                />

                <label htmlFor="createSchool">Enter new school name: </label>
                <input
                    type="text"
                    name="createSchool"
                    id="createSchool"
                    value={school}
                    onChange={(e) => { setSchool(e.target.value) }}
                />

                <label htmlFor="createTeacher">Enter new Fav. Teacher's name: </label>
                <input
                    type="text"
                    name="createTeacher"
                    id="createTeacher"
                    value={teacher}
                    onChange={(e) => { setTeacher(e.target.value) }}
                />

                <label htmlFor="createPassword">Enter new Password: </label>
                <input
                    type="password"
                    name="createPassword"
                    id="createPassword"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <p id="result"></p>
                <button onClick={tryChange}>SUBMIT</button>
                <button className="backToHome" onClick={()=>{Navigate("/")}}>Home</button>
            </div>
        </>
    )
}