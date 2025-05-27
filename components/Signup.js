let signup = document.createElement("div");
    signup.id = "signup-page";
    signup.className = "main";

let h2 = document.createElement("h2");
    h2.textContent = "Please set a password";

let teacherLabel = document.createElement("label");
    teacherLabel.htmlFor = "createTeacher";
    teacherLabel.innerText = "Enter your fav. teacher";

let createTeacher = document.createElement("input");
    createTeacher.id = "createTeacher"
    createTeacher.setAttribute("type", "text");

let schoolLabel = document.createElement("label");
    schoolLabel.htmlFor = "createSchool";
    schoolLabel.innerText = "Enter your school name: ";

let createSchool = document.createElement("input");
    createSchool.id = "createSchool"
    createSchool.setAttribute("type", "text");

let passLabel = document.createElement("label");
    passLabel.htmlFor = "createPassword";
    passLabel.innerText = "Enter Password";

let createPassword = document.createElement("input");
    createPassword.id = "createPassword";
    createPassword.setAttribute("type", "password");

let submit = document.createElement("button");
    submit.textContent = "SIGN-UP"
    submit.id = "signUpBtn"

signup.appendChild(h2);
signup.appendChild(teacherLabel);
signup.appendChild(createTeacher);
signup.appendChild(schoolLabel);
signup.appendChild(createSchool);
signup.appendChild(passLabel)
signup.appendChild(createPassword)
signup.appendChild(submit)

export default signup