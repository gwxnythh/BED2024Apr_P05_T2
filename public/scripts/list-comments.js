document.addEventListener('DOMContentLoaded', async function() {
    const container = document.getElementById('instructor-comments'); // Assuming you have a container div with id 'comments-container'

    const response = await fetch('http://localhost:3000/comments');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const comments = await response.json();

    // Loop through commentsData array and create HTML for each comment
    comments.forEach(comment => {
        // Create main comment div
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');

        // Create inner content div
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('comments-content');

        // Create profile picture div and image
        const pfpDiv = document.createElement('div');
        pfpDiv.classList.add('comments-pfp');
        const pfpImg = document.createElement('img');
        pfpImg.src = '../../images/profile.jpg'; // Replace with actual profile picture URL
        pfpImg.alt = 'pfp';
        pfpDiv.appendChild(pfpImg);

        // Create comments info div
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('comments-info');

        // Create comments header
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('comments-header');
        const usernameSpan = document.createElement('span');
        usernameSpan.classList.add('comments-username');
        usernameSpan.textContent = comment.username;
        const dashSpan = document.createElement('span');
        dashSpan.textContent = ' - ';
        const vidTitleSpan = document.createElement('span');
        vidTitleSpan.classList.add('comments-vidtitle');
        vidTitleSpan.textContent = comment.Title;
        const dateSpan = document.createElement('span');
        dateSpan.classList.add('comments-date');
        // Format date
        const commentDate = new Date(comment.datePosted);
        const formattedDate = commentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateSpan.textContent = formattedDate;

        headerDiv.appendChild(usernameSpan);
        headerDiv.appendChild(dashSpan);
        headerDiv.appendChild(vidTitleSpan);
        headerDiv.appendChild(dashSpan.cloneNode(true)); // Clone dashSpan for spacing
        headerDiv.appendChild(dateSpan);

        // Create user comment span
        const userCommentSpan = document.createElement('span');
        userCommentSpan.classList.add('user-comments');
        userCommentSpan.textContent = comment.content;

        // Append all elements to contentDiv
        infoDiv.appendChild(headerDiv);
        infoDiv.appendChild(userCommentSpan);

        contentDiv.appendChild(pfpDiv);
        contentDiv.appendChild(infoDiv);

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '<i class="bx bxs-trash"></i>';
        deleteButton.addEventListener('click', async function(event) {
            event.preventDefault();
            try {
              const deleteResponse = await fetch(`http://localhost:3000/comments/${comment.id}`, {
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

        // Append contentDiv and deleteButton to commentDiv
        commentDiv.appendChild(contentDiv);
        commentDiv.appendChild(deleteButton);

        // Append commentDiv to container
        container.appendChild(commentDiv);
    });
});