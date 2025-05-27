// Each Components 
import Home from "./components/Home.js";
import addPasswordPage from "./components/Addpassword.js";
import loginPage from "./components/Login.js";
import signup from "./components/Signup.js";

//Each pages
let body = document.body
let home = document.getElementById("home-section");     //Home page
let addPassword = document.getElementById("add-section");       //add password page
let loginPageSection = document.getElementById("login-section");       //login page
let signupPage = document.getElementById("signup-section");     //signup page
let recoverPage = document.getElementById("recover-section");   //recover user password or credentialsq bnn vvv
let showPasswordPage = document.getElementById("show-section"); //show all passwords
const allPages = Array.from(document.querySelectorAll("section"))     //all sections

// creating each pages
home.appendChild(Home)
addPassword.appendChild(addPasswordPage);
loginPageSection.appendChild(loginPage);
signupPage.appendChild(signup);

// change theme
document.getElementById("changeTheme").addEventListener("click", () => {
    body.classList.toggle("light")
})


// required buttons or links
let addPasswordButton = Home.querySelector("#add-button")       //add new password button
let showPasswordButton = Home.querySelector("#show-button")     //show all password buttom
let signupButton = document.getElementById("signUpBtn");
let backToHome = Array.from(document.querySelectorAll("#backToHome"))     //backto home button
let loginButton = document.getElementById("login-btn");


// redirect to add password page
addPasswordButton.addEventListener("click", () => {
    allPages.forEach(element => {
        element.classList.add("hidden")
    });
    addPassword.classList.remove("hidden")
})

// go back to home (clicking on isaves also redirect to home)
let returnHome = () => {
    allPages.forEach(element => {
        element.style.display = "none"
    })
    home.style.display = "flex"
}

backToHome.forEach(button => {
    button.addEventListener("click", returnHome)
})


// logic for signup
let userCredential = JSON.parse(localStorage.getItem("userCredentials")) || {
    teacher: "",
    school: "",
    password: ""
};

let saveCredentials = () => {
    localStorage.setItem("userCredentials", JSON.stringify(userCredential))
}

let trySignup = () => {

    let teacher = document.getElementById("createTeacher").value;
    let school = document.getElementById("createSchool").value;
    let password = document.getElementById("createPassword").value;
    if (!teacher || !school || !password) {
        alert("please enter all fields");
        return;
    }
    else {
        userCredential.teacher = teacher.trim();
        userCredential.school = school.trim();
        userCredential.password = password.trim();
        saveCredentials()
        alert("credentials saved successfully.")
        returnHome();
    }
}

signupButton.addEventListener("click", trySignup)


// logic for login
let tryLogin = () => {
    let enteredPassword = document.getElementById("enterUserPassword").value;
    if (enteredPassword === userCredential.password) {
        alert("Logged-in successfully!");
        allPages.forEach(element => {
            element.style.display = "none"
        })
        showPasswordPage.style.display = "flex"
    }
    else {
        alert("invalid password")
    }
    document.getElementById("enterUserPassword").value = "";
}

loginButton.addEventListener("click", tryLogin)
document.getElementById("enterUserPassword").addEventListener("keydown", (e)=>{
    if(e.key==="enter"){
        tryLogin();
    }
})

// decide between login or signup

let identifyStatus = () =>{
    if(!userCredential.teacher || !userCredential.school || !userCredential.password){
        allPages.forEach(e =>{
            e.style.display = 'none';
        })
        signupPage.style.display = "flex";
    }
    else{
        allPages.forEach(e =>{
            e.style.display = 'none';
        })
        loginPageSection.style.display = "flex";
    }
}

showPasswordButton.addEventListener("click", identifyStatus)