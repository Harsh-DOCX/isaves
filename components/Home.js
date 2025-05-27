

let Home = document.createElement("div");
    Home.className = "main";
    
let h1 = document.createElement("h1");
    h1.innerHTML = "iSaves";
    

let h2 = document.createElement("h2");
    h2.innerHTML = "WELCOME TO ISAVES";

let h3 = document.createElement("h3");
    h3.innerHTML = "Your one step destination to save all passwords";

let addButton = document.createElement("button");
    addButton.id = "add-button";
    addButton.innerHTML = "Add password"
    
let showButton = document.createElement("button");
    showButton.id = "show-button";
    showButton.innerHTML = "Show passwords"

Home.appendChild(h1)
Home.appendChild(document.createElement("br"))
Home.appendChild(h2);
Home.appendChild(document.createElement("br"))
Home.appendChild(h3)
Home.appendChild(document.createElement("br"))
Home.appendChild(addButton);
Home.appendChild(showButton)



export default Home;