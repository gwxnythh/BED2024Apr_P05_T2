// Sidebar Open/Close + Light/Dark Mode
const body = document.querySelector("body"),
sidebar = body.querySelector(".sidebar"),
toggle = body.querySelector(".toggle"),
modeSwitch = body.querySelector(".toggle-switch"),
modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () =>{
    sidebar.classList.toggle("close");
});

modeSwitch.addEventListener("click", () =>{
    body.classList.toggle("dark");

    if(body.classList.contains("dark")){
        modeText.innerText = "Light Mode"
    }else{
        modeText.innerText = "Dark Mode"
    }
});

// // Selected User Role
// function selectUserRole(role) {
//     // You can do further processing here, such as sending the selected role to the server
//     console.log("Selected role:", role);

//     // If you want to send the selected role to a form field or input element, you can set its value like this:
//     // document.getElementById("selectedRoleInput").value = role;
// };

// Upload Profile Picture
const profilePic = document.getElementById("profile-pic");
const inputFile = document.getElementById("input-file");

inputFile.addEventListener("change", function() {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", function() {
            profilePic.src = reader.result;
        });

        reader.readAsDataURL(file);
    }
});
