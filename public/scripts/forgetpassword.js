document.getElementById('forgotPasswordForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    // Perform client-side validation and mock logic
    if (!email) {
        alert('Email is required');
        return;
    }

    fetch('http://localhost:3000/forgot-password', { // Ensure the URL matches your backend endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Password reset link sent') {
            alert('Password reset link has been sent to your email.');
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});
