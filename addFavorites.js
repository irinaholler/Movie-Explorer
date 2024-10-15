function addToFavorites(movieId, movieTitle, posterPath) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.find((movie) => movie.id === movieId)) {
    favorites.push({ id: movieId, title: movieTitle, poster_path: posterPath }); // Save poster path
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites(); // Refresh the favorites display
  } else {
    alert("Movie already in favorites");
  }
}

function displayFavorites() {
  const favoritesContainer = document.getElementById("favorites-container");
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favoritesContainer.innerHTML = ""; // Clear previous favorites

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p>No favorite movies added yet.</p>";
    return;
  }

  favorites.forEach((favorite) => {
    const favoriteCard = document.createElement("div");
    favoriteCard.className = "movie-card";

    const posterUrl = favorite.poster_path
      ? favorite.poster_path
      : "path/to/placeholder-image.jpg";

    favoriteCard.innerHTML = `
        <img src="${posterUrl}" alt="${favorite.title} Poster">
        <h3>${favorite.title}</h3>
        <span class="remove-favorite" data-id="${favorite.id}">&#10084;</span> <!-- Heart icon for removing -->
      `;

    favoritesContainer.appendChild(favoriteCard);
  });
}

export { addToFavorites, displayFavorites };
