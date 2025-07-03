// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Find the "Get Space Images" button and the gallery container
const getImagesButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// NASA API key (use "DEMO_KEY" for learning/demo purposes)
const NASA_API_KEY = 'Hx5VEeXdXWpmqWl5LldXcaW0phmgMWRlvDzRM5Jx';

// This function fetches APOD images from NASA's API
async function fetchAPODImages(startDate, endDate) {
  // Build the API URL with the selected dates
  const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;
  // Fetch data from NASA's API
  const response = await fetch(url);
  // Convert the response to JSON
  const data = await response.json();
  // Return the data (an array of image info)
  return data;
}

// This function creates HTML for one APOD card
function createAPODCard(apod, index) {
  // Only show images (skip videos)
  if (apod.media_type !== 'image') {
    return '';
  }
  // Each card gets a data-index attribute so we know which APOD it is
  return `
    <div class="gallery-item" data-index="${index}">
      <img src="${apod.url}" alt="${apod.title}" />
      <h3>${apod.title}</h3>
      <p>${apod.date}</p>
    </div>
  `;
}

// Create and add the modal HTML to the page (hidden by default)
const modal = document.createElement('div');
modal.id = 'imageModal';
modal.style.display = 'none'; // Hide modal initially
modal.innerHTML = `
  <div class="modal-content">
    <span class="close-btn">&times;</span>
    <img id="modalImage" src="" alt="" />
    <h3 id="modalTitle"></h3>
    <p id="modalDate"></p>
    <p id="modalExplanation"></p>
  </div>
`;
// Add some simple modal styles for beginners
modal.style.position = 'fixed';
modal.style.top = '0';
modal.style.left = '0';
modal.style.width = '100vw';
modal.style.height = '100vh';
modal.style.background = 'rgba(0,0,0,0.7)';
modal.style.justifyContent = 'center';
modal.style.alignItems = 'center';
modal.style.zIndex = '1000';
modal.style.display = 'none';
modal.style.flexDirection = 'column';
modal.querySelector('.modal-content').style.background = '#fff';
modal.querySelector('.modal-content').style.padding = '20px';
modal.querySelector('.modal-content').style.borderRadius = '8px';
modal.querySelector('.modal-content').style.maxWidth = '90vw';
modal.querySelector('.modal-content').style.maxHeight = '90vh';
modal.querySelector('.modal-content').style.overflowY = 'auto';
modal.querySelector('#modalImage').style.maxWidth = '100%';
modal.querySelector('#modalImage').style.height = 'auto';
modal.querySelector('.close-btn').style.cursor = 'pointer';
modal.querySelector('.close-btn').style.fontSize = '2rem';
modal.querySelector('.close-btn').style.float = 'right';
modal.querySelector('.close-btn').style.marginBottom = '10px';
modal.querySelector('.close-btn').style.display = 'inline-block';
modal.querySelector('.close-btn').style.color = '#333';
modal.querySelector('.close-btn').style.fontWeight = 'bold';
modal.querySelector('.close-btn').style.background = 'none';
modal.querySelector('.close-btn').style.border = 'none';
modal.querySelector('.close-btn').style.outline = 'none';
modal.querySelector('.close-btn').style.lineHeight = '1';
modal.querySelector('.close-btn').style.marginLeft = 'auto';
modal.querySelector('.close-btn').style.marginRight = '0';

modal.style.display = 'none'; // Hide again after styling

document.body.appendChild(modal);

// Function to open the modal with APOD data
function openModal(apod) {
  // Set modal content
  document.getElementById('modalImage').src = apod.hdurl || apod.url;
  document.getElementById('modalImage').alt = apod.title;
  document.getElementById('modalTitle').textContent = apod.title;
  document.getElementById('modalDate').textContent = apod.date;
  document.getElementById('modalExplanation').textContent = apod.explanation;
  // Show the modal
  modal.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';
}

// Close modal when clicking the close button or outside modal content
modal.querySelector('.close-btn').addEventListener('click', closeModal);
modal.addEventListener('click', function(event) {
  if (event.target === modal) {
    closeModal();
  }
});

// This function updates the gallery with new images
async function updateGallery() {
  // Get the selected start and end dates from the inputs
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Show a loading message
  gallery.innerHTML = '<p>Loading images...</p>';

  try {
    // Fetch APOD images from NASA
    const apods = await fetchAPODImages(startDate, endDate);

    // Filter to only images and get up to 9
    const imageApods = apods.filter(apod => apod.media_type === 'image').slice(0, 9);

    // If no images found, show a message
    if (imageApods.length === 0) {
      gallery.innerHTML = '<p>No images found for this date range.</p>';
      return;
    }

    // Create HTML for all image cards, passing index for data-index
    const cardsHtml = imageApods.map((apod, i) => createAPODCard(apod, i)).join('');

    // Update the gallery with the new cards
    gallery.innerHTML = cardsHtml;

    // Add click event listeners to each gallery item to open the modal
    const items = gallery.querySelectorAll('.gallery-item');
    items.forEach(item => {
      item.addEventListener('click', function() {
        // Get the index of the clicked item
        const index = parseInt(item.getAttribute('data-index'));
        // Open the modal with the corresponding APOD data
        openModal(imageApods[index]);
      });
    });
  } catch (error) {
    // Show an error message if something goes wrong
    gallery.innerHTML = '<p>Sorry, there was a problem loading images.</p>';
  }
}

// Array of fun "Did You Know?" space facts
const spaceFacts = [
  "Did you know? A day on Venus is longer than a year on Venus!",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second.",
  "Did you know? There are more trees on Earth than stars in the Milky Way.",
  "Did you know? One million Earths could fit inside the Sun.",
  "Did you know? Space is completely silent—there’s no air for sound to travel.",
  "Did you know? The footprints on the Moon will be there for millions of years.",
  "Did you know? Jupiter has 95 known moons as of 2023.",
  "Did you know? The hottest planet in our solar system is Venus.",
  "Did you know? Saturn could float in water because it’s mostly made of gas.",
  "Did you know? The International Space Station travels at 28,000 km/h (17,500 mph)."
];

// Function to show a random fact in the Did You Know section
function showRandomFact() {
  // Pick a random index from the facts array
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  // Get the fact
  const fact = spaceFacts[randomIndex];
  // Find the section and set its HTML
  const factSection = document.getElementById('didYouKnow');
  if (factSection) {
    factSection.innerHTML = `<strong>${fact}</strong>`;
  }
}

// Show a random fact when the page loads
showRandomFact();

// When the button is clicked, update the gallery
getImagesButton.addEventListener('click', updateGallery);