let platforms = [
    'amazon', 'banking','discord', 'facebook','github', 
    'instagram', 'linkedin', 'mail','microsoft', 'netflix',
    'netlify', 'snapchat', 'spofity', 'steam', 
    'telegram', 'twitter', 'upi', 'other']

let addPasswordPage = document.createElement("div")
    addPasswordPage.className = "main";

let h1 = document.createElement("h1");
    h1.innerHTML = "ADD A PASSWORD";

let idLabel = document.createElement("label");
    idLabel.htmlFor = "enterId";
    idLabel.innerHTML = "Enter User I'd";

let userId = document.createElement("input");
    userId.setAttribute('type', "text");
    userId.setAttribute('id', "enterId");
    userId.setAttribute("class", "getData");;

let passLabel = document.createElement("label");
    passLabel.htmlFor = "enterPass";
    passLabel.innerHTML = "Enter password";

let userPassword = document.createElement("input");
    userPassword.setAttribute("type", "password");
    userPassword.setAttribute('id', "enterPassword");
    userPassword.setAttribute("class", "getData");

let typeLabel = document.createElement("label");
    typeLabel.innerHTML = "Select the password type: ";
    typeLabel.htmlFor = "passwordType";

let select = document.createElement("select");
    select.id = "passwordType";
    select.setAttribute("class", "getData");
    
let disable = document.createElement("option");
    disable.disabled = "true";
    disable.selected = "true";
    disable.textContent = "SELECT PLATFORM"
    select.appendChild(disable)

platforms.forEach(element => {
    let option = document.createElement("option");
    option.setAttribute("value", `${element}`);
    option.innerHTML = `${element.toUpperCase()}`
    select.appendChild(option)
});

let save = document.createElement("button");
    save.id="savePassword";
    save.innerHTML = "SAVE"

let backToHome = document.createElement("button");
    backToHome.id = "backToHome";
    backToHome.innerHTML = "BACK"

addPasswordPage.appendChild(h1)
addPasswordPage.appendChild(idLabel);
addPasswordPage.appendChild(userId);
addPasswordPage.appendChild(passLabel);
addPasswordPage.appendChild(userPassword);
addPasswordPage.appendChild(typeLabel);
addPasswordPage.appendChild(select);
addPasswordPage.appendChild(save);
addPasswordPage.appendChild(backToHome);

export default addPasswordPage;