import { useNavigate } from "react-router-dom"
import { userCredential } from "./Signup";
export default function Home(){
    const navigate = useNavigate();

    let checkStatus = () =>{
        if(userCredential.password){
            navigate("/login");
        }
        else{
            navigate("/sign-up");
        }
    }

    return(
        <>
            <div className="container">
                <h1>ISAVES</h1> <br />
                <h2>Welcome to Isaves</h2> <br />
                <h3>Your one stop destination to save all your passwords</h3> <br />
                <button className="add-btn" id="add-btn" onClick={()=>{navigate("/add-password")}}>Add Password</button><br />
                <button className="show-btn" id="show-btn" onClick={checkStatus}>Show Passwords</button>
            </div>
        </>
    )
}