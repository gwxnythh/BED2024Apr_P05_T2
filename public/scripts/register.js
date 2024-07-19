// const { password } = require("../../dbConfig");

const registerBtn = document.getElementById('register-btn');
if (registerBtn) {
    registerBtn.addEventListener('click', onRegisterClick);
}

// User Role Selector
function selectUserRole(event, role) {
    console.log('Selected role:', role);
    document.getElementById('role').value = role;

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (card !== event.currentTarget) {
            card.style.opacity = '0.5';
            card.style.border = '1px solid var(--secondary-color-light)';
            card.removeEventListener('click', selectUserRole);
        } else {
            card.style.opacity = '1';
            card.style.border = '3px solid var(--primary-color)';
            card.classList.add('selected');
        }
    });
}

function onRegisterClick () {
    var form = {
        username: document.getElementById("create-username").value,
        name: document.getElementById("create-name").value,
        email: document.getElementById("create-email").value,
        password: document.getElementById("create-password").value,
        confirmPassword: document.getElementById("confirm-password").value,
        role: document.getElementById('role').value
    }
    invokeRegisterUserAPI(form);
}

function invokeRegisterUserAPI(form) {
    const registerURL = 'http://localhost:3000/register';
    console.log('form: ', form);
    // validation check
    if (form.password !== form.confirmPassword) {
        alert("Password and confirm password does not match");
        return;
    }

    const userData = {
        username: form.username,
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
    };

    console.log('invoke: ', userData);

    fetch(
      registerURL,
      {            
          headers: { "Content-Type": "application/json" },            
          method: "POST",
          body: JSON.stringify(userData)
      }
     )
     .then(response => {
        if (!response.ok) {
            return response.json();
        }
        return response.json();
    })
    .then(json => {
        if (json.errors) {
            alert(json.errors);
        } else {
            alert("User created successfully");
            window.location.href = 'login.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error);
    });
    return false;
}