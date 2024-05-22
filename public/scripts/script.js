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

// User Role Selector
function selectUserRole(event, role) {
    // Log the selected role to the console
    console.log('Selected role:', role);
    
    // Disable click events on all cards and reduce opacity
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (card !== event.currentTarget) {
            card.style.opacity = '0.5';
            card.removeEventListener('click', selectUserRole);
            card.style.border = 'none';
        }
    });
    
    // Highlight the selected card
    const selectedCard = event.currentTarget;
    selectedCard.style.opacity = '1';
    selectedCard.style.border = '3px solid #e79a66';
    selectedCard.classList.add('selected');
}

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

        reader.addEventListener("error", function(event) {
            console.error("Error reading the file:", event.target.error);
        });

        reader.readAsDataURL(file);
    } else {
        console.error("No file selected.");
    }
});