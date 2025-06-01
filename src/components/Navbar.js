import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar(){
    const navigate = useNavigate();
    const [light, setLight] = useState(false)

    const changeTheme = () =>{
        setLight(!light)
        const clickTheme = document.getElementById("clickTheme")
        document.body.classList.toggle("light")
        if(!light){
            clickTheme.classList.add("fa-moon");
            clickTheme.classList.remove("fa-sun");
        }
        else{
            clickTheme.classList.add("fa-sun");
            clickTheme.classList.remove("fa-moon");
        }
    }

    return(
        <>
            <nav className="nav navbar">
                <div className="logo" onClick={()=>{navigate("/")}}>
                    i<span>SAVES</span>
                </div>
                <div className="feature">
                    <i className="fa-solid fa-sun" id='clickTheme' onClick={changeTheme}></i>
                </div>
            </nav>
        </>
    )
}