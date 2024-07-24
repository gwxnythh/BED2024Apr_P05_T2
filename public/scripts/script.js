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


// Sidebar Open/Close + Light/Dark Mode
// const body = document.querySelector("body"),
//     sidebar = body.querySelector(".sidebar"),
//     toggle = body.querySelector(".toggle"),
//     modeSwitch = body.querySelector(".toggle-switch"),
//     modeText = body.querySelector(".mode-text");

// toggle.addEventListener("click", () => {
//     sidebar.classList.toggle("close");
// });

// modeSwitch.addEventListener("click", () => {
//     body.classList.toggle("dark");

//     if (body.classList.contains("dark")) {
//         modeText.innerText = "Light Mode"
//     } else {
//         modeText.innerText = "Dark Mode"
//     }
    
// });