const getProfile = async () => {
    const token = localStorage.getItem('token');
    console.log('Token retrieved:', token); // Log the token retrieval
    if (!token) {
        console.log('No token found, please login first');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    try {
        console.log('Making fetch request to http://localhost:3000/profile'); // Update this log
        const response = await fetch('http://localhost:3000/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Fetch response:', response);
        if (response.ok) {
            const userProfile = await response.json();
            console.log('User profile:', userProfile); // Log the user profile
            updateProfileUI(userProfile);
        } else {
            console.log('Failed to fetch user profile');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
};

const updateProfileUI = (user) => {
    console.log('Updating profile UI with user:', user);
    document.getElementById('username').textContent = user.username;
    document.getElementById('name').textContent = user.name;
    document.getElementById('email').textContent = user.email;
    document.getElementById('role').textContent = user.role;
};

document.addEventListener('DOMContentLoaded', () => {
    getProfile();
});
