let loginPage = document.createElement("div");
    loginPage.id = "login-page";
    loginPage.className = "main";


let passLabel = document.createElement("label");
    passLabel.htmlFor = "enterUserPassword";
    passLabel.innerText = "Enter Password";

let enterPassword = document.createElement("input");
    enterPassword.id = "enterUserPassword"
    enterPassword.setAttribute("type", "password");

let forgetLink = document.createElement("h5");
    forgetLink.textContent =" forget password";
    forgetLink.style.textDecoration = "underline"
    forgetLink.style.font = "italic";
    forgetLink.style.cursor = "pointer";
    forgetLink.style.textShadow = "none";
    forgetLink.id = "forgetPassword"

let submit = document.createElement("button");
    submit.textContent = "LOGIN";
    submit.id = "login-btn"

let changeAlert = document.createElement("p");
    changeAlert.textContent = "want to change password? "
    changeAlert.style.textShadow = "none";
    changeAlert.style.fontSize = "0.8rem";
    changeAlert.style.fontWeight = "bold"

let change = document.createElement("span");
    change.textContent = "click here";
    change.style.textDecoration = "underline"
    change.style.font = "italic";
    change.style.cursor = "pointer";
    change.style.color = "purple";
    change.id = "changePassword;"


loginPage.appendChild(passLabel);
loginPage.appendChild(enterPassword);
loginPage.appendChild(forgetLink);
loginPage.appendChild(submit);
loginPage.appendChild(changeAlert);
    changeAlert.appendChild(change);

export default loginPage;