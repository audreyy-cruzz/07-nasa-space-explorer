// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
setupDateInputs(startInput, endInput);

// Find the "Get Space Images" button
const button = document.querySelector('.filters button');

// Find the gallery where images will be shown
const gallery = document.getElementById('gallery');

// === BEGINNER: Fun "Did You Know?" Space Facts Section ===

// Array of fun space facts
const spaceFacts = [
  "Did you know? A day on Venus is longer than a year on Venus!",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second.",
  "Did you know? One million Earths could fit inside the Sun.",
  "Did you know? There are more trees on Earth than stars in the Milky Way.",
  "Did you know? The footprints on the Moon will be there for millions of years.",
  "Did you know? Jupiter has 95 known moons!",
  "Did you know? Space is completely silent—there’s no air for sound to travel.",
  "Did you know? The hottest planet in our solar system is Venus.",
  "Did you know? The largest volcano in the solar system is on Mars.",
  "Did you know? Saturn could float in water because it’s mostly gas."
];

// Pick a random fact from the array
const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

// Create a new div for the fact and add it above the gallery
const factDiv = document.createElement('div');
factDiv.className = 'space-fact';
factDiv.innerHTML = `<strong>${randomFact}</strong>`;

// Insert the factDiv before the gallery in the DOM
gallery.parentNode.insertBefore(factDiv, gallery);

// === END Fun Facts Section ===

// Your NASA API key (use 'DEMO_KEY' for testing)
const apiKey = 'rE6KfPkp5QVl2JIDP3Ptggu3X3Dzbzl7xcxrSrmo';

// Function to create and show the modal
function showModal(item) {
  // Create the modal background
  const modalBg = document.createElement('div');
  modalBg.className = 'modal-bg';

  // Create the modal content
  const modal = document.createElement('div');
  modal.className = 'modal';

  // If the item is an image, show the image
  // If the item is a video, embed the video or show a link
  let mediaContent = '';
  if (item.media_type === 'image') {
    mediaContent = `<img src="${item.hdurl || item.url}" alt="${item.title}" class="modal-image" />`;
  } else if (item.media_type === 'video') {
    // If it's a YouTube video, embed it
    if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
      // Extract the YouTube video ID
      let videoId = '';
      const youtubeMatch = item.url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
      if (youtubeMatch && youtubeMatch[1]) {
        videoId = youtubeMatch[1];
      }
      if (videoId) {
        mediaContent = `
          <div class="modal-video">
            <iframe width="100%" height="300" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
          </div>
        `;
      } else {
        // If we can't extract the ID, just show a link
        mediaContent = `<a href="${item.url}" target="_blank" class="modal-video-link">Watch Video</a>`;
      }
    } else {
      // For other videos, just show a link
      mediaContent = `<a href="${item.url}" target="_blank" class="modal-video-link">Watch Video</a>`;
    }
  }

  // Add the media, title, date, and explanation
  modal.innerHTML = `
    <button class="modal-close">&times;</button>
    ${mediaContent}
    <h2>${item.title}</h2>
    <p class="modal-date">${item.date}</p>
    <p class="modal-explanation">${item.explanation}</p>
  `;

  // Add modal to the background
  modalBg.appendChild(modal);
  document.body.appendChild(modalBg);

  // Close modal on button click or background click
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', () => document.body.removeChild(modalBg));
  modalBg.addEventListener('click', (e) => {
    if (e.target === modalBg) {
      document.body.removeChild(modalBg);
    }
  });
}

// When the button is clicked, fetch images from NASA's API
button.addEventListener('click', () => {
  // Show a loading message before fetching data
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🚀</div>
      <p>Loading images from NASA... Please wait!</p>
    </div>
  `;

  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Build the API URL with the selected dates and API key
  const url = `https://api.nasa.gov/planetary/apod?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

  // Fetch data from NASA's API
  fetch(url)
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
      // Clear the gallery
      gallery.innerHTML = '';

      // If data is not an array (single result), make it an array
      const images = Array.isArray(data) ? data : [data];

      // Loop through each item and add it to the gallery
      images.forEach(item => {
        // Create a div for each gallery item
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-item'; // Use 'gallery-item' for correct styling

        // If it's an image, show the image and title
        if (item.media_type === 'image') {
          itemDiv.innerHTML = `
            <img src="${item.url}" alt="${item.title}" />
            <h3>${item.title}</h3>
            <p>${item.date}</p>
          `;
        } else if (item.media_type === 'video') {
          // If it's a video, show a thumbnail if available, or a video icon and a link
          let videoThumb = '';
          if (item.thumbnail_url) {
            videoThumb = `<img src="${item.thumbnail_url}" alt="Video thumbnail" />`;
          } else {
            videoThumb = `<div style="font-size:48px; margin-bottom:10px;">🎬</div>`;
          }
          itemDiv.innerHTML = `
            ${videoThumb}
            <h3>${item.title}</h3>
            <p>${item.date}</p>
            <a href="${item.url}" target="_blank" class="video-link">Watch Video</a>
          `;
        }

        // When the item is clicked, show the modal
        itemDiv.addEventListener('click', () => showModal(item));

        // Add the item div to the gallery
        gallery.appendChild(itemDiv);
      });

      // If no items found, show a message
      if (gallery.innerHTML === '') {
        gallery.innerHTML = '<p>No images or videos found for this date range.</p>';
      }
    })
    .catch(error => {
      // Show an error message if something goes wrong
      gallery.innerHTML = '<p>Sorry, there was a problem loading images.</p>';
      console.error('Error fetching data:', error);
    });
});
