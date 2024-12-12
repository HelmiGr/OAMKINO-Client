import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/api";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import "../../styles/favourite/favourite.css";

const FavouritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;

      try {
        const response = await apiClient.get("/favorites");
        const favoriteMovies = response.data.favorites;
        setFavorites(favoriteMovies);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [token]);

  const handleUnfavorite = async (favoriteId) => {
    try {
      await apiClient.delete("/favorites/remove", {
        data: { id: favoriteId },
      });

      toast.success("Movie unfavorited!");

      setFavorites((prevFavorites) =>
        prevFavorites.filter((movie) => movie.id !== favoriteId)
      );
    } catch (error) {
      toast.error("Error unfavoriting movie!");
      console.error("Error unfavoriting movie:", error);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="login-container">
        <h2>You are not logged in</h2>
        <button className="login-button" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="favourite-page">
      <div className="favourite-list">
        {favorites.length === 0 ? (
          <p style={{ color: "white" }}>
            No favorite movies yet. Start adding some!
          </p>
        ) : (
          favorites.map((movie) => (
            <FavouriteCard
              key={movie.id} // Use the id from the favorites table
              movieId={movie.movie_id}
              favoriteId={movie.id} // Pass the id from the favorites table
              onUnfavorite={handleUnfavorite}
            />
          ))
        )}
      </div>
    </div>
  );
};

const FavouriteCard = ({ movieId, favoriteId, onUnfavorite }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://www.finnkino.fi/xml/Events?eventID=${movieId}`
        );
        const data = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");
        const movieDetails = xml;

        if (movieDetails) {
          setMovie({
            id: movieDetails.querySelector("ID")?.textContent,
            title: movieDetails.querySelector("Title")?.textContent,
            productionYear:
              movieDetails.querySelector("ProductionYear")?.textContent,
            genres: movieDetails.querySelector("Genres")?.textContent,
            imageUrl: movieDetails.querySelector(
              "Images > EventMediumImagePortrait"
            )?.textContent,
            synopsis: movieDetails.querySelector("Synopsis")?.textContent,
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <div className="movie-card loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-card">
        <p>Movie not found.</p>
      </div>
    );
  }

  return (
    <div className="movie-card">
      <h3>{movie.title}</h3>
      <p>Genre: {movie.genres || "Unknown"}</p>
      <p>Release Date: {movie.productionYear || "Unknown"}</p>
      <img src={movie.imageUrl} alt={movie.title} />
      <button
        className="unfavourite-button"
        onClick={() => onUnfavorite(favoriteId)}
      >
        Unfavorite
      </button>
    </div>
  );
};

export default FavouritePage;
