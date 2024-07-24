document.addEventListener('DOMContentLoaded', async function() {
    const cardContainer = document.getElementById('card-container');
  
    try {
      var username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:3000/contents/${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const cardData = await response.json();

      cardData.forEach(data => {
          // Create card container
          const cardDiv = document.createElement('div');
          cardDiv.classList.add('card');
  
          // Create tutor section
          const tutorDiv = document.createElement('div');
          tutorDiv.classList.add('tutor');
  
          // Create tutor image
          const tutorImg = document.createElement('img');
          tutorImg.src = '../../images/profile.jpg';
          tutorImg.alt = 'tutorpic';
  
          // Create tutor details
          const tutorDetailsDiv = document.createElement('div');
          const tutorName = document.createElement('h3');
          tutorName.textContent = data.Title;
          const dateUploaded = document.createElement('span');
            // Format date
            const commentDate = new Date(data.dateUploaded);
            const formattedDate = commentDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
          dateUploaded.textContent = formattedDate;
  
          tutorDetailsDiv.appendChild(tutorName);
          tutorDetailsDiv.appendChild(dateUploaded);
  
          tutorDiv.appendChild(tutorImg);
          tutorDiv.appendChild(tutorDetailsDiv);
  
          // Create thumbnail image
          const thumbnailImg = document.createElement('img');
          thumbnailImg.src = '../../../' + data.Thumbnail;
          thumbnailImg.classList.add('thumb');
          thumbnailImg.alt = 'thumbnail';
  
          // Create playlist title
          const titleH3 = document.createElement('h3');
          titleH3.classList.add('title');
          titleH3.textContent = data.playlistTitle;
  
          // Create button container
          const cardBtnContainer = document.createElement('div');
          cardBtnContainer.classList.add('card-container-btn');
  
          // Create Watch Video button
          const watchVideoBtn = document.createElement('a');
          const urlParams = new URLSearchParams();
          urlParams.set('id', data.VideoId);
  
          watchVideoBtn.href = `./video.html?${urlParams.toString()}`;
          watchVideoBtn.classList.add('inline-btn');
          watchVideoBtn.textContent = 'Watch Video';
  
          // Create Remove button
          const removeBtn = document.createElement('a');
          removeBtn.addEventListener('click', async function(event) {
            event.preventDefault();
            var unfavouriteData = {
                id: data.favouriteId
            }
            
            try {
                const response = await fetch('http://localhost:3000/unfavourite', 
                {            
                    headers: { "Content-Type": "application/json" },            
                    method: "DELETE",
                    body: JSON.stringify(unfavouriteData)
                });
            
                if (!response.ok) {
                    throw new Error('Failed to remove favourite');
                }
                // const data = await response.json();
                // console.log('Removed favourite successfully:', data);
                location.reload();
            } catch (error) {
                console.error('Error removing favourite:', error);
            }
          });
          removeBtn.classList.add('inline-btn');
          removeBtn.textContent = 'Remove';
  
          // Append elements to card container
          cardBtnContainer.appendChild(watchVideoBtn);
          cardBtnContainer.appendChild(removeBtn);
  
          cardDiv.appendChild(tutorDiv);
          cardDiv.appendChild(thumbnailImg);
          cardDiv.appendChild(titleH3);
          cardDiv.appendChild(cardBtnContainer);
  
          // Append card to the card container
          cardContainer.appendChild(cardDiv);
      });
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });