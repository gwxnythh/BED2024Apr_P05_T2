const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', onLoginClick);
}

function onLoginClick (event) {
    console.log('onloginclick')
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
        console.log('response: ', response);
        return response.json().then(json => {
            return {
                status: response.status,
                body: json
            }
        });
    })
    .then(({status, body}) => {
        if (status !== 200) {
            if (body.message === "Invalid username or password") {
                alert("Invalid username or password. Please try again.");
            } else {
                alert("An error occurred: " + body.message);
            }
        } else {
            localStorage.setItem("username", body.username);
            localStorage.setItem("token", body.token);
            localStorage.setItem("role", body.role);
            if (body.role === "Instructor") {
                window.location.href = './instructor/instructor-index.html';
            } else if (body.role === "Member") {
                window.location.href = './member/index.html';
            } else if (body.role === "C.S Staff") {
                window.location.href = './cs-staff/issues.html';
            } else if (body.role === "Examiner") {
                window.location.href = './examiner/quiz.html';
            }
            alert("Sign in successfully");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred. Please try again later.");
    });
    return false;
}
