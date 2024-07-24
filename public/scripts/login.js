const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', onLoginClick);
}

function onLoginClick (event) {
    console.log('onloginclik')
    event.preventDefault();
    var form = {
        username: document.getElementById("login-username").value,
        password: document.getElementById("login-password").value,
    }
    invokeLoginUserAPI(form);
}

function invokeLoginUserAPI(form) {
    const loginURL = 'http://localhost:3000/login';
    console.log('form: ', form);
    const userData = {
        username: form.username,
        password: form.password
    };

    fetch(
        loginURL,
      {            
          headers: { "Content-Type": "application/json" },            
          method: "POST",
          body: JSON.stringify(userData)
      }
     )
     .then(response => {
        console.log('response: ', response)
        if (!response.ok) {
            return response.json();
        }
        return response.json();
    })
    .then(json => {
        if (json.errors) {
            alert(json.errors);
        } else {
            localStorage.setItem("username", json.username);
            localStorage.setItem("token", json.token);
            localStorage.setItem("role", json.role);
            if (json.role === "Instructor") {
                window.location.href = './instructor/instructor-index.html';
            } else if (json.role === "Member") {
                window.location.href = './member/profile-member.html';
            } else if (json.role === "C.S Staff") {
                window.location.href = './cs-staff/issues.html';
            } else if (json.role === "Examiner") {
                window.location.href = './examiner/quiz.html';
            }
            alert("Sign in successfully");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error);
    });
    return false;
}