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
            card.style.border = '1px solid var(--secondary-color-light)';
        }
    });
    
    // Highlight the selected card
    const selectedCard = event.currentTarget;
    selectedCard.style.opacity = '1';
    selectedCard.style.border = '3px solid var(--primary-color)';
    selectedCard.classList.add('selected');
}

// Upload Profile Picture
document.getElementById("profile-pic").addEventListener("click", function() {
    document.getElementById("input-file").click();
});

document.getElementById("input-file").addEventListener("change", function() {
    var input = this;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("profile-pic").src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
});