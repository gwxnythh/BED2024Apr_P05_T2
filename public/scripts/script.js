// Sidebar Open/Close + Light/Dark Mode
const body = document.querySelector("body"),
      sidebar = body.querySelector(".sidebar"),
      toggle = body.querySelector(".toggle"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text");

// Check for saved mode in localStorage
const savedMode = localStorage.getItem("mode");
if (savedMode) {
    body.classList.add(savedMode);
    modeText.innerText = savedMode === "dark" ? "Light Mode" : "Dark Mode";
}

// Check for saved sidebar state in localStorage
const sidebarState = localStorage.getItem("sidebarState");
if (sidebarState === "open") {
    sidebar.classList.remove("close");
} else {
    sidebar.classList.add("close");
}

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    // Save sidebar state to localStorage
    const state = sidebar.classList.contains("close") ? "closed" : "open";
    localStorage.setItem("sidebarState", state);
});

modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");
    let mode = "light";
    if (body.classList.contains("dark")) {
        mode = "dark";
        modeText.innerText = "Light Mode";
    } else {
        modeText.innerText = "Dark Mode";
    }
    // Save mode to localStorage
    localStorage.setItem("mode", mode);
});

// Function to update login/logout link
function updateLoginLogoutLink() {
    const loginLogoutLink = document.getElementById('login-logout-link');
    const loginLogoutText = document.getElementById('login-logout-text');
    const loginLogoutIcon = document.getElementById('login-logout-icon');

    const token = localStorage.getItem('token');

    if (token) {
        // User is logged in
        loginLogoutLink.href = "#"; // Add the URL to logout functionality if available
        loginLogoutText.innerText = "Logout";
        loginLogoutIcon.className = 'bx bx-log-out icon';
        loginLogoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            // Perform logout actions
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            alert('Logged out successfully');
            window.location.href = '../login.html';
        });
    } else {
        // User is not logged in
        loginLogoutLink.href = "../login.html";
        loginLogoutText.innerText = "Login";
        loginLogoutIcon.className = 'bx bx-log-in icon';
    }
}

// Call the function to set the initial state
updateLoginLogoutLink();