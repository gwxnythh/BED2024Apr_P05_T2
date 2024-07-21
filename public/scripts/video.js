document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    console.log('video.html: ', videoId)

    hideAddComment();

    fetch(`http://localhost:3000/contents/${videoId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch details');
        }
        return response.json();
      })
      .then(data => {
        document.getElementById('video-title').textContent = data.Title;
        document.getElementById('video-description').textContent = data.Description;

        const date = new Date(data.dateUploaded);
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
        document.getElementById('video-date-upload').textContent = formattedDate;

        const video = document.getElementById('content-video');
        const source = document.createElement('source');
        source.src = '../../../' + data.Video;
        source.type = 'video/mp4'; 
        while (video.firstChild) {
            video.removeChild(video.firstChild);
        }
        
        // Append the new source to the video element
        video.appendChild(source);
      })
      .catch(error => {
        console.error('Error fetching details:', error);
        document.getElementById('detailsContainer').innerHTML = '<p>Error fetching details</p>';
      });


      const commentList = document.getElementById('comment-list');

      fetch(`http://localhost:3000/comments/${videoId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch details');
        }
        return response.json();
      })
      .then(data => {
        // Iterate over fetched data and create cards
        data.forEach(card => {
            // Create card container
            const commentElement = document.createElement('div');
            commentElement.classList.add('card');

            // Create profile picture
            const profilePicElement = document.createElement('img');
            profilePicElement.src = '../../../public/images/profile.jpg';
            profilePicElement.classList.add('profile-pic');
            profilePicElement.alt = 'thumbnail';
            commentElement.appendChild(profilePicElement);

            // Create description paragraph
            const usernameElement = document.createElement('h2');
            usernameElement.textContent = card.username; 
            commentElement.appendChild(usernameElement);
    
            // Create title
            const commentContentElement = document.createElement('p');
            commentContentElement.classList.add('title');
            commentContentElement.textContent = card.content;
            commentElement.appendChild(commentContentElement);

            // Create delete button
            if (isInstructorRole()) {
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.innerHTML = '<i class="bx bxs-trash">Delete comment</i>';
                deleteButton.addEventListener('click', async function(event) {
                    event.preventDefault();
                    try {
                    const deleteResponse = await fetch(`http://localhost:3000/comments/${card.id}`, {
                        method: 'DELETE'
                    });
                    if (!deleteResponse.ok) {
                        throw new Error('Failed to delete comment');
                    }
                    console.log('Comment deleted successfully');
                    location.reload();
                    } catch (error) {
                    console.error('Error deleting comment:', error);
                    }
                });
                commentElement.appendChild(deleteButton);
            }
    
            // Append card to container
            commentList.appendChild(commentElement);
        });

      })
      .catch(error => {
        console.error('Error fetching details:', error);
        document.getElementById('detailsContainer').innerHTML = '<p>Error fetching details</p>';
      });
      
  });


  const addCommentBtn = document.getElementById('add-comment');
if (addCommentBtn) {
    addCommentBtn.addEventListener('click', onAddCommentClick);
}

async function onAddCommentClick (event) {
    // validate input
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    var commentData = {
        content: document.getElementById('comment-textarea').value,
        username: localStorage.getItem('username'),
        videoId: videoId
    }

    try {
        const response = await fetch('http://localhost:3000/comments', 
        {            
            headers: { "Content-Type": "application/json" },            
            method: "POST",
            body: JSON.stringify(commentData)
        });
    
        if (!response.ok) {
            throw new Error('Failed to add comment');
        }
    
        const data = await response.json();
        console.log('Add comment successfully:', data);
        location.reload();
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}


function hideAddComment() {
    if (!localStorage.getItem('username')) {
        const commentContainer = document.getElementById('comment-container');
        commentContainer.style.display = 'none'
    }
}

function isInstructorRole() {
    if (!localStorage.getItem('role') || localStorage.getItem('role') !== 'Instructor') {
        return false;
    }
    return true;
}