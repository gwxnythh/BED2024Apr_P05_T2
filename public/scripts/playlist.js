const createPlaylistBtn = document.getElementById('create-playlist-btn');
if (createPlaylistBtn) {
    createPlaylistBtn.addEventListener('click', onCreatePlaylistClick);
}

async function onCreatePlaylistClick (event) {
    // validate input
    event.preventDefault();
    
    let formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('thumbnail', document.getElementById('thumbnail').files[0]);
    // TODO: Replace username with actual logged in user
    formData.append("username", localStorage.getItem('username'));
    
    try {
        const response = await fetch('http://localhost:3000/playlists', {
            method: 'POST',
            body: formData
        });
    
        if (!response.ok) {
            throw new Error('Failed to create playlist');
        }
    
        const data = await response.json();
        alert("Playlist created successfully");
        window.location.href = 'playlists-instructor.html'
    } catch (error) {
        console.error('Error creating playlist:', error);
    }
}