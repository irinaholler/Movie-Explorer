import { addToFavorites, displayFavorites } from "./addFavorites.js";

const API_KEY = '346db98cdd149d9b65a8104bba7d6173';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Add event listener to search input to trigger search on Enter key press
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search');
const autocompleteSuggestions = document.getElementById('autocomplete-suggestions');
const errorMessage = document.getElementById('error-message');
const moviesContainer = document.getElementById('movies-container');

// Add submit event to the form
// errorMessage.style.display = 'none';

searchForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form from refreshing

  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query); // Call the searchMovies function with the search query
    autocompleteSuggestions.innerHTML = ''; // Clear suggestions after submission
  } else {
    alert('Please enter a search term.');
  }
});

// Add keyup event to trigger autocomplete suggestions as the user types
searchInput.addEventListener('keyup', async (event) => {
  const query = searchInput.value.trim();

  if (query.length >= 2) { // Only trigger suggestions if the user types at least 2 characters
    try {
      const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        showSuggestions(data.results); // Display suggestions
      } else {
        autocompleteSuggestions.innerHTML = ''; // Clear suggestions if no movies found
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  } else {
    autocompleteSuggestions.innerHTML = ''; // Clear suggestions if input is too short
  }
});

// Function to display autocomplete suggestions
function showSuggestions(movies) {
  autocompleteSuggestions.innerHTML = ''; // Clear previous suggestions

  // Show a maximum of 5 suggestions
  movies.slice(0, 5).forEach(movie => {
    const suggestion = document.createElement('div');
    suggestion.textContent = movie.title;

    // Add click event to the suggestion
    suggestion.addEventListener('click', () => {
      searchInput.value = movie.title; // Set input to the selected movie title
      autocompleteSuggestions.innerHTML = ''; // Clear the suggestions
      autocompleteSuggestions.style.display = 'none';
      searchMovies(movie.title); // Optionally call the search function
    });

    autocompleteSuggestions.appendChild(suggestion); // Append the suggestion
  });
  // Show the autocomplete suggestions
  autocompleteSuggestions.style.display = 'block'; // Ensure suggestions are displayed
}

// Function to search for movies and display results
async function searchMovies(query) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      displayMovies(data.results); // Display movies if results are found
      errorMessage.style.display = 'none';
    } else {
      // Show error message if no movies are found
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'No movies found. Please try a different search term.';
      moviesContainer.innerHTML = ''; // Clear previous movie results
    }
  } catch (error) {
    console.error('Error fetching movie data:', error);
    errorMessage.textContent = 'An error occurred while fetching data.';
    errorMessage.style.display = 'block';
  }
}

// Function to display movies
// function displayMovies(movies) {
//   moviesContainer.innerHTML = ''; // Clear previous movie results

//   movies.forEach(movie => {
//     const movieCard = document.createElement('div');
//     movieCard.className = 'movie-card';

//     const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'path/to/placeholder-image.jpg';

//     movieCard.innerHTML = `
//       <img src="${posterUrl}" alt="${movie.title} Poster">
//       <h3>${movie.title}</h3>
//       <h4>Rating: ${movie.vote_average}</h4>
//       <p>${movie.overview}</p>
//     `;

//     moviesContainer.appendChild(movieCard); // Append the movie card to the container
//   });
// }

const clearInput = document.getElementById('clear-input');

clearInput.addEventListener('click', () => {
  searchInput.value = ''; // Clear the input value
  autocompleteSuggestions.innerHTML = ''; // Clear suggestions if any
  autocompleteSuggestions.style.display = 'none'; // Hide suggestions
});



// Function to display movies
function displayMovies(movies) {
  moviesContainer.innerHTML = ''; // Clear previous movie results

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';

    const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'path/to/placeholder-image.jpg';

    movieCard.innerHTML = `
      <img src="${posterUrl}" alt="${movie.title} Poster">
      <h3>${movie.title}</h3>
      <h4>Rating: ${movie.vote_average}</h4>
      <span class="add-favorite" data-id="${movie.id}" data-title="${movie.title}" data-poster="${posterUrl}">Add to Favorites &#10084;</span>
      <p>${movie.overview}</p>
    `;

    moviesContainer.appendChild(movieCard); // Append the movie card to the container
  });


  // Add event listener for adding to favorites
  const favoriteIcons = document.querySelectorAll('.add-favorite');
  favoriteIcons.forEach(icon => {
    icon.addEventListener('click', (event) => {
      const movieId = icon.getAttribute('data-id');
      const movieTitle = icon.getAttribute('data-title');
      const posterPath = icon.getAttribute('data-poster');
      addToFavorites(movieId, movieTitle, posterPath); // Pass poster path
    });
  });
}

// Function to add a movie to favorites



// Add Event Listener for Removing Favorites:
document.getElementById('favorites-container').addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-favorite')) {
    console.log('Remove button clicked'); // Add this to check
    const movieId = event.target.getAttribute('data-id');
    console.log('Removing movie with ID:', movieId); // Add this to check
    removeFromFavorites(movieId);
  }
});

// Check if localStorage is Properly Updated
function removeFromFavorites(movieId) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(movie => movie.id !== movieId); // Remove the movie
  localStorage.setItem('favorites', JSON.stringify(favorites)); // Update localStorage
  displayFavorites(); // Refresh the favorites display
}

// Display Favorites on Page Load
window.onload = () => {
  displayFavorites(); // Show favorites on page load
};