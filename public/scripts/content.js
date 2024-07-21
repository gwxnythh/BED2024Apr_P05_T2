const createContentBtn = document.getElementById('create-content-btn');
if (createContentBtn) {
    createContentBtn.addEventListener('click', onCreateContentClick);
}

async function onCreateContentClick (event) {
    event.preventDefault();
    
    let formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('playlist', document.getElementById('playlist').value);
    formData.append('thumbnail', document.getElementById('thumbnail').files[0]);
    formData.append('video', document.getElementById('video').files[0]);

    // TODO: Replace username with actual logged in user
    formData.append("username", localStorage.getItem('username'));
    
    try {
        const response = await fetch('http://localhost:3000/contents', {
            method: 'POST',
            body: formData
        });
    
        if (!response.ok) {
            throw new Error('Failed to create content');
        }
    
        const data = await response.json();
        alert("Content created successfully");
        window.location.href = 'contents-instructor.html'
    } catch (error) {
        console.error('Error creating content:', error);
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    const dropdown = document.getElementById('playlist');

    try {
      const response = await fetch('http://localhost:3000/playlists');
      if (!response.ok) {
        throw new Error('Failed to fetch options');
      }
      const data = await response.json();

      // Clear default loading option
      dropdown.innerHTML = '';
      data.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.textContent = option.Title;
        optionElement.value = option.playlistId; 
        dropdown.appendChild(optionElement);
      });

    } catch (error) {
      console.error('Error fetching options:', error);
      dropdown.innerHTML = '<option>Error fetching options</option>';
    }
  });