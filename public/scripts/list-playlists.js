document.addEventListener('DOMContentLoaded', async function() {
    const cardContainer = document.getElementById('card-container');
    console.log("card-container:", cardContainer)
  
    try {
      const response = await fetch('http://localhost:3000/playlists'); 
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
  
      // Iterate over fetched data and create cards
      data.forEach(card => {
        // Create card container
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
  
        // Create date section
        const dateElement = document.createElement('div');
        dateElement.classList.add('date');
        const dateIcon = document.createElement('i');
        dateIcon.classList.add('bx', 'bx-calendar-alt');
        const dateSpan = document.createElement('span');

        
        const date = new Date(card.dateUploaded);
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);

        dateSpan.textContent = formattedDate;
        dateElement.appendChild(dateIcon);
        dateElement.appendChild(dateSpan);
        cardElement.appendChild(dateElement);
  
        // Create thumbnail image
        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = '../../../' + card.Thumbnail;
        thumbnailImg.classList.add('thumb');
        thumbnailImg.alt = 'thumbnail';
        cardElement.appendChild(thumbnailImg);
  
        // Create title
        const titleElement = document.createElement('h3');
        titleElement.classList.add('title');
        titleElement.textContent = card.Title;
        cardElement.appendChild(titleElement);
  
        // Create description paragraph
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = card.Description;
        cardElement.appendChild(descriptionElement);
  
        // Create buttons section (Update and Delete)
        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons');
        const updateLink = document.createElement('a');
        updateLink.href = './playlists-update.html';
        updateLink.classList.add('inline-btn');
        updateLink.textContent = 'Update';
        const deleteLink = document.createElement('a');
        deleteLink.href = '#';
        deleteLink.classList.add('inline-btn');
        deleteLink.textContent = 'Delete';
        deleteLink.addEventListener('click', async function(event) {
            event.preventDefault();
            try {
              const deleteResponse = await fetch(`http://localhost:3000/playlists/${card.playlistId}`, {
                method: 'DELETE'
              });
              if (!deleteResponse.ok) {
                throw new Error('Failed to delete item');
              }
              console.log('Item deleted successfully');
              location.reload();
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          });


        buttonsDiv.appendChild(updateLink);
        buttonsDiv.appendChild(deleteLink);
        cardElement.appendChild(buttonsDiv);
  
        // Create view button section
        const viewButtonDiv = document.createElement('div');
        viewButtonDiv.classList.add('view-button');
        const viewPlaylistLink = document.createElement('a');

        const urlParams = new URLSearchParams();
        urlParams.set('id', card.playlistId);

        viewPlaylistLink.href = `./playlists-contents.html?${urlParams.toString()}`;
        viewPlaylistLink.classList.add('inline-btn');
        viewPlaylistLink.textContent = 'View Playlist';
        viewButtonDiv.appendChild(viewPlaylistLink);
        cardElement.appendChild(viewButtonDiv);
  
        // Append card to container
        cardContainer.appendChild(cardElement);
      });
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });